define(
  [
    'tabs',
    'menuHandler'
  ],

  function(tabs, MenuHandler) {

    var ContentScriptHandler = function() {      
    },

    isValidUrl = function(url) {
      return /^(http|https):\/\//.test(url);
    };

    ContentScriptHandler.prototype = {
      execute: function(tabId) {
        tabs.get(tabId, function(tab) {
          if (!(tab && isValidUrl(tab.url))) {
            return;
          }
                
          tabs.executeScript(tabId, {
            file: 'src/jsview-content.js'
          });
        });
      },

      handleOnMessage: function(message) {
        var scriptUrls = JSON.parse(message),
            menuHandler = new MenuHandler(scriptUrls);

        menuHandler.render();
      }
    };

    return new ContentScriptHandler();
});