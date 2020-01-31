function join(t1, t2)
  for _, v in pairs(t2) do
    table.insert(t1, v)
  end
  return t1
end

if service.service == "sigfox" and (service.action == "added" or service.action == "updated") then
  local configIO = require("configIO")
  local parameters = Config.getParameters({service = "sigfox"})
  local payloadConfigs = {}

  if parameters.parameters.callbacks ~= nil then
    for k, v in pairs(parameters.parameters.callbacks) do
      if v.payloadConfig ~= nil then
        join(payloadConfigs, v.payloadConfig)
      end
      if v.metadataConfig ~= nil then
        -- metaKey is SigfoxName, metaValue is MuranoName
        for metaKey, metaValue in pairs(v.metadataConfig) do
          local def = (metaKey == "operatorName") and "char" or "number"
          join(payloadConfigs, {{resource = metaValue, definition = def}})
        end
      end
    end
  end

  local channels = {}
  for k, v in pairs(payloadConfigs) do
    local channelName, channel = configIO.createChannel(v.resource, v.definition)
    if channelName then
      channels[channelName] = channel
    end
  end

  configIO.set({ channels = channels })

  -- When Sigfox service configuration changes fetch new data
  -- Eg. if password change or else..
  Sigfox.muranoSync()
  -- Would not be needed if Sigfox uses x-exosite-init/x-exosite-update lifecycle events
end
