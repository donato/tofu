define([
    'jquery',
    'underscore',
    './include/init',
    './include/koc_utils',
    './include/buttons',
    './include/constants',
    './include/control_panel',
    './include/gui',
    './include/js_utils',
    './include/layout',
    './include/logging',
    './include/options',
    './include/plugin_container',
], function($, _, Init, KoC) {

	// CSS Styles are loaded as a resource, add to the page
    gmAddStyle(gmGetResourceText('styles'));

    action = KoC.Page.getCurrentPage();

    log('action is ' + action);
    User = Init.loadUser(action);

    if(!User) {
        alert('Please go to your Command Center for initialization');
        return false;
    }

    GUI.init();
    ControlPanel.init();
    Init.checkForUpdate(1);

    alert('aituf');
    if(Init.checkUser() === 0) {
        return;
    }

    // Every page has its own init. Look at /includes/pages/...
    if(KoC.Page[action]) {
        KoC.Page[action].run();
    }
    alert('x');

    // Plugins want to be run on all pages. Look at /includes/plugins/...
    _.each(Plugins, function(plugin) {
        if(PluginHelper.toRun(plugin)) {
            plugin.run();
        }
    });

    alert('hai');
});