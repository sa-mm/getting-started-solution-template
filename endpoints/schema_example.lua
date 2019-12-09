--#ENDPOINT GET /pets
--#TAGS schema
--#SECURITY none
return 'OK'

--#ENDPOINT POST /pets
--#TAGS schema
--#SECURITY none
return { name="dog", id="a1" }

--#ENDPOINT GET /pets/{id}
--#TAGS schema
--#SECURITY none
return { name="cat", id="b1" }

--#ENDPOINT DELETE /pets/{id}
--#TAGS schema
--#SECURITY none
return
