local cloud2murano = {}
-- This module authenticates the 3rd party cloud callback requests
-- To be updated depending on the security requirements

local transform = require("vendor.c2c.transform")
local device2 = murano.services.device2 -- to bypass the proxy (device2.lua)
-- Beware of not creating recursive reference with murano2cloud

-- Propagate event to Murano applications
function cloud2murano.trigger(identity, event_type, payload, options)
    local event = {
      ip = options.ip,
      type = event_type,
      identity = identity,
      timestamp = options.timestamp or os.time(os.date("!*t")),
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
  local result = device2.addIdentity({ identity = identity })
  if result and result.error then return result end
  if result and result.status == 204 then
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
  local data_in = to_json(transform.data_in(data))-- template user customized data transforms
  local result = device2.setIdentityState({
    identity = identity,
    data_in = data_in -- Important need to be string if object, the value will be discarded
  })

  if result and result.status == 404 then
    -- Auto register device on data_in
    result = cloud2murano.provisioned(identity, data, options)
    if result and result.error then return result end
  end
  if result and result.error then return result end
  if options and options.notrigger then return result end

  local payload = {{
    values = {
      -- Matching Exosense data format
      data_in = data_in
    },
    timestamp = (options.timestamp or os.time(os.date("!*t")))
  }}
  return cloud2murano.trigger(identity, "data_in", payload, options)
end

-- Callback Handler
-- Parse a data from 3rd part cloud into Murano event
-- Update this part to match the incoming payload content.
function cloud2murano.callback(data, options)
  -- We assume here each callback only update 1 Device. To handle batch content make a loop. (see murano2cloud.Sync)
  local identity = data.identity
  if not identity then
    log.warn("Cannot find identity in callback payload..", to_json(data))
    return {error = "Cannot find identity in callback payload.."}
  end

  if cloud2murano[data.type] then
    -- Supported types by this example are the above 'provisioned' & 'deleted' functions
    return cloud2murano[event_type](identity, data, options)
  else
    -- Assume incoming data by default
    return cloud2murano.data_in(identity, data, options)
  end
end

return cloud2murano
