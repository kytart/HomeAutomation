DIST=dist
DIST_CLIENT=$(DIST)/client

all: client server

client: dist
	mkdir -p $(DIST_CLIENT)
	cp static/* $(DIST_CLIENT)
	webpack --config webpack.client.config.js

server: dist
	webpack --config webpack.server.config.js

dist:
	mkdir -p $(DIST)
