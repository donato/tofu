define([
    './stats.php',
    'utils/koc_utils',
    'plugins/luxbot-logging',
    'jquery',
    'underscore'
], function(Stats, Koc, Log, $, _) {
  const db = Koc.db;
  
  const str1 = "<tr id='ff-stats'><td colspan='2'><table class='table_lines' cellpadding=6 width='100%'><tbody><tr><th colspan='2' align='center'>Luxbot Statistics</th></tr><tr><td id='ff-load'></td></tr></tbody></table></td></tr>";
  const str2 = "<table class='table_lines' cellpadding=6 width='100%'><tbody><tr><th colspan='2' align='center'>Luxbot Statistics</th></tr><tr><td id='ff-load'></td></tr></tbody></table>";
  
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
      var fort = dict['Fortification'].substr(0, dict['Fortification'].indexOf(' ('));
      var siege = dict['Siege'].substr(0, dict['Siege'].indexOf(' ('));
      var economy = dict['Economy'].substr(0, dict['Economy'].indexOf(' ('));
      var technology = dict['Technology'].substr(0, dict['Technology'].indexOf(' ('));
      var conscription = dict['Conscription'];
      conscription = to_int(conscription.substr(0, conscription.indexOf(' Soldiers')));
      var covertlevel = to_int(dict['Covert Level']);
      var sentrylevel = to_int(dict['Sentry Level']);
      var income = dict['Projected Income'];
      income = income.substr(0,income.indexOf(" Gold")).int();
      const exp_per_turn = to_int(dict['Experience Per Turn']);
      var $armyTable = Koc.getTableByHeading('Personnel');
      var armyDict = Koc.parseTableColumnToDict($armyTable, 0, 1);
      var tff = to_int(armyDict['Total Fighting Force']);
      var attackMercs = to_int(armyDict['Trained Attack Mercenaries']);
      var defenseMercs = to_int(armyDict['Trained Defense Mercenaries']);
      var attackers = to_int(armyDict['Trained Attack Soldiers']);
      var defenders = to_int(armyDict['Trained Defense Soldiers']);
      var untrained = to_int(armyDict['Untrained Soldiers']);
      var untrainedMercs = to_int(armyDict['Untrained Mercenaries']);
      var spies = to_int(armyDict['Spies']);
      var sentries = to_int(armyDict['Sentries']);
      var tff = to_int(armyDict['Total Fighting Force']);
      
      // Other stuff
      var turns = Koc.Page.getPlayerTurns();
      var safe_gold = Koc.Page.getPlayerSafe();
      var experience = Koc.Page.getPlayerExperience();
      var race = textBetween($("head>link").eq(3).attr("href"),"css/",".css").toLowerCase();
      var officers = Stats.stats_getOfficers(false);
      
      // offie bonus feature is disabled
      // var bonus = parseFloat(textBetween($(".officers>tbody>tr:last").text(), "(x ",")")) || 1.0;
      var bonus = "";
      
      db.put('sa',sa);
      db.put('da',da);
      db.put('spy',spy);
      db.put('sentry',sentry);
      db.put('income',income);
      db.put('technology', technology);
      db.put('tff', tff);
      db.put('bonus', bonus);
      db.put('fort', fort);
      db.put('siege',siege);
      db.put('covertlevel', covertlevel);
      db.put('sentrylevel', sentrylevel);
      db.put('race', race);
        
      const weaponStats = [sa.int(), da.int(), spy.int(), sentry.int()];
      const otherStats = [
        fort, siege, economy, technology, conscription.int(), turns.int(), covertlevel.int(), bonus,
        attackMercs.int(), defenseMercs.int(), untrainedMercs.int(), attackers.int(), defenders.int(),
        untrained.int(), safe_gold.int(), exp_per_turn.int(), sentrylevel.int(), spies.int(), sentries.int(), experience.int()
      ];
      // Example inputs:
      //  stats=1037189702;46790709;650248517;111360121
      //  data=Stronghold;Cannons;Hunting;Printing;6400;20000;15;;723;33;0;58080;20475;5090;77975887;3;13;12052;8455;12174
      //  officers=

      Log.logBase(weaponStats.join(';'), otherStats.join(';'), officers);
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
    var rows = "";
    _.each(['sa','da','spy','sentry'], function(stat, i) {
      var multiplier = Koc.upgradeBonus(stat) * Koc.raceBonus(stat) * tech * offieBonus;
      
      if (stat == 'sa' || stat =='da') { multiplier *= 5; }

      var hourlyValue = (income * 60 / costs[i]) * strengths[i] * multiplier;
      
      var currentStat = db.getInt(stat);
      rows += '  <tr>'
          + '    <td> ' + Label[i] + '&nbsp;</td><td>' + addCommas(Math.floor(hourlyValue)) +' <span class="supplemental">('+percentFormat(hourlyValue/currentStat) + '%)</span> &nbsp;</td>'
          + '    <td>'+ addCommas(Math.floor(24 * hourlyValue)) +' <span class="supplemental">('+percentFormat((24*hourlyValue)/currentStat) + '%)</span> </td>'
          + '  </tr>';
    });
    
    return '<table class="table_lines" width="100%" cellpadding="6">'
        + '  <tbody>' 
        + '    <tr><th colspan=3>Investment Profile </th></tr>'
        + '    <tr><th class="subh">&nbsp;&nbsp;&nbsp;</th><th class="subh">1 Hour&nbsp;</th><th class="subh">1 Day</th></tr>' 
        + rows
        + '  </tbody>'
        + '</table>';
  }
}});
