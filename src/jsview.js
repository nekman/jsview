define(
  [
    'tabs',
    'chromeExtension',
    'menus',
    'contentScriptHandler'
  ],

  function(tabs, chromeExtension, menus, contentScriptHandler) {

    var handleOnTabUpdated = function(tabId, changeInfo, tab) {
      // Need to wait until the tab is complete.
      if (changeInfo.status === 'complete') {
          contentScriptHandler.execute(tabId);
      }
    },

    handleOnContextMenuClick = function(info, tab) {
      window.open('view-source:' + info.menuItemId, '_blank');
    },

    handleOnTabActivated = function(tab, activeInfo) {
      contentScriptHandler.execute(tab.tabId);
    };

    return {
      start: function() {
        // Only add event listeners once, on startup.
        tabs.onUpdated.addListener(handleOnTabUpdated);
        tabs.onActivated.addListener(handleOnTabActivated);
        menus.onClicked.addListener(handleOnContextMenuClick);
        chromeExtension.onMessage.addListener(contentScriptHandler.handleOnMessage);
      }
    };
});