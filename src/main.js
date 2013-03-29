// Note: The version is added here by the build script as a global string.

!function($, document) {
    "use strict";
    
	var Plugins = {}
	
	var newCSS = gmGetResourceText ("styles");
	gmAddStyle (newCSS);

	GUI.init();

	var kocid;
    var action = Page.getCurrentPage();
    if (action == 'base') {
        var html = document.body.innerHTML.split("stats.php?id=");
        html = html[1];
        kocid = html.slice(0, html.indexOf('"'));
    }
    
    var User = Init.loadUser(kocid);
	if (!User) {
		alert ("Please go to your Command Center for initialization");
		return false;
	}
	
    Init.checkForUpdate(1);
   
    if( Init.checkUser() === 0) {
         return;
    }
	
	// Every page has its own init. Look at /includes/pages/...
	Page[action].run();
	
	// Plugins want to be run on all pages. Look at /includes/plugins/...
	_.each(Plugins, function(plugin) {
		plugin();
	});

}(window.jQuery, document);