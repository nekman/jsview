(function() {

    var executeContentScript = function(tabId) {
      chrome.contextMenus.removeAll();

      chrome.tabs.get(tabId, function(tab) {
        if (/^(http|https):\/\//.test(tab.url)) {
          chrome.tabs.executeScript(tabId, {
            file: 'src/jsview-content.js'
          });
        }
      });
    },

    handleOnMessage = function(message, sender, sendResponse) {
      var urls = JSON.parse(message);

      urls.forEach(function(url) {
        chrome.contextMenus.create({
          title: url.split('/').pop(),
          id: url
        });
      });
    },

    handleOnContextMenuClick = function(info, tab) {
      window.open('view-source:' + info.menuItemId, '_blank');
    },

    handleOnTabUpdated = function(tabId, changeInfo, tab) {
      if (changeInfo.status === 'complete') {
          executeContentScript(tabId);
      }
    },

    handleOnTabActivated = function(tab, activeInfo) {
      executeContentScript(tab.tabId);
    };

    /* Listen to events */

    chrome.contextMenus.onClicked.addListener(handleOnContextMenuClick);
    chrome.tabs.onUpdated.addListener(handleOnTabUpdated);
    chrome.tabs.onActivated.addListener(handleOnTabActivated);
    chrome.extension.onMessage.addListener(handleOnMessage);

}());