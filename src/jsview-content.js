/*
 * TODO: Refactor!
 */
(function() {
  var toArray = function(nodeList) {
    return Array.prototype.slice.call(nodeList);
  },

  scriptMapSelector = function(scriptNode) {
    return scriptNode.src;
  },

  linkMapSelector = function(linkNode) {
    return linkNode.href;
  },

  findNodes = function(selector, mapSelector) {
    return toArray(document.querySelectorAll(selector))
      .map(mapSelector)
      .filter(function(url, pos, self) {
        return url !== '' && self.indexOf(url) === pos;
      })
      .sort();
  },

  queryForScriptAndLinkNodes = function() {
    return {
      cssFiles: findNodes('link[rel=stylesheet]', linkMapSelector),
      jsFiles: findNodes('script', scriptMapSelector)
    };
  },

  isLinkOrScriptTag = function(e) {
    return e.srcElement.nodeName === 'SCRIPT' || e.srcElement.nodeName === 'LINK';
  },

  sendMessage = function(scriptUrls) {
    chrome.extension.sendMessage(JSON.stringify(scriptUrls));
  };

  document.addEventListener('DOMNodeInserted', function(e) {
    if (isLinkOrScriptTag(e)) {
      sendMessage(queryForScriptAndLinkNodes());
    }
  }, false);

  sendMessage(queryForScriptAndLinkNodes());

}());