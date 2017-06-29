define(['jquery', 'underscore'], function($,_) {
return {
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
