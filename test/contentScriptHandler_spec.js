var reDefine = require('./ReDefine.js'),
  // Fake  the 'tabs' and 'menuHandler' module.
  fakes = {
    tabs: {
      get: function(id, fn) {
        fn();
      },
      executeScript: function() {        
      }
    },
    menuHandler: {
      render: function() {        
      },
      clear: function() {        
      }
    }

  };

describe('ContentScriptHandler', function() {
  
  var sut = reDefine
              .use(fakes)
              .require("/../src/contentScriptHandler.js");

  describe('Handles messages', function() {
   it('parses JSON and calls render on menuHandler', function() {
      // Arrange
      var scriptUrls = { 
        cssFiles: ['app.css'] 
      },
      jsonString = JSON.stringify(scriptUrls);
      spyOn(fakes.menuHandler, 'render');

      // Act
      sut.handleOnMessage(jsonString);

      // Assert
      expect(fakes.menuHandler.render).toHaveBeenCalledWith(scriptUrls);
    });
  });
});

