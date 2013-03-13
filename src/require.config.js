require.config({
	baseUrl: '/src'
});

define('tabs', function() {
	return chrome.tabs;
});

define('menus', function() {
	return chrome.contextMenus;
});

define('chromeExtension', function() {
	return chrome.extension;
});

require(['jsview'], function(jsview) {
	jsview.start();
});