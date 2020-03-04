-- This module cache value to local map
-- To be usefull this function requires the solution to enable the HotVM setting

-- ALL the cache is organized like this : 
--to make sure there is primary keys only
-- Key = <id_device> + "0" = topic values from device identity
-- Key = <id_device> + <channel> + "1" = port values from device identity depending channel
-- Key = <id_device> + <port> + "2" = channel values from device identity depdending port

-- TODO add size limitations/lru/background deletion options
local device2 = murano.services.device2
local cache = {}

function cache.get(key, getter, timeout)
  local now = os.time()
  if not cache[key] or cache[key].ex < now then
    local value
    if getter then
      value = getter(key)
    else
      value = Keystore.get({key = key})
      if value and value.value then
        value = value.value
      end
    end
    if value == nil or value.error or (type(value) == "table" and #value <= 0) then
      cache[key] = nil
      return nil
    end
    cache[key] = {
      ex = now + (timeout or 30), -- Expires
      value = value
    }
  end
  return cache[key].value
end

function cache.set(key, value, timeout, setter)
  if cache[key] == value then
    return
  end

  local result
  if setter then
    result = setter(key, value)
  else
    result =
      Keystore.command(
      {
        key = key,
        command = "set",
        args = {value, "EX", (timeout or 30)}
      }
    )
  end
  if result and result.error then
    return nil
  end
  cache[key] = {
    ex = os.time() + 30, -- Expires
    value = value
  }
  return value
end

function parseKey(json_doc)
  for key,value in pairs(from_json(json_doc)) do
    return key
  end
  return nil
end

-- function getPortUseDevice(values, document)
--   if values ~= nil then
--     for key, i in pairs(values) do
--       if type(document) == "table" and document.channels and document.channels[key] and document.channels[key].protocol_config and document.channels[key].protocol_config.app_specific_config and document.channels[key].protocol_config.app_specific_config.port then 
--         return tostring(document.channels[key].protocol_config.app_specific_config.port)
--       end
--     end
--   end
--   return nil
-- end

function populateCacheChannelAndPort(my_config_io)
  -- can be either exosense set config io or basic vendor.configIO file here, in a table format
  for channel, prop in pairs(my_config_io.channels) do
    if prop.protocol_config and prop.protocol_config.app_specific_config and prop.protocol_config.app_specific_config.port then
      local port = tostring(prop.protocol_config.app_specific_config.port)
      if prop.properties.control then
        cache.set(identity .. channel .. "1", port, vm_cache_timeout)
      end
      cache.set(identity .. port .. "2", channel, vm_cache_timeout)
    end
  end
end

function cacheFactory(data_device, type)
  print("regenerating cache for topic or port")
  vm_cache_timeout = 600 or os.getenv("VMCACHE_TIMEOUT")
  -- Presently use listidentities without precise args here, should further have filter to reduce cost of calls.
  -- use reported resource available in state from device2
  local reported = device2.listidentities()
  for k,v in pairs(reported.devices) do 
    local identity = v.identity

    -- should be defined after set in exosense
    local config_io = v.state.config_io

    -- should be defined after first uplink
    local lorawan_meta = v.state.lorawan_meta
    if config_io and config_io.reported and config_io.reported:sub(1, 2) ~= "<<" then
      populateCacheChannelAndPort(from_json(config_io.reported))
    else
      -- look for original file in ConfigIO.lua, but value can be wrong
      config_io = require("vendor.configIO")
      if config_io and config_io.config_io and from_json(config_io.config_io) then
        populateCacheChannelAndPort(from_json(config_io.config_io))
      end
    end
    if lorawan_meta and lorawan_meta.reported and from_json(lorawan_meta.reported) and from_json(lorawan_meta.reported).topic then
      cache.set(identity .. "0", from_json(lorawan_meta.reported).topic, vm_cache_timeout)
    end
  end
end

-- overload vmcache for MQTT senseway
function cache.getChannelUseCache(data_device_type_uplink)
  -- return : channel. taken from cache
  -- if any in cache will call cacheFactory and generate it.
  -- depends port value
  if data_device_type_uplink.mod and  data_device_type_uplink.mod.port then
    print('got channel from cache or device2 or configIO')
    local channel = cache.get(data_device_type_uplink.identity .. data_device_type_uplink.mod.port .. "2")
    if channel == nil then
      cacheFactory(data_device_type_uplink,"uplink")
      channel = cache.get(data_device_type_uplink.identity .. data_device_type_uplink.mod.port .. "2")
    end
    return channel
  end
  return nil
end

function cache.getTopicPortUseCache(data_device_downlink)
  --return : topic, port. They are taken from cache
  --if any in cache will call cacheFactory and generate it.
  local topic = cache.get(data_device_downlink.identity .. "0")
  local channel = parseKey(data_device_downlink.data_out)
  local port = cache.get(data_device_downlink.identity .. channel .. "1")
  if channel ~= nil then
    if topic == nil or port == nil then
      --regenerate cache, not call each time
      cacheFactory(data_device_downlink,"downlink")
      topic = cache.get(data_device_downlink.identity .. "0")
      port = cache.get(data_device_downlink.identity .. channel .. "1")
      -- local retrieved_data = device2.getIdentityState({identity = data_device.identity})
      -- --If user specify specific Timeout
      -- vm_cache_timeout = 600 or os.getenv("VMCACHE_TIMEOUT")
      -- if topic == nil then
      --   if retrieved_data.lorawan_meta ~= nil then
      --     --add 0 at the end of name to make sure not access to port cache
      --     topic = cache.set(data_device.identity.."0",from_json(retrieved_data.lorawan_meta.reported).topic,vm_cache_timeout)
      --   else
      --     log.error("Didn't send any Downlink: no Uplink got initially")
      --   end
      -- end
      -- if port == nil then
      --   if retrieved_data.config_io ~= nil then
      --     local port_temp = getPortUseDevice(from_json(data_device.data_out),from_json(retrieved_data.config_io.reported))
      --     if port_temp ~= nil then
      --       -- add channel also to be unique and 1 to the end to make sure access to port cache, not topic
      --       port = cache.set(data_device.identity.. channel .."1",port_temp,vm_cache_timeout)
      --     else
      --       log.error("Didn't send any Downlink: no matching values from channels in configIO and data_out, or no port added")
      --     end
      --   else
      --     log.error("Didn't send any Downlink: no exosense channel defined")
      --   end
      -- end
    end
  end
  return topic, port
end


return cache
