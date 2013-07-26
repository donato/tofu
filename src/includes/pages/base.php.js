Page.base = {
    run: function() {
        this.basePage();
        this.baseLayout();
        this.commandCenterStats();
        makeCollapsable(action);
    }
      
    , basePage: function() {

        var stable = $("table:contains('Military Effectiveness')").last();
        var sa = $(stable).find("tr:contains('Strike Action'):first>td:eq(1)").text();
        var da = $(stable).find("tr:contains('Defensive Action'):first>td:eq(1)").text();
        var spy = $(stable).find("tr:contains('Spy Rating'):first>td:eq(1)").text();
        var sentry = $(stable).find("tr:contains('Sentry Rating'):first>td:eq(1)").text();

        stable = $("table:contains('Military Overview')").last();
        var fort = $(stable).find("tr:contains('Fortification'):first>td:eq(1)").text();
        var siege = $(stable).find("tr:contains('Siege Technology'):first>td:eq(1)").text();
        var economy = $(stable).find("tr:contains('Economy'):first>td:eq(1)").text();
        var technology = $(stable).find("tr:contains('Technology'):last>td:eq(1)").text();
        var conscription = $(stable).find("tr:contains('Conscription'):first>td:eq(1)").text();
        conscription = conscription.substr(0, conscription.indexOf(' soldiers'));
        var tff = $("body").find("tr:contains('Total Fighting Force'):last>td:eq(1)").text();
        var turns = $(stable).find("tr:contains('Game Turns'):first>td:eq(1)").text();
        turns = turns.substr(0,turns.indexOf(" /"));
        var covertlevel = $(stable).find("tr:contains('Covert Level'):first>td:eq(1)").text();
        var income = $(stable).find("tr:contains('Projected Income'):first>td:eq(1)").text();
        income = income.substr(0,income.indexOf(" Gold")).int();

        var officers = Page.stats.stats_getOfficers(false);

        var bonus = textBetween($(".officers>tbody>tr:last").text(), "(x ",")");
        
		// this will help for paging through officers and recording their info
       // nav();
        
        db.put('sa',sa.int());
        db.put('da',da.int());
        db.put('spy',spy.int());
        db.put('sentry',sentry.int());
        db.put('income',income.int() + "");
		db.put('technology', technology.float() + "");
        db.put('tff',tff.int());
        db.put('bonus',bonus);
        db.put('fort', fort);
        db.put('siege',siege);
        db.put('covertlevel', covertlevel);
 
        db.put('race', textBetween($("head>link").eq(3).attr("href"),"css/",".css").toLowerCase());
 
        logBase(sa.int() + ";"+da.int()+";"+spy.int()+";"+sentry.int(), fort+";"+siege+";"+economy+";"+technology+";"+conscription.int()+";"+turns.int()+";"+covertlevel+";"+bonus, officers);
    }
    
    , baseLayout: function() {
        var $tbody = $("td.content > table > tbody").last()
        $tbody.attr("id","tbody");
        
        var $cols = $tbody.children("tr").children("td")
        $cols.children("br").remove()
        
        $cols.first().attr("id", "base_left_col")
        $cols.last().attr("id", "base_right_col")
        
        var $military_overview = getTableByHeading("Military Overview")
                        .addClass("military_overview")
                        .remove()
        var $military_effectiveness = getTableByHeading("Military Effectiveness")
                        .addClass("military_effectiveness")
                        .remove()
        var $personnel = getTableByHeading("Personnel")
        var $user_info = getTableByHeading("User Info")
                        .addClass("user_info")
        var $recent_attacks = getTableByHeading("Recent Attacks on You")
                        .addClass("recent_attacks")
                        .remove()
        var $commander_notice = getTableByHeading("Notice from Commander")
                        .addClass("commander_notice")
                        .remove()
        var $grow_army = getTableByHeading("Grow Your Army")
                        .addClass("grow_army")
                        .remove()
        var $officers = getTableByHeading("Officers")
                        .remove()
        $("#base_right_col").prepend('<br /><br />')
        $("#base_right_col").prepend( this.tbgStats() )
        $("#base_right_col").prepend('<br /><br />')
        $("#base_right_col").prepend($military_overview )
        $("#base_right_col").prepend('<br /><br />')
        $("#base_right_col").prepend($officers )
        $("#base_right_col").prepend('<br /><br />')
        $("#base_right_col").prepend($military_effectiveness )
        $("#base_left_col").append($recent_attacks )
        // $("td.content").append($grow_army ) // Causes errors?
        $(".user_info").after($commander_notice)
        
        //if player is blocking ads, this adds some extra space.
         $("td.content").parent().children("td").eq(2).attr("width", "50");
    }
	
    , commandCenterStats: function() {
        var $tbody = $("#tbody");

        if (checkOption('option_commandCenterStats'))
            $tbody.prepend("<tr id='ff-stats'><td colspan='2'><table class='table_lines' cellpadding=6 width='100%'><tbody><tr><th colspan='2' align='center'>Your Statistics</th></tr><tr><td id='ff-load'></td></tr></tbody></table></td></tr>")
        else
            $("tr:contains('Recent Attacks'):last").parent().parent().before("<table class='table_lines' cellpadding=6 width='100%'><tbody><tr><th colspan='2' align='center'>Your Statistics</th></tr><tr><td id='ff-load'></td></tr></tbody></table>");
            getLux("&a=sabstats",
             function(r) { $("#ff-load").html(""+r.responseText); 
        }); 
    }

	, tbgStats: function() {
		function percentFormat(value) {
			value*=100;
			var decimalPlaces = Math.min(2, Math.floor(Math.log10(value)) );
			
			return (Math.round(value*1000)/1000).toFixed(2-decimalPlaces);
		}
		
		var income = db.getInt('income');
		var tech = parseFloat(db.get('technology'));
		var offieBonus = parseFloat(db.getFloat('bonus'));

		var Label = ["Strike Action", "Defensive Action", "Spy", "Sentry"];
		var costs = [450000, 200000, 1000000, 1000000];
		var strengths = [600, 256, 1000, 1000]
		
		var html = "";
		_.each(['sa','da','spy','sentry'], function(stat, i) {
			var multiplier = upgradeBonus(stat) * raceBonus(stat) * tech * offieBonus;
			
			if (stat == 'sa' || stat =='da') { multiplier *= 5; }

			var hourlyValue = (income * 60 / costs[i]) * strengths[i] * multiplier;
			
			var currentStat = db.getInt(stat);
			html += '  <tr>'
				  + '    <td> ' + Label[i] + '&nbsp;</td><td>' + addCommas(Math.floor(hourlyValue)) +' <span class="supplemental">('+percentFormat(hourlyValue/currentStat) + '%)</span> &nbsp;</td>'
				  + '    <td>'+ addCommas(Math.floor(24 * hourlyValue)) +' <span class="supplemental">('+percentFormat((24*hourlyValue)/currentStat) + '%)</span> </td>'
				  + '  </tr>';
		});
		
		return '<table class="table_lines" width="100%" cellpadding="6">'
			 + '  <tbody>' 
			 + '    <tr><th colspan=3>Investment Profile </th></tr>'
			 + '    <tr><th class="subh">&nbsp;&nbsp;&nbsp;</th><th class="subh">1 Hour&nbsp;</th><th class="subh">1 Day</th></tr>' 
			 + html
		     + '  </tbody>'
		     + '</table>';
	}


}
