// (window.jQuery, (this._ || _ || unsafeWindow._), document);

require(['jQuery', 'underscore', 'include/buttons', 'include/constants', 'include/control_panel', 'include/gm_wrappers', 'include/gui', 'include/init', 'include/js_utils', 'include/koc_utils', 'include/layout', 'include/logging', 'include/options', 'include/plugin_container'], function($, _) {
    "use strict";

	// CSS Styles are loaded as a resource, add to the page
    gmAddStyle(gmGetResourceText('styles'));

    action = Page.getCurrentPage();

    User = Init.loadUser(action);
    if(!User) {
        alert("Please go to your Command Center for initialization");
        return false;
    }

    GUI.init();
    ControlPanel.init();
    Init.checkForUpdate(1);

    if(Init.checkUser() === 0) {
        return;
    }

    // Every page has its own init. Look at /includes/pages/...
    if(Page[action]) {
        Page[action].run();
    }

    // Plugins want to be run on all pages. Look at /includes/plugins/...
    _.each(Plugins, function(plugin) {
        if(PluginHelper.toRun(plugin)) {
            plugin.run();
        }
    });
});