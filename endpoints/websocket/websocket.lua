--#ENDPOINT WEBSOCKET /ws
-- Doc: http://docs.exosite.com/reference/services/websocket/#websocket_info
if (websocketInfo.type == "open") then
  websocketInfo.send("Welcome")
elseif (websocketInfo.type == "data") then
  -- Print the incoming message and close the connection
  print(websocketInfo.message)
  websocketInfo.close()
end
