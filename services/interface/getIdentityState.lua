local identityState = Device2.getIdentityState(operation)
if identityState.error then return identityState end

local configIO = require("configIO")
identityState = configIO.setState(identityState);

local transform = require("vendor.transform")
if transform and transform.convertIdentityState then
  if identityState.uplink and identityState.uplink.reported then
    identityState.uplink = identityState.uplink.reported
  end  
  identityState = transform.convertIdentityState(identityState)
  identityState.data_in.reported = identityState.data_in
  identityState.data_in.set = identityState.data_in
  identityState.data_in.timestamp = identityState.uplink.timestamp
end

return identityState
