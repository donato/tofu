Plugins['sabtargets']= {
    description : "Sab targets button added to sidebar"
	
	, defaultEnabled : true
	
	, run : function () {
		this.addSabTargetsButton();
	}
    , addSabTargetsButton : function() {
		var $sabButton = $('<a>').append(
			$("<img>", {
				'onclick' : 'return false;',
				'class' : 'tofu',
				'id' : 'sidebar_sabtargets',
				'src' : gmGetResourceURL("sidebar_sabtargets")
		}));
		
		$sabButton.click(this.sabTargetsButton);
		
		var $leftBarRows = $("td.menu_cell> table> tbody > tr");
		$leftBarRows.eq(2).after($sabButton);
		
		// document.getElementById("_luxbot_sablist_nav").addEventListener('click', sabTargetsButton, true);
		
        // var html = '<table class="table_lines" id="_luxbot_targets_table" width="100%" cellspacing="0" cellpadding="6" border="0">'
        // html += '<tr><td><input type="button" id="getTodaysSabs" value="View Your Sabs" /></td></tr><tr><td id="_sab_content">Loading... Please wait...</td></tr> </table>';
        // GUI.showMessage(html);
        // getSabTargets();
    
   }

	, sabTargetsButton : function() {
		GUI.displayText("Hi don");
	}
    , getSabTargets : function() {
        getLux('&a=getsabtargets',
            function(r) {
                function onClick(e) {
                    openTab('http://www.kingsofchaos.com/attack.php?id=' + String(e.target.id).replace(/__/, ''));
                }
                var i;
                if ( r.responseText != '403' ) {
                    document.getElementById('_sab_content').innerHTML = r.responseText;
                }
               
                var q = document.getElementsByName('_luxbot_targets_t');
                for (i = 0; i < q.length; i++) {
                    q[i].addEventListener('click', onClick, true);
                }
                
                document.getElementById('getTodaysSabs').value="View Your Sabs";
                document.getElementById('getTodaysSabs').addEventListener('click',getTodaysSabs,true);
                document.getElementById('getTodaysSabs').removeEventListener('click',getSabTargets,false);
 
            });
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
}
 
