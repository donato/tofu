import Init from './init';
import Koc from 'utils/koc_utils';
import linksHtml from 'raw-loader!templates/links.html';
import NavbarTemplate from 'handlebars-loader!templates/control-panel-navbar.html';
import SettingsTemplate from 'handlebars-loader!templates/control-panel-settings.html';
import Constants from 'utils/constants';
import GUI from 'utils/gui';

const tabs = [
  { id: "showSettings", name: "Toggle Features" },
  { id: "showLinkBox", name: "Show Links"},
  { id: "checkForUpdates", name: "Check For Updates"},
  { id: "logout", name: "Log Out"},
];
var menu = NavbarTemplate({navLinks: tabs});

class ControlPanel {
  constructor(pluginManager) {
    this.pluginManager = pluginManager;
  }

  init() {
    this.$controlbox = document.createElement('div');
    this.$controlbox.id = 'tofu_control_box';
    this.$controlbox.innerHTML = 'Open Control Panel\n' +
        '<br>' +
        `Tofu v${Constants.TOFU_VERSION}`;

    document.body.appendChild(this.$controlbox);

    this.$controlbox.onclick = this.showSettings.bind(this);
  }

  showPage(html) {
    var $div = GUI.displayHtml(menu + html);
    $div.onclick = this.onClick.bind(this);
  }

  showSettings() {
    var plugins = this.pluginManager.getPlugins();
    this.showPage(SettingsTemplate({plugins}));
  }

  logout() {
    Koc.db.logout();
    GUI.displayHtml("Logged out. <button onclick='window.location.reload()'>Refresh?</button>");
  }

  checkForUpdates() {
    this.showPage('<p>Checking for updates...</p>');
    Init.checkForUpdate().then(() => {
      this.showPage('<p>You are up to date!</p>');
    });
  }

  onClick(event) {
    if (event && event.target && event.target.getAttribute('action')) {
      this[event.target.getAttribute('action')](event);
    }
    return false;
  }

  togglePlugin(event) {
    log('toggling... ', event.target)
    var pluginName = event.target.getAttribute('pluginName');
    this.pluginManager.toggle(pluginName);
    this.showSettings();
  }

  showLinkBox() {
    this.showPage(linksHtml);
  }

  showMessageBox() {
    if (messages === undefined) {
      return;
    }
    var content = '';
    var i;
    for (i = 0; i < messages.length; i++) {
      var y = messages[i].split('|');
      content += '<tr id="_luxbot_message_' + y[3] + '">'
        + '<td><a href="javascript:void(0);" name="' + y[3] + '">+</a></td>'
        + '<td>' + y[1] + '</td><td>' + y[0] + '</td>'
        + '<td>' + y[2] + '</td>'
        + '</tr>';
    }

    GUI.showMessage('<h3>Messages</h3><table id="_luxbot_messages" width="100%"><tr><th>Show</th><th>Sender</th><th>Subject</th><th>Date</th></tr>' + content + '</table>');
    document.getElementById("_luxbot_guibox").addEventListener('click', GUI.showMessageDetails, true);
  }

  showMessageDetails(event) {
    var name = event.target.name;
    if (Koc.isString(name)) {

      getLux('&a=getmessage&id=' + name,
        function (r) {
          var q = document.getElementById('_luxbot_message_' + name);
          GUI.showMessage('<h3>Messages</h3><table id="_luxbot_messages" width="100%"><tr><th>From</th><td>' + q.childNodes[1].innerHTML + '</td></tr><tr><th>Subject</th><td>' + q.childNodes[2].innerHTML + '</td></tr><tr><th>Date</th><td>' + q.childNodes[3].innerHTML + '</td></tr><tr><th>Message</th><td>' + r.responseText + '</td></tr>', GUI.showMessageBox);
        });
    }
  }
}

export default ControlPanel;

