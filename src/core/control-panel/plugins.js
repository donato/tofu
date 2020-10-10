define([
  'utils/koc_utils',
  'jquery',
], function (Koc, $) {

  // requires and returns all modules that match a directory
  function requireAll(requireContext) {
    return requireContext.keys().map(requireContext);
  }

  function insertTableSlots() {
    // experimenting with the idea of providing a bunch of slots for places to put
    // ui elements and letting users drag/drop the table to wherever they want it.
    const $uiTables = $('.table_lines');
    return $('<div class="lux_table_slot">').insertAfter($uiTables);
  }

  function initSettings() {
    var pluginSettings = Koc.db.getObject('pluginSettings', {});

    allPlugins.forEach(function (plugin) {
      var p = plugin.name;
      if (pluginSettings[p]) {
        pluginSettings[p].isEnabled = pluginSettings[p].isEnabled;
      } else {
        pluginSettings[p] = {
          isEnabled: plugin.defaultEnabled
        }
      }
    });

    Koc.db.putObject('pluginSettings', pluginSettings);
    return pluginSettings;
  }

  var allPlugins = requireAll(require.context("../../plugins/", true, /^\.\/.*\.js$/));

  class Plugins {
    constructor() {
      this.settings = initSettings()
    }
    
    run(page) {
      const $uiSlots = insertTableSlots();
      allPlugins.forEach((plugin) => {
        if (this.settings[plugin.name].isEnabled === false) {
          return;
        }
        if (!plugin.enabledPages || plugin.enabledPages.includes(page)) {
          plugin.run(page, $uiSlots)
        }
      });
    }

    toggle(name) {
      log('toggling ', name);
      this.settings[name].isEnabled = !this.settings[name].isEnabled;
      Koc.db.putObject('pluginSettings', this.settings);
    }

    getPlugins() {
      var plugins = allPlugins.map((p) => {
        p.isEnabled = this.settings[p.name].isEnabled;
        return p;
      });
      return plugins;
    }
  }
  return Plugins;
});

