JS_DIR = src/

test: 
	jasmine-node test --verbose

#convert svg icon to png.
icons: 
	node svg2png.js

build: icons
	rm -rf build
	mkdir -p build
	mkdir -p build/src
	mkdir -p build/icons
	cp -r icons/* build/icons
	cp -r $(JS_DIR)* build/src
	cp manifest.json build/manifest.json
	
	zip -r build/build.`date +"%y%m%d%H%M%S"`.zip build

all: test build

.PHONY: icons test build