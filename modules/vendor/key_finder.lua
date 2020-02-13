local key_finder = {}
    function key_finder.match(device, application, key)
        local config_io = device.config_io
        if (config_io == nil or config_io == {}) then
            return nil
        end

        local reported = ""
        if (config_io.reported ~= nil) then
            reported = from_json(config_io.reported)
        elseif (config_io.set ~= nil) then
            reported = from_json(config_io.set)
        else
            return nil
        end

        for channel_id, channel in pairs(reported.channels) do
            if (channel.protocol_config ~= nil and
                channel.protocol_config.application ~= nil and
                channel.protocol_config.app_specific_config ~= nil and
                channel.protocol_config.app_specific_config.key ~= nil) then
                if (channel.protocol_config.application == application and
                    channel.protocol_config.app_specific_config.key == key) then
                    return channel_id
                end
            end
        end

        return nil
  end
return key_finder
