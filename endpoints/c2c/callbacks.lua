-- Configure here the callbacks logic from the remote cloud.
-- Set the authentication logic in the authentication module.

--#ENDPOINT GET /c2c/callback
-- This endpoint enables an active notification trigger without passing the data

return require("c2c.murano2cloud").syncAll()

