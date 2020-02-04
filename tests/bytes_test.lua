
local test = require 'u-test'
local parser_factory = require 'bytes.parser_factory'




test.make_first_test = function()
  local res1 = {["resource"]= "bool1", ["definition"] = ":bool:2"}
  local res2 = {["resource"]= "uint1", ["definition"] = ":uint:16"}
  local res3 = {["resource"]= "uint2", ["definition"] = ":uint:16"}
  local res4 = {["resource"] = "float1", ["definition"] = ":float:32"}
  local payloads = 
  {
    res1, res2, res3, res4
  }


  local response = parser_factory.parse_payloads(payloads,"C1234015405C8254")
  test.assert(response.bool1 == false)
  test.assert(response.uint1 == 49443)
  test.assert(response.uint2 == 16405)
  test.assert((math.abs(response.float1-3.4454545974731)<0.0001))

  
end


test.make_second_test = function()
  local res1 = {["resource"]= "uint1", ["definition"] = ":uint:16"}
  local res2 = {["resource"]= "int1", ["definition"] = ":int:16"}
  local payloads = 
  {
    res1, res2
  }


  local response = parser_factory.parse_payloads(payloads,"32408A3E")
  test.assert(response.uint1 == 12864)
  test.assert(response.int1 == -30146)
  
end
