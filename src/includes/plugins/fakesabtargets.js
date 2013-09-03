define({
    description : "Fake-Sab targets button added to sidebar"
	
	, defaultEnabled : false
	
	, run : function () {
		this.addButton();
	}
	
    , addButton : function() {
		var $sabButton = $('<a>', {'href':'#'}).append(
			$("<img>", {
				'onclick' : 'return false;',
				'class' : 'tofu',
				'id' : 'sidebar_sabtargets',
				'src' : gmGetResourceURL("sidebar_fakesabtargets")
		}));
		
		$sabButton.click(this.showFakeSabList.bind(this));
		
		var $leftBarRows = $("td.menu_cell> table> tbody > tr");
		$leftBarRows.eq(2).after($("<tr>").append($sabButton));
   }

	, showFakeSabList : function() {
		var $table = $("<table>", {'class': 'table_lines', 'id':'_luxbot_targets_table', 'width':'100%', cellspacing:0, cellpadding:6, border:0 });

		$table.append('<tr><td id="_sab_content">Loading... Please wait...</td></tr>');
		GUI.displayHtml($table);
		this.getFakeSabTargets();
	}

	, getFakeSabTargets : function() {
		getLux('&a=getfakesabtargets',
			function(r) {
				var i;
				log(r.responseText);
				if ( r.responseText != '403' ) {
					document.getElementById('_sab_content').innerHTML = r.responseText;
				}
		});
	}
});