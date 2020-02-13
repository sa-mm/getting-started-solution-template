--#ENDPOINT POST /data_in
local machineq_utils = require('vendor/MachineQ_utils')

-- We get the CIK here, can we do some security?
local device_id =  request.body.DevEUI
local device_provisioner = require('vendor/device_provisioner')
device = device_provisioner.is_provisioned(device_id)

if (device == false) then
  device = device_provisioner.provision_device(device_id)
end

-- Data is request.body.decoded_payload
local new_data = machineq_utils.transform_data(device, request)
print(to_json(data))


local update_object = {}
local payload = {}
update_object.identity = device_id
update_object.payload = payload
update_object.protocol = "onep:v1/http"
update_object.timestamp = os.time(os.date("!*t")) * 1000000
update_object.type = "data_in"

local payload_array = {}
payload_array.timestamp = os.time(os.date("!*t")) * 1000000
payload[1] = payload_array
local data_in_json = to_json(new_data)
update_object.payload[1].values = {}
update_object.payload[1].values.data_in = data_in_json

Device2.setIdentityState({
identity = device_id,
data_in = data_in_json
})
-- Update Data
local resp = Interface.trigger({event="event", data=update_object})
