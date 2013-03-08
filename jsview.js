(function() {
        
    var executeContentScript = function(tabId) {
      chrome.tabs.executeScript(tabId, {
          file: 'jsview-content.js'
      });
    },

    handleOnMessage = function(message, sender, sendResponse) {
        chrome.contextMenus.removeAll();

        var urls = JSON.parse(message);

        urls.forEach(function(url) {
          chrome.contextMenus.create({
            title: url,
            id: url
          });
        });
    },

    handleOnContextMenuClick = function(info, tab) {
      window.open(info.menuItemId, '_blank');
    },

    handleOnTabUpdated = function(tabId, changeInfo, tab) {            
      if (changeInfo.status === 'complete') {
        setTimeout(function() {
          executeContentScript(tabId);  
        }, 100);           
      }      
    },

    handleOnTabActivated = function(tab, activeInfo) {        
        executeContentScript(tab.tabId);  
    };

    /* Events */

    chrome.contextMenus.onClicked.addListener(handleOnContextMenuClick);
    chrome.tabs.onUpdated.addListener(handleOnTabUpdated);
    chrome.tabs.onActivated.addListener(handleOnTabActivated);
    chrome.extension.onMessage.addListener(handleOnMessage);    

}());