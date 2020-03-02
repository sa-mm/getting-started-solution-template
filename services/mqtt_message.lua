local cloud2murano = require("c2c.cloud2murano")
print("receive part: "..message.topic.." "..message.payload)
cloud2murano.callback(message)