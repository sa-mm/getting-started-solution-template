local cloud2murano = require("c2c.cloud2murano")
for k,message in pairs(batch.messages) do
  print("receive part: "..message.topic.." "..message.payload)
  cloud2murano.callback(message)
end