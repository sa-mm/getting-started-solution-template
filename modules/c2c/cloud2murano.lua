local cloud2murano = {}
-- This module authenticates the 3rd party cloud callback requests
-- To be updated depending on the security requirements

local configIO = require("vendor.configIO")
local transform = require("vendor.c2c.transform")
local mcrypto = require("staging.mcrypto")
local utils = require("c2c.utils")
local device2 = murano.services.device2 -- to bypass the proxy (device2.lua)
-- Beware of not creating recursive reference with murano2cloud

-- Propagate event to Murano applications
function cloud2murano.trigger(identity, event_type, payload, options)
    local event = {
      ip = options.ip,
      type = event_type,
      identity = identity,
      timestamp = utils.getTimestamp(options.timestamp),
      connection_id = options.request_id or context.tracking_id,
      payload = payload
    }

    if handle_device2_event then
      -- Triggers the Device2 event handler so the flow is the same as data coming from device2
      return handle_device2_event(event)
    end
end

function cloud2murano.provisioned(identity, data, options)
  -- A new device needs to be created
  if not options then options = {} end
  local key = mcrypto.b64url_encode(mcrypto.rand_bytes(20))
  local result = device2.addIdentity({ identity = identity, auth = { key = key, type = "password" } })
  if result and result.error then return result end

  -- Set configIO default value
  local config_io
  if configIO and configIO.set_to_device then
    config_io = configIO.config_io
  else
    config_io = "<<Config IO is defined globally in the module `vendor.configIO`.>>"
  end
  device2.setIdentityState({ identity = identity, config_io = config_io })

  if result and result.status == 204 then
    -- force to update data at first connection
    device2.setIdentityState(data)
    return cloud2murano.trigger(identity, "provisioned", nil, options)
  end
end

function cloud2murano.deleted(identity, data, options)
  local result = device2.removeIdentity({ identity = identity })
  if result.error then return result end

  return cloud2murano.trigger(identity, "deleted", nil, options)
end

-- This is function handle device data from the 3rd party
-- Also called for murano2cloud module
function cloud2murano.data_in(identity, data, options)
  if type(data) ~= "table" then return end
  if not options then options = {} end
  for k, v in pairs(data) do
    local t = type(v)
    -- Important need to be string if object, the value will be discarded
    if t ~= "string" and t ~= "number" and t ~= "boolean" then data[k] = to_json(v) end
  end

  local result = device2.setIdentityState(data)

  if result and result.status == 404 then
    -- Auto register device on data_in
    result = cloud2murano.provisioned(identity, data, options)
    if result and result.error then return result end
    result = device2.setIdentityState(data)
  end
  if result and result.error then return result end
  if options.notrigger then return result end
  data.identity = nil
  local payload = {{
    values = data,
    timestamp = utils.getTimestamp(options.timestamp)
  }}
  return cloud2murano.trigger(identity, "data_in", payload, options)
end

function cloud2murano.detect_uplink(message)
  local topic = message.topic
  if topic == 'uplink' then
    return true
  end
  return false
end
function cloud2murano.print_downlink(elem)
  if elem ~= nil then
    print("data_in not updated from: " .. elem .. ". Not an uplink")
  else
    print("data_in not updated. Not an uplink")
  end
end
function cloud2murano.print_uplink(elem)
  print(elem .. " : data_in updated.")
end
-- Callback Handler
-- Parse a data from 3rd part cloud into Murano event
function cloud2murano.callback(cloud_data, options)
  if not cloud_data then return end
  local data = from_json(cloud_data.payload)
  local final_state = {}
  if cloud2murano.detect_uplink(data) then
    if not data.id then
      log.warn("Cannot find identity (id) in callback payload..", to_json(data))
      return {error = "Cannot find identity in callback payload.."}
    end
    final_state.identity = data.id
    -- Transform will parse data, depending port value
    final_state.data_in = transform.data_in and transform.data_in(data)
    -- Need to save some metadata
    cloud2murano.print_uplink(final_state.identity)
  else
    cloud2murano.print_downlink(data.id)
    return nil
  end
  -- Supported types by this example are the above 'provisioned' & 'deleted' functions
  local handler = cloud2murano[final_state.type] or cloud2murano.data_in
  -- Assumes incoming data by default

  if final_state[1] == nil then
    -- Handle single device update
    return handler(final_state.identity, final_state, options)
  else
    -- Handle batch update
    local results = {}
    for i, data in ipairs(final_state) do
      results[i] = handler(data.identity, data, options)
    end
    return results;
  end
end

return cloud2murano
