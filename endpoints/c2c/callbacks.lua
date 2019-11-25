-- Configure here the callbacks logic from the remote cloud.
-- Set the authentication logic in the authentication module.

--#ENDPOINT POST /c2c/callback

-- Authenticate the 3rd party request
local peer = require("c2c.authentication").getPeer(request)

if peer == nil then
  response.code = 401
  return ""
end

local options = {
  ip = request.headers["x-forwarded-for"],
  timestamp = request.body.timestamp or request.timestamp,
  request_id = request.request_id
}

-- handle the payload content
require("c2c.cloud2murano").sync(request.body, options)
