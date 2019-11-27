local murano2cloud = {}
-- This module maps local changes and propagate them to the 3rd party cloud
-- The operation must follow the 3rd party service swagger definition you published from ../DummyCloudService.yaml

murano2cloud.alias = "Dummycloudservice"
-- Change this matching the 3rd party Murano service alias, needs to be first letter up, rest lowercasey

local transform = require("vendor.c2c.transform")
local cloud2murano = require("c2c.cloud2murano")

-- Below function needs to use the operations defined in the 3rd party Service (/dummycloudservice.yaml) to apply the syncronisation
-- Functions defined in murano2cloud modules matching the Device2 interface will be called by the device2.lua proxy module
-- Which 1st call below functions, 2nd call the Device2 related operation.
-- See all operations available in http://docs.exosite.com/reference/services/device2

function murano2cloud.addIdentity(data)
  return murano.services[murano2cloud.alias].addIdentity({ identity = data.identity })
end

function murano2cloud.removeIdentity(data)
  return murano.services[murano2cloud.alias].removeIdentity({ identity = data.identity })
end

function murano2cloud.setIdentityState(data)
  local identity = data.identity
  data.identity = nil
  data = transform.data_out(data) -- template user customized data transforms
  return murano.services[murano2cloud.alias].setIdentitystate({ identity = identity, data = to_json(data) })
end

function murano2cloud.getIdentity(data)
  return Device2.getIdentityState(data)
end

function murano2cloud.listIdentities(data)
  return murano2cloud.syncAll({notrigger = true}) -- see below
end

-- Fetch and update 1 device, for lazy update
function murano2cloud.getIdentityState(data)
  local result = murano.services[murano2cloud.alias].getIdentityState({ identity = data.identity })
  if result then
    if result.error then
      return result
    end
    return cloud2murano.data_in(data.identity, result, {notrigger = true})
  end
end

-- Note: you can also overload the native Device2 service object to bypass the `c2c.device2` wrapper.
-- Eg function Device2.getIdentityState(data)

-- Function for recurrent pool action (not matching Device2 operations)
function murano2cloud.syncAll(options)
  local result = murano.services[murano2cloud.alias].sync()
  if result.error then
    log.error(result.error)
    return result
  end

  for i, data in ipairs(result) do
    return cloud2murano.data_in(data.identity, data, options)
  end
end

return murano2cloud
