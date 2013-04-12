Plugins['targets'] = {
    description : "Targets button added to sidebar"
	
	, defaultEnabled : true
	
	, run : function () {
		// this.addSabTargetsButton();
	}
	
	, formInputs : {
		'maxDa' : 'Maximum Defense', 
		'minTff' : '..', 
		'minGold' : 0,
		'maxSeconds' : 120, 
		'byProjection' : 0, 
		'saMultiplier' : 0.80,
		'tffAdd' : 10
	}
	
	, inputDefaults : {
		'maxDa' : 1000, 
		'minTff' : 10, 
		'minGold' : 0,
		'maxSeconds' : 120, 
		'byProjection' : 0, 
		'saMultiplier' : 0.80,
		'tffAdd' : 10
	}
	
	, showFarmList : function() {
		var farmOptions = _.map(this.formInputs, function (def, key) {
			return db.get(key, def);
		});
		var maxDa = db.get("maxDa", 1000);
		var minTff = db.get("minTff", 10);
		var minGold = db.get("minGold", 0);
		var maxSeconds = db.get("maxSeconds", 120);
		var byProjection = db.get("byProjection", "");
		var saMultiplier = db.get("saMultiplier", 0.80);
		var tffAdder = db.get("tffAdder", 50);
		
		 var html = '<table class="table_lines" id="_luxbot_targets_table" width="100%" cellspacing="0" cellpadding="6" border="0">'
		+'<tr><th colspan="7">Master Targets (Loading)</th></tr>'
		+'<tr id="targetsFirstRow"><td><b>Name</b></td><td colspan="2" align="center"><b>Defensive Action</b></td><td align="center"><b>Total Fighting Force</b></td><td width=200 align="right"><b>Gold</b></td><td>&nbsp;</td><td>&nbsp;</td></tr>'
		+'<tr><th colspan="7">Settings</th></tr>'
		+'<tr><td colspan=7 id="targets_settings"> </td></tr>'
		+'</table>';
		
		 
		var form1 = $("<fieldset style='width: 20%; padding:10px 0 5px 10%; float: left;' id='autofill'><legend>Autofill</legend></fieldset>");
			form1.append($("<label for=saMultiplier />").text("SA x "));
			form1.append($("<input type=text name=saMultiplier size=5/><br />").val(saMultiplier));

			form1.append($("<label for=tffAdder>").text("TFF + "));
			form1.append($("<input type=text name=tffAdder size=4/><br />").val(tffAdder));
			form1.append($("<input type=button id='targets_autofill' value='Autofill' /><br />"));
		
		var form2 = $("<fieldset style='width: 30%; padding:10px; float: left;' id='values'><legend>Filter Settings</legend></fieldset>");
			form2.append($("<label  class='tLabel' for=maxDa />").text("Max Defense: "));
			form2.append($("<input type=text name=maxDa /><br />").val(maxDa));
			form2.append($("<label class='tLabel' for=minTff>").text("Min TFF: "));
			form2.append($("<input type=text name=minTff /><br />").val(minTff));
			form2.append($("<label  class='tLabel' for=minGold>").text("Min Gold: "));
			form2.append($("<input type=text name=minGold /><br />").val(minGold));
			form2.append($("<label  class='tLabel' for=maxSeconds>").text("Max Gold Age: "));
			form2.append($("<input type=text name=maxSeconds /><br />").val(maxSeconds));
			form2.append($("<label  class='tLabel' for=maxSeconds>").text("Filter by Projection: "));
			form2.append($("<input type=checkbox name=by_projection value='1' /><br />").attr("checked",byProjection));

		var form3 = $("<fieldset style='width: 20%; padding:10px 0 5px 10%; float: left;' id='autofill'><legend>Reset / Save</legend></fieldset>");
			form3.append($("<input type=button id='targets_refresh' value='Refresh' /><br /><br />"));
			form3.append($("<input type=button id='targets_save' value='Save' /><br />"));
			form3.append($("<input type=button id='targets_reset' value='Reset' /> "));

		GUI.showMessage(html);
		$("#targets_settings").append(form1);    
		$("#targets_settings").append(form2);    
		$("#targets_settings").append(form3);    
			
		$("#targets_refresh").click(function() {
			this.getTargets();
		});            
		$("#targets_autofill").click(function() {
			var tffAdd = $("input[name='tffAdder']").val();
			var saMult = $("input[name='saMultiplier']").val();
			$("input[name='minTff']").val(Math.floor(User.tff.int()+tffAdd.int()));
			$("input[name='maxDa']").val(Math.floor(User.sa.int() * saMult ));
		});
		$("#targets_reset").click(function() {
			$("input[name='minTff']").val(10);
			$("input[name='maxDa']").val(1000);
			$("input[name='minGold']").val(0);
			$("input[name='maxSeconds']").val(120);
			$("input[name='saMultiplier']").val(0.80);
			$("input[name='tffAdder']").val(50);
			$("input[name='by_projection']").attr("checked", "");
		});
		$("#targets_save").click(function() {
			db.put("maxDa", $("input[name='maxDa']").val().int().toString());
			db.put("minTff", $("input[name='minTff']").val().int());
			db.put("minGold", $("input[name='minGold']").val().int());
			db.put("maxSeconds", $("input[name='maxSeconds']").val().int());
			db.put("saMultiplier", $("input[name='saMultiplier']").val().float().toString());
			db.put("tffAdder", $("input[name='tffAdder']").val().int());
			db.put("byProjection", $("input[name='by_projection']").prop('checked'));
			this.getTargets();
		});

		this.getTargets(); 
	}

	, getTargets : function() {
		$(".targetTR").remove();
		getLux('&a=gettargets&g=' + db.get('minGold',0) + '&t=' + db.get('minTff', 0) 
			 + '&d=' + db.get('maxDa', 0) + '&q=' + db.get('maxSeconds', 0)
			 + '&by_projection=' + db.get('byProjection',0),
		   function(r) {
				var row, i;
				var x = r.responseText.split(';');
				var html="";
				for(i = 0; i < x.length-1; i++) {
					row = x[i].split(':');
					html += '<tr class="targetTR"><td><a href="/stats.php?id=' + row[1] + '">' + row[0] + '</a></td><td align="right">' + (row[3]) + '</td><td>(' + row[4] + ')</td><td align="center">' + row[2] + '</td>'
					+'<td align="right">'
						+'<span class="gold">' + row[5] + '</span>'
						+'<span class="projection" style="display:none;">Projected: '+row[7] + '</span>' +
					'</td><td align="left">(' +row[6] + ')</td><td align="right"><input type="button" value="Attack" style="cursor:pointer" name="_luxbot_targets_t" id="__' + row[1] + '"></td></tr>';
				}
				$("#targetsFirstRow").after(html);
				
			   
				$(".projection").css("color","#B3FFF8");
				$(".targetTR").hover(
					function () {
						$(this).find(".gold").hide();
						$(this).find(".projection").show();
					}, function () {
						$(this).find(".gold").show();
						$(this).find(".projection").hide();                  
				});
			});    
	}

	, showFakeSabList : function() {
		var $table = $("<table>", {'class': 'table_lines', 'id':'_luxbot_targets_table', 'width':'100%', cellspacing:0, cellpadding:6, border:0 });

		$table.append('<tr><td id="_sab_content">Loading... Please wait...</td></tr>');
		GUI.showMessage($table);
		getFakeSabTargets();
	}

	, getFakeSabTargets : function() {
		function clickHelper(e) {
			openTab('http://www.kingsofchaos.com/attack.php?id=' + String(e.target.id).replace(/__/, ''));
		}
		getLux('&a=getfakesabtargets',
			function(r) {
				var i;
				if ( r.responseText != '403' ) {
					document.getElementById('_sab_content').innerHTML = r.responseText;
				}
			   
				var q = document.getElementsByName('_luxbot_targets_t');
				for (i = 0; i < q.length; i++) {
					q[i].addEventListener('click', clickHelper, true);
				}
				// $("#getTodaysSabs")
				
				document.getElementById('getTodaysSabs').value="View Your Sabs";
				document.getElementById('getTodaysSabs').addEventListener('click',getTodaysSabs,true);
				document.getElementById('getTodaysSabs').removeEventListener('click',getSabTargets,false);
		});
	}
}