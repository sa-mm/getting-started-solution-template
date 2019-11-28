operation.solution_id = nil
local identities = Device2.listIdentities(operation)
if identities.error then
  return identities
end

local configIO = require("vendor.configIO")
if configIO and configIO.config_io and identities.devices and next(identities.devices) ~= nil then
  local config_io = {
    timestamp = (configIO.timestamp or os.time(os.date("!*t"))) * 1000000, -- from Unix timestamp (Sec) to MicroSec
    set = configIO.config_io,
    reported = configIO.config_io
  }
  for k, identity in pairs(identities.devices) do
    identities.devices[k].state.config_io = config_io
  end
end

return identities
