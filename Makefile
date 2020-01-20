DIST=dist
DIST_CLIENT=$(DIST)/client

all: client server

client: dist
	mkdir -p $(DIST_CLIENT)
	cp static/* $(DIST_CLIENT)

server: dist
	webpack

dist:
	mkdir -p $(DIST)
