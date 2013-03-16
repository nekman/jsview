define(
  [
    'tabs',
    'menuHandler'
  ],

  function(tabs, menuHandler) {

    var isValidUrl = function(url) {
      return /^(http|https):\/\//.test(url);
    },

    ContentScriptHandler = function() {
    };

    ContentScriptHandler.prototype = {
      execute: function(tabId) {
        menuHandler.clear();

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
        var scriptUrls = JSON.parse(message);

        menuHandler.render(scriptUrls);
      }
    };

    return new ContentScriptHandler;
});