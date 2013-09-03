define(['jQuery', 'underscore'], function($, _) {
	return {
		
	addRecruitId : function() {
		var kocid = document.body.innerHTML.between("stats.php?id=", '"');
		var recruitid= document.URL.substring( document.URL.indexOf("=") +1 );
	
		getLux('&a=addRecruitid&kocid=' + kocid + '&recruitid='+recruitid);
	},
	
    run: function() {
		this.addRecruitId();
    }
}});