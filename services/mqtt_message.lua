local cloud2murano = require("c2c.cloud2murano")
local regex = cloud2murano.find_regex_from_devices_list(batch.messages)
local options = {
  --add regex to list all devices from batch. Can be called if cache need to update
  regex = regex,
  updated_cache = false
}
cloud2murano.callback(batch.messages, options)


