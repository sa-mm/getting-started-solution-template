local murano2cloud = {}
-- This module maps local changes and propagate them to the 3rd party cloud

local device2  = murano.services.device2
local transform = require("vendor.c2c.transform")
local cloud2murano = require("c2c.cloud2murano")

-- create a random port for downlink
function rand_bytes(length)
  local res = ""
  for i = 1, length do
      res = res .. string.char(math.random(97, 122))
  end
  return res
end

function find_port_in_config_io(values, document)
  if values ~= nil then
    for key, i in pairs(values) do
      if document.channels and document.channels[key] and document.channels[key].protocol_config and document.channels[key].protocol_config.app_specific_config and document.channels[key].protocol_config.app_specific_config.port then 
        return tostring(document.channels[key].protocol_config.app_specific_config.port)
      end
    end
  end
  return nil
end

-- function which is the real setIndentityState
function murano2cloud.updateWithTopic(data, topic)
  local config_port_setup = find_port_in_config_io(from_json(data.data_out),from_json(device_info.config_io))
  if config_port_setup ~= nil then 
    local data_downlink = {}
    local table_result = transform.data_out and transform.data_out(from_json(data.data_out)) -- template user customized data transforms
    if table_result ~= nil then
      local message, error = device2.setIdentityState(data)
      if error then
        log.error(error)
        return false
      end
      -- As data is just the small message to send, need to get some meta data to publish to tx
      data_downlink = {
        ["cnf"] = table_result.cnf,
        -- Auto-generated
        ["ref"] = rand_bytes(12),
        ["port"] = config_port_setup,
        ["data"] = table_result.data
      }
      Mqtt.publish({body={{topic = topic, message = to_json(data_downlink)}}})
      return true
    else
      log.error("Didn't send any Downlink, no transform configured or bad resource.")
      return false
    end
  else
    log.error("Didn't send any Downlink, Port should be added in config_io")
    return false
  end
end

-- Below function uses the operations of device2, overload it.
-- See all operations available in http://docs.exosite.com/reference/services/device2,
-- but will need to associate a custom interface ( see services/interface/configure_operations)
-- data should be incomming data from Exosense
function murano2cloud.setIdentityState(data)
  if data.identity ~= nil then
    if data.config_io ~= nil then
      --just update config_io here
      Device2.setIdentityState(data)
    end
    if data.data_out ~= nil then
      local device_info = from_json(Device2.getIdentityState({["identity"] =  data.identity}).lorawan_meta.reported)
      if device_info ~= nil then
        local old_topic = device_info.topic
        local downlink_topic = string.sub(old_topic, 0, old_topic:match'^.*()/').."tx"
        return murano2cloud.updateWithTopic(data, downlink_topic)
      else
        return nil
      end
    end
  end
end




-- Function for recurrent pool action
function murano2cloud.syncAll(data)
  if data ~= nil then
    return Device2.getIdentityState(data)
  end
  return nil
end

return murano2cloud
