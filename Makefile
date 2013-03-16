
JS_DIR = src/

test: 
	jasmine-node test --verbose

#convert svg icon to png.
icons: 
	node $(JS_DIR)svg2png.js	

all: icons test

.PHONY: icons test