local authentication = {}
-- This module authenticates the 3rd party cloud callback requests
-- To be updated depending on the security requirements

local mcrypto = require("staging.mcrypto")

local cloudServiceName = require("c2c.murano2cloud").alias
local cache = require("c2c.vmcache")

function getToken ()
  -- This function retrieve the token from the 3rd party service parameters
  local config = Config.getParameters({service = cloudServiceName})
  -- In the case of a callback only setup, you can use ENV instead with:
  -- return os.getenv("callback_token")
  -- See ./murano.yaml configuration file for how to define ENV parameters
  return config and config.parameters and config.parameters.callback_token
end

function getDomain ()
  local config = Config.getParameters({service = "webservice"})
  return config and config.parameters and config.parameters.domain
end

function authentication.getPeer(request)
  -- Enable this line to validate incoming callback token
  -- if request.parameters.token ~= cache.get("callback_token", getToken) then
  --   In this example the token is provided as query or path parameter
  --   However you can get it from headers with `request.headers.authorization`
  --   return nil
  -- end
  return "ok"
end

function authentication.setToken(callback_token)
  -- If needed generate a token for connecting the 3rd party service to this solution
  callback_token = callback_token or mcrypto.b64url_encode(mcrypto.rand_bytes(20))

  -- Get Webservice domain parameters from configuration
  local callback_url = 'https://' .. cache.get("domain", getDomain) .. '/c2c/callback?token=' .. callback_token

  Config.setParameters({service = cloudServiceName, parameters = {
    -- to enable changing token from Murano UI
    callback_token = callback_token,
    -- so use can manually copy/past the callback url from Murano UI
    callback_url = callback_url
  }})
  return token
end

return authentication
