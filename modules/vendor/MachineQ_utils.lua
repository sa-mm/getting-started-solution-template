local machineq_utils = {}
      -- Decode decodes an array of bytes into an object.
      --
      --  - fPort contains the LoRaWAN fPort number
      --
      --  - bytes is an array of bytes, e.g. [225, 230, 255, 0]
      --
      -- The function must return an object, e.g. {"temperature": 22.5}
      function decode(fPort, bytes)
          obj = {}
          if (fPort == 2) then
              -- TODO:
              result = ""
              obj.version = "fPort2"
          else
              obj.rawBytes = bytes;
              obj.battery = bytes[0];
              obj.peaks = bytes[1];
              obj.temperature = bit.bor(bit.lshift(bytes[3],8), bytes[2]) / 10 - 100;
              obj.total = bit.bor(bit.lshift(bytes[5],8) , bytes[4]);
              obj.integ = bit.bor(bit.lshift(bytes[7],8) , bytes[6]);

              for i=0,(obj.peaks-1) do
                  varname = 'peak' .. (i + 1)
                  obj[varname .. 'freq'] = bit.bor(bit.lshift(bytes[i * 5 + 9],8) , bytes[i * 5 + 8]);
                  obj[varname .. 'amplitude'] = bit.bor(bit.lshift(bytes[i * 5 + 11],8) , bytes[i * 5 + 10]);
                  obj[varname .. 'percent'] = bytes[i * 5 + 12];
              end
          end
          log.info('data_in', to_json(obj))
          return obj
      end


    function machineq_utils.transform_data(device, request)

--      hexstring = "4708e804a603070108004c001acc2d0f00088c000500052201020003c9010100020631010001a81e0100015502010001"
      hexstring = request.body.payload_hex
      log.info('transform_data', hexstring)

      ret_arr = {}
      i = 0
      while (string.len(hexstring) > 1)
      do
          substring = string.sub(hexstring,1,2)
          hexstring = string.sub(hexstring,3)
          ret_arr[i] = tonumber(substring,16)
          i = i + 1
      end
      
      return decode(1, ret_arr)
    end
return machineq_utils

