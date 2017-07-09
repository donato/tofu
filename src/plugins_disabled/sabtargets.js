define({
    description : "Sab targets button added to sidebar"
	
	, defaultEnabled : true
	
	, run : function () {
		this.addSabTargetsButton();
	}
    , addSabTargetsButton : function() {
		var $sabButton = $('<a>', {'href':'#'}).append(
			$("<img>", {
				'onclick' : 'return false;',
				'class' : 'tofu',
				'id' : 'sidebar_sabtargets',
				'src' : gmGetResourceURL("sidebar_sabtargets")
		}));
		
		$sabButton.click(this.sabTargetsButton.bind(this));
		
		var $leftBarRows = $("td.menu_cell> table> tbody > tr");
		$leftBarRows.eq(2).after($("<tr>").append($sabButton));
   }

	, sabTargetsButton : function() {
        var $html = $("<table>", {
			'class' : 'table_lines tofu',
			'id' : '_luxbot_targets_table',
			'width': '100%',
			'cellspacing': 0,
			'cellpadding': 0,
			'border': 0})
			.append('<tr><td id="getTodaysSabs" ><input type="button" value="View Your Sabs" /></td></tr>'
			       +'<tr><td id="_sab_content">Loading... Please wait...</td></tr>');
				   
        GUI.displayHtml( $html );
        this.getSabTargets();
	}
	
    , getSabTargets : function() {
        getLux('&a=getsabtargets',
            function(r) {
				$("#_sab_content").html(r.responseText);
               
				// $("#getTodaysSabs").html("View Your Sabs - Test 1")
					// .attr('value', 'View Your Sabs - Test 2')
					// .unbind('click')
					// .click(this.getTodaysSabs);
            }.bind(this));
    }
	 
    , getTodaysSabs : function () {
		getLux('&a=getTodaysSabs',
            function(r) {
                document.getElementById('_sab_content').innerHTML = r.responseText;    
                document.getElementById('getTodaysSabs').value="View Sab List";
                document.getElementById('getTodaysSabs').addEventListener('click',getSabTargets,true);
                document.getElementById('getTodaysSabs').removeEventListener('click',getTodaysSabs,false);
        });      
    }
});