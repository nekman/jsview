(function() {
    var toArray = function(nodeList) {
      return Array.prototype.slice.call(nodeList);
    },

    scriptUrls = toArray(document.querySelectorAll('script'))
	 .map(function(scriptNode) {
		return scriptNode.src;
	 })
	 .filter(function(url) {
		return url != '';
	 })
	 .sort();
    
    if (!scriptUrls.length) {
    	return;
    }

    chrome.extension.sendMessage(JSON.stringify(scriptUrls));

}());
