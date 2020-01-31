
if service.service == "sigfox" and (service.action == "added" or service.action == "updated") then
  local configIO = require("configIO")
  local result = Config.getParameters({service = "sigfox"})

  config_io = configIO.build(result.parameters.callbacks or {})
  configIO.set(config_io)

  -- When Sigfox service configuration changes fetch new data
  -- Eg. if password change or else..
  Sigfox.muranoSync()
  -- Would not be needed if Sigfox uses x-exosite-init/x-exosite-update lifecycle events
end
