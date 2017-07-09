define([
	'jquery',
	'underscore'
], function($, _) {

	function requireAll(requireContext) {
		return requireContext.keys().map(requireContext);
	}
    // requires and returns all modules that match

	var enabled_plugins = requireAll(require.context("../../plugins/", true, /^\.\/.*\.js$/));
    // is an array containing all the matching modules
	
	return {
		run: function(page) {
			_.each(enabled_plugins, function(plugin) {
				if (!plugin.enabledPages || _.contains(plugin.enabledPages, page)) {
					plugin.run(page)
				}
			});
		},
		isEnabled : function(str) {
			var plugin = Plugins[str];
			if (!plugin) {
				return false;
			}
			var storedAs = 'plugin_enabled_' + str;

			db.get(storedAs, plugin.defaultEnabled);
		},

		onPage : function(str, page) {
			var plugin = Plugins[str];
			if (!plugin) {
				return false;
			}

			var pages = plugin.enabledPages;
			if ( ! _.isArray(pages) ) {
				return true;
			}
			return $.inArray(page, pages);
		},

		toRun : function (str, page) {

			return _.every(
				this.isEnabled(str),
				this.onPage(str, page)
			);
		}
	}
});

