// Note: The version is added here by the build script as a global string.

var User;
var action;

!function($, document) {
    "use strict";

	var newCSS = gmGetResourceText ("styles");
	gmAddStyle (newCSS);

    action = Page.getCurrentPage();

	var kocid;
    if (action == 'base') {
        var html = document.body.innerHTML.split("stats.php?id=");
        html = html[1];
        kocid = html.slice(0, html.indexOf('"'));
    }
    
	// This is a global
    User = Init.loadUser(kocid);
	if (!User) {
		alert ("Please go to your Command Center for initialization");
		return false;
	}

	GUI.init();
    Init.checkForUpdate(1);

    if( Init.checkUser() === 0) {
         return;
    }

	// Every page has its own init. Look at /includes/pages/...
	Page[action].run();

	// Plugins want to be run on all pages. Look at /includes/plugins/...
	_.each(Plugins, function(plugin) {
		log("running plugin " + plugin.description);
		plugin.run();
	});

}(window.jQuery, document);