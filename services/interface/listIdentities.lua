local identities = Device2.listIdentities(operation)
if identities.error or not next(identities.devices) then return identities end

local configIO = require("configIO")
for k, identity in pairs(identities.devices) do
  identity.state = configIO.setState(identity.state);
end
local transform = require("vendor.transform")
if transform and transform.convertIdentityState then
  for k, identity in pairs(identities.devices) do
    if identity.state.uplink and identity.state.uplink.reported then
      identity.state.uplink = identity.state.uplink.reported
    end
    identity.state = transform.convertIdentityState(identity.state)
    identity.state.data_in.reported = identity.state.data_in
    -- set is always the same with reported in sigfox
    identity.state.data_in.set = identity.state.data_in
    -- fill in timestamp
    identity.state.data_in.timestamp = identity.state.uplink.timestamp
  end
end

return identities
