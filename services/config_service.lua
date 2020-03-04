
local murano2cloud = require("c2c.murano2cloud")

-- This event listen to the changes made on the mqtt to change automatically initial dedicated topic
if service.service == "mqtt" and service.action == "updated" then
  local result = Config.getParameters({service = service.service})
  if result.parameters.security ~= nil and result.parameters.security.username ~= '' and result.parameters.security.username ~= '--' then
    if(result.parameters.topics and #(result.parameters.topics)>0) then
      return
    else
      local topic_user = {}
      topic_user[1] = "lora/"..result.parameters.security.username.."/+/#"
      Config.setParameters({service = service.service, parameters = { topics = topic_user }})
    end
  end
end