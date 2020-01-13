
-- Generate callbackUrl
require("c2c.authentication").setToken()
local i = require("pdaas.interface")
local m = require("pdaas.lib.migrations")
local version, error = m.run()
if error ~= nil then
  log.error("Migration failed with: " .. error)
else
  log.warn("Migration succeeded, current version: " .. tostring(version))
end
i.updateDescription()
