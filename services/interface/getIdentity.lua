local identity = Device2.getIdentity(operation)
if identity.error then return identity end

local configIO = require("configIO")
identity.state = configIO.setState(identity.state);

local transform = require("vendor.transform")
if transform and transform.convertIdentityState then
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

return identity
