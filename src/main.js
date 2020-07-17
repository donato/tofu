define([
  'jquery',
  'underscore',
  './core/control-panel/init',
  './core/utils/koc_utils',
  './core/utils/gui',
  './core/control-panel/control_panel',
  './core/control-panel/plugins',
  './core/pages/pages',
  'raw-loader!./css/default.css'
], function ($, _, Init, KoC, GUI, ControlPanel, Plugins, Pages, css) {

  // CSS Styles are loaded as a resource, add to the page
  gmAddStyle(css);

  var action = KoC.Page.getCurrentPage();

  // This is a global for the makeUrl in gm_wrappers.js 
  User = Init.loadUser(action);

  if (!User) {
    alert('Please go to your Command Center for initialization');
    return false;
  }

  GUI.init();
  ControlPanel.init();
  Init.checkForUpdate(1);

  if (Init.checkUser(User) === 0) {
    return;
  }


  // Every page has its own init. Look at /includes/pages/...
  log('init page action');
  if (Pages[action]) {
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