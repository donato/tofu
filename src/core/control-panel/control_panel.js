define([
  './init',
  'raw-loader!templates/links.html',
  'handlebars-loader!templates/control-panel-navbar.html',
  'handlebars-loader!templates/control-panel-settings.html',
  'utils/gui',
  'jquery',
  'underscore'
], function (Init, linksHtml, NavbarTemplate, SettingsTemplate, GUI, $, _) {

  class ControlPanel {
    constructor(pluginManager) {
      this.pluginManager = pluginManager;
      
      this.tabs = [
        { id: "showSettings", name: "Settings", action: this.showSettings.bind(this) },
        { id: "showLinkBox", name: "Show Links", action: this.showLinkBox.bind(this) },
        { id: "checkupdates", name: "Check For Updates", action: Init.checkForUpdate }
      ];
    }

    init() {
      this.$controlbox = $("<div>", {
        'id': 'tofu_control_box',
        'html': 'Open Control Panel<br>Tofu V.' + version
      });

      $('body').append(this.$controlbox);

      this.$controlbox.click(this.showSettings.bind(this));
    }

    showPage(html) {
      var menu = NavbarTemplate({navLinks: this.tabs });
      var $div = GUI.displayHtml(menu + html);
      $div.click(this.onClick.bind(this));
    }

    showSettings() {
      var plugins = this.pluginManager.getPlugins();
      this.showPage(SettingsTemplate({plugins}));
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
      this.showControlPanel();
    }

    toggle() {
      $("_luxbot_darken").toggle();
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
      if (_.isString(name)) {

        getLux('&a=getmessage&id=' + name,
          function (r) {
            var q = document.getElementById('_luxbot_message_' + name);
            GUI.showMessage('<h3>Messages</h3><table id="_luxbot_messages" width="100%"><tr><th>From</th><td>' + q.childNodes[1].innerHTML + '</td></tr><tr><th>Subject</th><td>' + q.childNodes[2].innerHTML + '</td></tr><tr><th>Date</th><td>' + q.childNodes[3].innerHTML + '</td></tr><tr><th>Message</th><td>' + r.responseText + '</td></tr>', GUI.showMessageBox);
          });
      }
    }
  }

  return ControlPanel;
});

