var reDefine = require('./ReDefine.js'),
  // Fake the 'menus' module.
  fakes = {
    menus: {
        create: function() {},
        removeAll: function() {}
    }
  };

describe('MenuHandler', function() {
  var sut = reDefine
              .use(fakes)
              .require("/../src/menuHandler.js");
              
  it('Renders the menu', function() {
    // Arrange
    var scriptUrls = {
        jsFiles: ['jquery.js'],
        cssFiles: ['bootstrap.min.css']
    };

    spyOn(sut, 'renderInternal');
    spyOn(fakes.menus, 'removeAll');

    // Act
    sut.render(scriptUrls);

    // Assert
    expect(fakes.menus.removeAll).toHaveBeenCalled();
    expect(sut.renderInternal).toHaveBeenCalled();

  });
});

