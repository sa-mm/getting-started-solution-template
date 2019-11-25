local murano2cloud = {}
-- This module maps local changes and propagate them to the 3rd party cloud
-- The operation must follow the 3rd party service swagger definition you published from ../<CloudServiceSwagger>.yaml

murano2cloud.alias = "<CloudServiceName>" -- Change this matching the 3rd party Murano service alias

local transform = require("vendor.c2c.transform")

-- Un-comment & update the below functions supported by the 3rd party API
-- Functions defined in murano2cloud matching the Device2 interface will be called by the device2.lua proxy module

-- function murano2cloud.addIdentity(data)
--   return murano.services[murano2cloud.alias].addIdentity({ identity = data.identity })
-- end
--
-- function murano2cloud.removeIdentity(identity)
--   return murano.services[murano2cloud.alias].removeIdentity({ identity = data.identity })
-- end
--
-- function murano2cloud.setIdentityState(data)
--   local identity = data.identity
--   data.identity = nil
--   data = transform.data_out(data) -- template user customized data transforms
--   return murano.services[murano2cloud.alias].setIdentitystate({ identity = identity, data = data })
-- end
--
-- Here we overload the native service object to bypass the `c2c.device2` wrapper.
-- function Device2.getIdentityState(identity)
--   local data = murano.services[murano2cloud.alias].getIdentityState({ identity = data.identity })
--   data = transform.data_in(data) -- template user customized data transforms
--   result = device2.setIdentityState({
--     identity = identity,
--     data_in = data
--   })
--   return data
-- end
--
-- -- Function for recurrent pool action
-- function murano2cloud.sync()
--   return murano.services[murano2cloud.alias].sync()
-- end

return murano2cloud
