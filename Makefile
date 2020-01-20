
.PHONY: all test

TEST_LUA_PATH="./tests/deps/?.lua;./modules/?.lua;./modules/vendor/?.lua;./endpoints/?.lua"

test:
	for file in ./tests/*.lua;									      \
	do 																					      \
		LUA_PATH=$(TEST_LUA_PATH) luajit "$$file";      \
		rc=$$?; if [[ $$rc != 0 ]]; then exit $$rc; fi  \
	done