define([
	'jquery',
	'underscore',
	'./plugins/armory-weapons-tracker',
	'./plugins/targets',
	'./plugins/recon_request',
	'./plugins/armory-upgrade-suggestions',
], function($,_, ArmoryWeaponsTracker, Targets, ReconRequest, ArmoryUpgradeHelper) {


	// Until it's togglable, just list them here
	var enabled_plugins = [
		Targets,
		ArmoryUpgradeHelper,
		ArmoryWeaponsTracker,
		ReconRequest
	];
	
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
