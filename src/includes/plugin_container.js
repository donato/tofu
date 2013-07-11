PluginHelper = {
	isEnabled : function(str) {
		var plugin = Plugins[str];
		var storedAs = 'plugin_enabled_' + str;
		
		db.get( storedAs, plugin.defaultEnabled);
	},
	
	onPage : function(str, page) {
		var plugin = Plugins[str];

		var pages = plugin.enabledPages;
		if ( ! _.isArray(pages) ) {
			return true;
		}
		return $.inArray(page, pages);
	},
	
	toRun : function (str, page) {

		return _.and(
			this.isEnabled(str),
			this.onPage(str, page)
		);
	}
}
