define(['underscore'], function(_) {

    return function (id) {      
	
		if (_.isInt(id)) {
			gmSetValue("lux_last_user", id);
		} else {
			id = gmGetValue("lux_last_user", 0);
		}
		
		return {
			get: function(option, def) {
				option += "_"+id;
				return gmGetValue(option, def);
			},
			getInt: function(option, def) {
				var ret = this.get(option, def);
				return parseInt(ret, 10);
			},
			getFloat: function(option, def) {
				var ret = this.get(option, def);
				return parseFloat(ret, 10);
			},
			put: function(option, val) {
				option += "_"+ id;
				gmSetValue(option,val);
			},
			del: function(option) {
				option += "_"+ id;
				gmDeleteValue(option);
			}
		}
    };

});