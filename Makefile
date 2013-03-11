
JS_DIR = src/

#convert svg icon to png.
icons: 
	node $(JS_DIR)svg2png.js	

all: icons

.PHONY: icons