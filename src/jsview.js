(function() {

    var MENU_TEMPLATE = 'JS ({JS}) CSS ({CSS})',
        PARENT_ID = 'main',
        TYPE_JS = 'JS',
        TYPE_CSS = 'CSS',
        menus = chrome.contextMenus,
        tabs = chrome.tabs;

    executeContentScript = function(tabId) {
      menus.removeAll();

      tabs.get(tabId, function(tab) {
        if (/^(http|https):\/\//.test(tab.url)) {
          tabs.executeScript(tabId, {
            file: 'src/jsview-content.js'
          });
        }
      });
    },

    createHeaderItem = function(title) {
      menus.create({
        parentId: PARENT_ID,
        title: title,
        enabled: false
      });
    },

    createMenuItems = function(files) {
      files.forEach(function(url) {
        menus.create({
          parentId: PARENT_ID,
          title: url.split('/').pop(),
          id: url
        });
      });
    },

    createMenuSection = function(files, type) {
      createHeaderItem(type);
      createMenuItems(files);

      if (type === TYPE_JS) {
        // Add separator
        menus.create({
          parentId: PARENT_ID,
          type: 'separator'
        });
      }
    },

    handleOnMessage = function(message, sender, sendResponse) {
      var urls = JSON.parse(message),
          totalJSFiles = urls.jsFiles.length,
          totalCSSFiles = urls.cssFiles.length;

      // Create main menu
      menus.create({
        id: PARENT_ID,
        title: MENU_TEMPLATE
                .replace(/{JS}/, totalJSFiles)
                .replace(/{CSS}/, totalCSSFiles)
      });

      totalJSFiles && createMenuSection(urls.jsFiles, TYPE_JS);
      totalCSSFiles &&  createMenuSection(urls.cssFiles, TYPE_CSS);
    },

    handleOnContextMenuClick = function(info, tab) {
      window.open('view-source:' + info.menuItemId, '_blank');
    },

    handleOnTabUpdated = function(tabId, changeInfo, tab) {
      if (changeInfo.status === 'complete') {
          // Need to wait here, so that the activated tab can complete.
          // TODO: Fix.
          setTimeout(function() {
            executeContentScript(tabId);
          }, 200);
      }
    },

    handleOnTabActivated = function(tab, activeInfo) {
      executeContentScript(tab.tabId);
    };

    /* Listen to events */
    menus.onClicked.addListener(handleOnContextMenuClick);
    tabs.onUpdated.addListener(handleOnTabUpdated);
    tabs.onActivated.addListener(handleOnTabActivated);
    chrome.extension.onMessage.addListener(handleOnMessage);

}());