--#ENDPOINT GET /test/interface
-- Test endpoint for subscribers communication through interface service
return Interface.trigger({
  mode = "sync",
  event = "hello"
})
