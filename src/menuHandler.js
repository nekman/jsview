define(
  [
    'menus'
  ],

  function(menus) {

    var MENU_TEMPLATE = 'JS ({JS}) CSS ({CSS})',
        PARENT_ID = 'MAIN',
        TYPE_JS = 'JS',
        TYPE_CSS = 'CSS',

    MenuHandler = function() {
    };

    MenuHandler.prototype = {

      clear: function() {
        menus.removeAll();
      },

      addMenuFiles: function(type) {
        var files = type === TYPE_JS ? this.jsFiles : this.cssFiles;
        if (!files.length) {
          return;
        }

        this.addHeaderItem(type);

        var self = this;

        files.forEach(function(url) {
          self.createMenuItem({
            title: url.split('/').pop() || url,
            id: url
          });
        });
      },

      addHeaderItem: function(title) {
        this.createMenuItem({
          title: title,
          id: title,
          enabled: false
        });
      },

      createMenuItem: function(menuItem, isMain) {
        menuItem[isMain ? 'id' : 'parentId'] = PARENT_ID;
        menus.create(menuItem);
      },

      addMainMenu: function() {
        var self = this;
        // Create main menu
        this.createMenuItem({
          title: MENU_TEMPLATE
                  .replace(/{JS}/, self.numberOfJSFiles)
                  .replace(/{CSS}/, self.numberOfCSSFiles)
        }, true);
      },

      hasAny: function() {
        return this.numberOfJSFiles || this.numberOfCSSFiles;
      },

      hasBoth: function() {
        return this.numberOfJSFiles && this.numberOfCSSFiles;
      },

      render: function(scriptUrls) {
        this.clear();

        if (!scriptUrls) {
          throw 'scriptUrls';
        }

        this.jsFiles = scriptUrls.jsFiles || [];
        this.cssFiles = scriptUrls.cssFiles || [];

        this.numberOfJSFiles = this.jsFiles.length;
        this.numberOfCSSFiles = this.cssFiles.length;

        this.renderInternal();

        return this;
      },

      renderInternal: function() {
        if (!this.hasAny()) {
          return;
        }

        this.addMainMenu();
        this.addMenuFiles(TYPE_JS);

        if (this.hasBoth()) {
          this.createMenuItem({ type: 'separator' });
        }

        this.addMenuFiles(TYPE_CSS);

      }
    };


    return new MenuHandler;

});