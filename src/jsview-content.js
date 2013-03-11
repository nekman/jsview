(function() {

  var toArray = function(nodeList) {
    return Array.prototype.slice.call(nodeList);
  },

  scriptMapSelector = function(scriptNode) {
    return scriptNode.src;
  },

  cssMapSelector = function(linkNode) {
    return linkNode.href;
  },

  findNodes = function(selector, mapSelector) {
    return toArray(document.querySelectorAll(selector))
      .map(mapSelector)
      .filter(function(url) {
        return url !== '';
      })
      .sort();
  },

  scriptUrls = {
    cssFiles: findNodes('link[rel=stylesheet]', cssMapSelector),
    jsFiles: findNodes('script', scriptMapSelector),
    hasAny: function() {
      return this.cssFiles.length && this.jsFiles.length;
    }
  };

  if (!scriptUrls.hasAny()) {
    return;
  }

  chrome.extension.sendMessage(JSON.stringify(scriptUrls));

}());