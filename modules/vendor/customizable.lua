
-- This file will get added if missing, however it will not get updated to prevent overriding user changes.

-- All user files in this folder will also not be removed.

local behavior = {}

function behavior.api(args)
  print("Your changes to this module & path will remain upon version updates" .. to_json(args))
end

return behavior
