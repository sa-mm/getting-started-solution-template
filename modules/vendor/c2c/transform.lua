-- This file enable device data transformation for the template user
--
-- This file is in the 'vendor' safeNamespace and changes will persists upon template updates

local transform = {}

-- local configIO = require("vendor.configIO")
-- local parser_factory = require("bytes.parser_factory")

-- --Gives parsed data for data_in, depending port used, type of parse will be different
-- local uplink_by_ports = {
--   --port number
--   ["1"] = function (hex) 
--     return to_json({
--       --Data attribute temperature must match with configIO
--       ["Temperature"] = parser_factory.getfloat32(parser_factory.fromhex(hex),0),
--       ["Machine Status"] = parser_factory.getstring(parser_factory.fromhex(hex),4,5)
--     })
--   end
--   -- Other Cases for other ports must be implemented here
-- }

-- -- Depending name, encode data to be send in downlink, in hex value. Add also port.
-- -- On config IO, corresponding to channel(s) with control set to true in properties
-- local downlink_by_names = {
--   ["Machine Status"] = function (new_machine_status) 
--     return parser_factory.tohex(new_machine_status),2
--   end
--   -- Other Cases for other ports must be implemented
-- }


-- function transform.data_in(cloud_data)
--   -- Transform data from the 3rd party service to Murano
--   if uplink_by_ports[cloud_data.mod.port] ~= nil then
--     return uplink_by_ports[cloud_data.mod.port](cloud_data.mod.data)
--   else
--     return '{}'
--   end
-- end

-- function transform.data_out(murano_data)
--   -- Transform data from Murano to the 3rd party service : hex message in Mqtt Client.
--   for key,value in pairs(murano_data) do
--     if downlink_by_names[key] ~= nil then
--       return downlink_by_names[key](value)
--     else
--       return ''
--     end
--   end
-- end

return transform
