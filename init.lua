
local i = require("pdaas.interface")
local m = require("pdaas.lib.migrations")
local version, error = m.run()
if error ~= nil then
  log.error("Migration failed with: " .. error)
else
  log.warn("Migration succeeded, current version: " .. tostring(version))
end
i.updateDescription()

-- Migrate config_io structure

local result = Keystore.get({ key = "config_io" })
if result ~= nil and result.value ~= nil then
  result, err = json.parse(result.value)
  if err ~= nil then
    log.error("'config_io' parsing error", err)
  else
    if result.config then
      result.config_io = result.config
      result.config = nil
    end
    if type(result.config_io) ~= "string" then
      result.config_io = json.stringify(result.config_io)
    end
    Keystore.set({ key = "config_io", value = json.stringify(result) })
  end
end
