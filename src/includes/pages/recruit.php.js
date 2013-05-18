Page.recruit = {
    run: function() {
		var kocid = document.body.innerHTML.between("stats.php?id=", '"');
		var recruitid= document.URL.substring( document.URL.indexOf("=") +1 );

		getLux('&a=addRecruitid&kocid=' + kocid + '&recruitid='+recruitid);
    }
}