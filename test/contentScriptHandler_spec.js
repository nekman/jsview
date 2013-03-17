var reDefine = require('./ReDefine.js'),
  // Fake  the 'tabs' and 'menuHandler' module.
  fakes = {
    tabs: {
      get: function(id, fn) {
        return fn(this.tabGetAnswer);        
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

  describe('Execute content scripts', function() {
    it('should execute content script', function() {
      // Arrange
      var tabId = 1;
      spyOn(fakes.tabs, 'executeScript');

      fakes.tabs.tabGetAnswer = { 
        tabId: 1, 
        url: 'http://example.com' 
      };        
      
      // Act
      sut.execute(tabId);

      // Assert
      expect(fakes.tabs.executeScript).toHaveBeenCalled();
    });
    
    it('should not execute content script in google webstore', function() {
      // Arrange
      var tabId = 1;
      spyOn(fakes.tabs, 'executeScript');

      fakes.tabs.tabGetAnswer = { 
        tabId: 1, 
        url: 'https://chrome.google.com/webstore/developer/edit/' 
      };        
      
      // Act
      sut.execute(tabId);

      // Assert
      expect(fakes.tabs.executeScript).not.toHaveBeenCalled();
    });
  });

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

