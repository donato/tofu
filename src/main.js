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

  // experimenting with the idea of providing a bunch of slots for places to put
  // ui elements and letting users drag/drop the table to wherever they want it.
  const $uiTables = $('.table_lines');
  $uiTables.after('<div class="lux_table_slot">');
  const $uiSlots = $uiTables.find('.lux_table_slots');
  
  // Every page has its own init. Look at /includes/pages/...
  log('init page action');
  if (Pages[action]) {
    log('Page action found for ' + action);
    Pages[action].run(action, $uiSlots);
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