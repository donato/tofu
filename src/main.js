define([
    'jquery',
    'underscore',
    './include/init',
    './include/koc_utils',
    './include/gui',
    './include/control_panel',
    './include/pages',
    'raw-loader!./css/default.css',
    './include/buttons',
    './include/constants',
    './include/js_utils',
    './include/layout',
    './include/logging',
    './include/options',
    './include/plugin_container',
], function($, _, Init, KoC, GUI, ControlPanel, Pages, css) {

	// CSS Styles are loaded as a resource, add to the page
    gmAddStyle(css);

    action = KoC.Page.getCurrentPage();

    log('action is ' + action);
    User = Init.loadUser(action);

    if(!User) {
        alert('Please go to your Command Center for initialization');
        return false;
    }


    log('init GUI');
    GUI.init();
    log('init CP');
    ControlPanel.init();
    log('check for updates');
    Init.checkForUpdate(1);

    if(Init.checkUser() === 0) {
        return;
    }


    // Every page has its own init. Look at /includes/pages/...
    log('init page action');
    if(Pages[action]) {
        log('Page action found for ' + action);
        Pages[action].run();
    }
    log('end page action');

    // Plugins want to be run on all pages. Look at /includes/plugins/...
    /*
    _.each(Plugins, function(plugin) {
        if(PluginHelper.toRun(plugin)) {
            plugin.run();
        }
    });
    */
    
});