define(
  [
    'tabs',
    'menuHandler'
  ],

  function(tabs, menuHandler) {

    var URL_PATTERN = /^(http|https):\/\//,
        WEBSTORE_URL = 'chrome.google.com/webstore/',

    ContentScriptHandler = function() {
    };

    ContentScriptHandler.prototype = {
      isValidUrl: function(url) {
        if (!url) {
          return false;
        }

        // Cannot execute script in Google Webstore
        // http://stackoverflow.com/questions/11613371/chrome-extension-content-script-on-https-chrome-google-com-webstore
        if (url.indexOf(WEBSTORE_URL) >= 0) {
          return false;
        }

        return URL_PATTERN.test(url);
      },

      tabGetCallback: function(tab) {
        if (!tab) {
          return;
        }
        if (!this.isValidUrl(tab.url)) {
          return;
        }

        tabs.executeScript(tab.tabId, {
          file: 'src/jsview-content.js'
        });
      },

      execute: function(tabId) {
        menuHandler.clear();

        tabs.get(tabId, this.tabGetCallback.bind(this));
      },

      handleOnMessage: function(message) {
        var scriptUrls = JSON.parse(message);

        menuHandler.render(scriptUrls);
      }
    };

    return new ContentScriptHandler;
});