// Note: The version is added here by the build script as a global string.

var User;
var action;

!function($, _, document) {
    "use strict";

	gmAddStyle( gmGetResourceText ("styles") );

	
    action = Page.getCurrentPage();
	
    User = Init.loadUser(action);
	if (!User) {
		alert ("Please go to your Command Center for initialization");
		return false;
	}

	GUI.init();
<<<<<<< HEAD
	
||||||| merged common ancestors
=======
	ControlPanel.init();
>>>>>>> 52cffa32e464635e47c194b0ebc449f8c05bb2e3
    Init.checkForUpdate(1);

    if( Init.checkUser() === 0) {
         return;
    }

	// Every page has its own init. Look at /includes/pages/...
	if (Page[action]) {
		Page[action].run();
	}
	
	// Plugins want to be run on all pages. Look at /includes/plugins/...
	_.each(Plugins, function(plugin) {
		if (PluginHelper.toRun(plugin)) {
			plugin.run();
		}
	});

}(window.jQuery, (this._ || _ || unsafeWindow._), document);
