local device_provisioner = {}
	function device_provisioner.is_provisioned(identity)
		local device = Device2.getIdentityState({identity = identity})
		if (device.error) then
			if (json.parse(device.error) or {}).code ~= 404 then
				log.error(json.stringify(device))
			end
			return false
		end
		return device
	end

	-- Will not check if device is already provisioned
	function device_provisioner.provision_device(identity)
		local sha256 = require('vendor.sha256')
		local addResult = Device2.addIdentity({
			identity = identity,
			auth = {
				key = string.sub(sha256(identity),1,40),
				type = 'token'
			}
		})
		if not addResult.error then
			log.info('addIdentity', identity)
		end
		local device = Device2.getIdentityState({identity = identity})
		return device
	end

return device_provisioner
