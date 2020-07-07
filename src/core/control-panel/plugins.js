define([
  'utils/koc_utils',
  'jquery',
  'underscore'
], function(Koc, $, _) {

  // requires and returns all modules that match a directory
  function requireAll(requireContext) {
    return requireContext.keys().map(requireContext);
  }

  var allPlugins = requireAll(require.context("../../plugins/", true, /^\.\/.*\.js$/));
  
  return {
    init: function() {
      var pluginSettings = Koc.db.getObject('pluginSettings', {});

      _.each(allPlugins, function(plugin) {
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
      
      this.settings = pluginSettings;
    },
    
    run: function(page) {
      this.init();
      
      var self = this;
      _.each(allPlugins, function(plugin) {
        
        if (self.settings[plugin.name].isEnabled === false) {
          return;
        }
        if (!plugin.enabledPages || _.includes(plugin.enabledPages, page)) {
          plugin.run(page)
        }
      });
    },
    
    toggle: function(name) {
      log('toggling ', name);
      this.settings[name].isEnabled = !this.settings[name].isEnabled;
      Koc.db.putObject('pluginSettings', this.settings);
    },
    
    isEnabled : function(name) {
      var storedAs = 'plugin_enabled_' + name;

      db.get(storedAs, plugin.defaultEnabled);
    },

    getPlugins: function() {
      var plugins = _.map(allPlugins, (p) => {
        p.isEnabled = this.settings[p.name].isEnabled;
        return p;
      });
      return plugins;
    }
  }
});

