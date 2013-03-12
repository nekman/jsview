/*
 * TODO: Refactor, test and performance!
 */
(function() {
    var MENU_TEMPLATE = 'JS ({JS}) CSS ({CSS})',
        PARENT_ID = 'main',
        TYPE_JS = 'JS',
        TYPE_CSS = 'CSS',
        menus = chrome.contextMenus,
        tabs = chrome.tabs,

    executeContentScript = function(tabId) {
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
        id: title,
        enabled: false
      });
    },

    createMenuItems = function(files) {
      files.forEach(function(url) {
        menus.create({
          parentId: PARENT_ID,
          title: url.split('/').pop() || url,
          id: url
        });
      });
    },

    createMenuSection = function(files, type) {
      createHeaderItem(type);
      createMenuItems(files);
    },

    handleOnMessage = function(message, sender, sendResponse) {
      menus.removeAll();

      var urls = JSON.parse(message),
          numberOfJSFiles = urls.jsFiles.length,
          numberOfCSSFiles = urls.cssFiles.length,
          hasJsFiles = numberOfJSFiles > 0,
          hasCssFiles = numberOfCSSFiles > 0;

      // Create main menu
      menus.create({
        id: PARENT_ID,
        title: MENU_TEMPLATE
                .replace(/{JS}/, numberOfJSFiles)
                .replace(/{CSS}/, numberOfCSSFiles)
      });

      hasJsFiles && createMenuSection(urls.jsFiles, TYPE_JS);

      if (hasCssFiles) {
        // Show separator if JS-files section is created.
        hasJsFiles && menus.create({
          parentId: PARENT_ID,
          type: 'separator'
        });

        createMenuSection(urls.cssFiles, TYPE_CSS);
      }
    },

    handleOnContextMenuClick = function(info, tab) {
      window.open('view-source:' + info.menuItemId, '_blank');
    },

    handleOnTabUpdated = function(tabId, changeInfo, tab) {
      // Need to wait until the tab is complete.
      if (changeInfo.status === 'complete') {
          executeContentScript(tabId);
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