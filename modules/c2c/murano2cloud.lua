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

-- Below function needs to use the operations of device2
-- can only update a device in Senseway part
-- See all operations available in http://docs.exosite.com/reference/services/device2

-- Note:  overload the native Device2 service object to bypass the `c2c.device2` wrapper.
-- function Device2.setIdentityState(data)
function murano2cloud.setIdentityState(data, topic)
  -- Data must have identity attribute
  if data.identity ~= nil then
    local message, error = device2.setIdentityState({identity = data.identity, data_out = to_json(data.state.data_out)})
    if error then
      log.error(error)
      return false
    end
    local table_result = transform.data_out and transform.data_out(data.state.data_out) -- template user customized data transforms
    if table_result == nil then
      table_result = {
        -- Basic Value
        ["port"] = 14,
        ["data_out"] = ""
      }
    end
    -- As data is just the small message to send, need to get some meta data to publish to tx
    local data_downlink = {
      ["cnf"] = true,
      -- Auto-generated
      ["ref"] = rand_bytes(12),
      ["port"] = table_result.port,
      ["data"] = table_result.data_out
    }
    Mqtt.publish({body={{topic = topic, message = to_json(data_downlink)}}})
    return true
  end
end


-- Function for recurrent pool action
function murano2cloud.syncAll(data)
  -- Data must contain all attributes 
  
  -- local state_device = from_json(device2.getIdentity({identity = data.identity}).state.lorawan_meta.reported)
  -- local lasport = state_device.mod.port
  local old_topic = data.state.lorawan_meta.reported.topic
  local downlink_topic = string.sub(old_topic, 0, old_topic:match'^.*()/').."tx"
  local published = murano2cloud.setIdentityState(data, downlink_topic)
  if not published then
    log.error('Error Data Downlink, no identity.')
  end
  return nil
end

return murano2cloud
