define([
    './stats.php',
    '../koc_utils',
    '../logging',
    'jquery',
    'underscore'
], function(Stats, Koc, Log, $, _) {
    var db = Koc.db;
    
    var str1 = "<tr id='ff-stats'><td colspan='2'><table class='table_lines' cellpadding=6 width='100%'><tbody><tr><th colspan='2' align='center'>Luxbot Statistics</th></tr><tr><td id='ff-load'></td></tr></tbody></table></td></tr>";
    var str2 = "<table class='table_lines' cellpadding=6 width='100%'><tbody><tr><th colspan='2' align='center'>Luxbot Statistics</th></tr><tr><td id='ff-load'></td></tr></tbody></table>";
    
    return {
        
		
    run: function() {
        this.logBaseStats();
        this.baseLayout();
        this.commandCenterStats();
    },
      
    logBaseStats: function() {

        var $militaryTable = Koc.getTableByHeading('Military Effectiveness');
        var stats = Koc.parseTableColumn($militaryTable, 1);
        var sa = stats[0];
        var da = stats[1];
        var spy = stats[2];
        var sentry = stats[3];

        var $overviewTable = Koc.getTableByHeading('Military Overview');
        var dict = Koc.parseTableColumnToDict($overviewTable, 0, 1);
        var fort = dict['Fortification'];
        var siege = dict['Siege Technology'];
        var economy = dict['Economy'];
        var technology = dict['Technology'];
        var tech = technology.split('(x ')[1].split(' ')[0];
        tech = parseFloat(tech);
        var conscription = dict['Conscription'];
        conscription = to_int(conscription.substr(0, conscription.indexOf(' soldiers')));
        var turns = dict['Game Turns'];
        turns = to_int(turns.substr(0,turns.indexOf(" /")));
        var covertlevel = to_int(dict['Covert Level']);
        var income = dict['Projected Income'];
        income = income.substr(0,income.indexOf(" Gold")).int();

        var $armyTable = Koc.getTableByHeading('Personnel');
        var armyDict = Koc.parseTableColumnToDict($armyTable, 0, 1);
        var tff = to_int(armyDict['Total Fighting Force']);
        
        var officers = Stats.stats_getOfficers(false);

        var bonus = parseFloat(textBetween($(".officers>tbody>tr:last").text(), "(x ",")"));
        
        db.put('sa',sa);
        db.put('da',da);
        db.put('spy',spy);
        db.put('sentry',sentry);
        db.put('income',income);
		db.put('technology', tech);
        db.put('tff', tff);
        db.put('bonus',bonus);
        db.put('fort', fort);
        db.put('siege',siege);
        db.put('covertlevel', covertlevel);
 
        db.put('race', textBetween($("head>link").eq(3).attr("href"),"css/",".css").toLowerCase());
 
        Log.logBase(sa + ";"+da+";"+spy+";"+sentry, fort+";"+siege+";"+economy+";"+technology+";"+conscription+";"+turns+";"+covertlevel+";"+bonus, officers);
    },
    
    baseLayout: function() {
        var $tbody = $("td.content > table > tbody").last()
        $tbody.attr("id","tbody");
        
        var $cols = $tbody.children("tr").children("td")
        $cols.children("br").remove();
        
        var $leftCol = $cols.first().attr("id", "base_left_col");
        var $rightCol = $cols.last().attr("id", "base_right_col");
        $rightCol.children('p').remove();
        
        var $military_overview = Koc.getTableByHeading("Military Overview")
                        .addClass("military_overview")
                        .remove()
        var $military_effectiveness = Koc.getTableByHeading("Military Effectiveness")
                        .addClass("military_effectiveness")
                        .remove()
        var $preferences = Koc.getTableByHeading("Preferences").remove();
        var $logins = Koc.getTableByHeading("Previous Logins").remove();
        var $personnel = Koc.getTableByHeading("Personnel");
        var $user_info = Koc.getTableByHeading("User Info")
                        .addClass("user_info")
        var $recent_attacks = Koc.getTableByHeading("Recent Attacks on You")
                        .addClass("recent_attacks")
                        .remove()
        var $commander_notice = Koc.getTableByHeading("Notice from Commander")
                        .addClass("commander_notice")
                        .remove()
        var $grow_army = Koc.getTableByHeading("Grow Your Army")
                        .addClass("grow_army")
                        .remove()
        var $officers = Koc.getTableByHeading("Officers")
                        .remove();
        
        $leftCol.append('<br /><br />');
        $leftCol.append($officers);
        $leftCol.append('<br /><br />');
        
        $rightCol.append($military_effectiveness );
        $rightCol.append('<br /><br />');
        $rightCol.append($military_overview );
        $rightCol.append('<br /><br />');
        $rightCol.append( this.tbgStats() );
        $rightCol.append('<br /><br />')
        $rightCol.append($recent_attacks );
        $rightCol.append('<br /><br />');
        // $rightCol.append($grow_army);
        $rightCol.append($preferences);
        $rightCol.append($logins);
        $(".user_info").after($commander_notice);
        
        // if player is blocking ads, this adds some extra space.
        $("td.content").parent().children("td").eq(2).attr("width", "50");
    },
	
    commandCenterStats: function() {
        var $tbody = $("tbody").first()

        if (Koc.checkOption('option_commandCenterStats')) {
            $("tr:contains('Personnel'):last").parent().parent().before(str2);
        } else {
            $tbody.prepend(str1);
        }
        getLux("&a=sabstats", function (r) {
            $("#ff-load").html("" + r.responseText);
        });
    },

	tbgStats: function() {
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
			var multiplier = Koc.upgradeBonus(stat) * Koc.raceBonus(stat) * tech * offieBonus;
			
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
}});
