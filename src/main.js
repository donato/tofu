define([
    'jquery',
    'underscore',
    './libs/highstock-1.1.5',
    './include/init',
    './include/koc_utils',
    './include/gui',
    './include/control_panel',
    './include/plugin_container',
    './include/pages',
    'raw-loader!./css/default.css',
    './include/buttons',
    './include/constants',
    './include/js_utils',
    './include/layout',
    './include/logging',
    './include/options',
], function($, _, _Highcharts, Init, KoC, GUI, ControlPanel, Plugins, Pages, css) {

	// CSS Styles are loaded as a resource, add to the page
    gmAddStyle(css);

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
    Plugins.run(action);
    /*
    _.each(Plugins, function(plugin) {
        if(PluginHelper.toRun(plugin)) {
            plugin.run();
        }
    });
    */
    
});