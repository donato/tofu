define([
  'templates/coloredspan',
  'jquery',
  'underscore',
  './core/control-panel/init',
  './core/utils/koc_utils',
  './core/utils/gui',
  './core/utils/gm_wrappers',
  './core/control-panel/control_panel',
  './core/control-panel/plugins',
  './core/pages/pages',
  'raw-loader!./css/default.css',
  'core/utils/js_utils', // included just for global values
], function (coloredspan, $, _, Init, KoC, GUI, Grease, ControlPanel, Plugins, Pages, css, utils) {

  // This is the least magical way to get Handlebars helpers running with webpack loaders
  var Handlebars = require('handlebars/runtime');
  Handlebars.registerHelper('coloredspan', coloredspan);
  Handlebars.registerHelper('timeElapsed', KoC.timeElapsed);
  Handlebars.registerHelper('confidenceInterval', KoC.timeConfidenceFormatter);

  // CSS Styles are loaded as a resource, add to the page
  Grease.addStyle(css);

  var action = KoC.Page.getCurrentPage();

  // This is a global for the makeUrl in gm_wrappers.js 
  User = Init.loadUser(action);

  if (!User) {
    alert('Please go to your Command Center for initialization');
    return false;
  }
  const pluginManager = new Plugins();
  GUI.init();
  const controlPanel = new ControlPanel(pluginManager);
  controlPanel.init();
  Init.checkForUpdate(1);

  if (Init.checkUser(User) === 0) {
    return;
  }

  // Every page has its own init. Look at /includes/pages/...
  log('init page action');
  if (Pages[action]) {
    log('Page action found for ' + action);
    Pages[action].run(action);
  }
  log('end page action');

  // Plugins want to be run on all pages. Look at /includes/plugins/...
  pluginManager.run(action);
});