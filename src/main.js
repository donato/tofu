import coloredspan from 'templates/coloredspan';
import Init from './core/control-panel/init';
import KoC from './core/utils/koc_utils';
import GUI from './core/utils/gui';
import Grease from './core/utils/gm_wrappers';
import ControlPanel from './core/control-panel/control_panel';
import Plugins from './core/control-panel/plugins';
import Pages from './core/pages/pages';
import css from 'raw-loader!./css/default.css';

// This is the least magical way to get Handlebars helpers running with webpack loaders
var Handlebars = require('handlebars/runtime');
Handlebars.registerHelper('coloredspan', coloredspan);
Handlebars.registerHelper('timeElapsed', KoC.timeElapsed);
Handlebars.registerHelper('confidenceInterval', KoC.timeConfidenceFormatter);

// CSS Styles are loaded as a resource, add to the page
Grease.addStyle(css);


function init() {
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
  try {
    Pages[action].run(action);
  } catch (e) {
    GUI.displayText("bon changed page formatting, and page is erroring on proccessing");
    console.warn(e);
  }
}
log('end page action');

// Plugins want to be run on all pages. Look at /includes/plugins/...
pluginManager.run(action);
}
init();