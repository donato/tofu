define([
  'utils/koc_utils',
  'utils/upgrades.json',
  'plugins/luxbot-logging',
  'jquery',
  'underscore'
], function (Koc, Upgrades, Log, $, _) {
  const db = Koc.db;

  return {

    run: function () {
      this.logBaseStats();
    },

    logBaseStats: function () {
      var $militaryTable = Koc.getTableByHeading('Military Effectiveness');
      var stats = Koc.parseTableColumn($militaryTable, 1);
      var sa = stats[0];
      var da = stats[1];
      var spy = stats[2];
      var sentry = stats[3];

      var $overviewTable = Koc.getTableByHeading('Military Overview');
      var dict = Koc.parseTableColumnToDict($overviewTable, 0, 1);
      var fortName = dict['Fortification'].substr(0, dict['Fortification'].indexOf(' ('));
      var siegeName = dict['Siege'].substr(0, dict['Siege'].indexOf(' ('));
      var economy = dict['Economy'].substr(0, dict['Economy'].indexOf(' ('));
      const technologyName = dict['Technology'].substr(0, dict['Technology'].indexOf(' ('));
      const techDetails = Upgrades.technological_development.find((obj) => obj.name == technologyName);
      const techBonus = techDetails.multiplier;
      var conscription = dict['Conscription'];
      conscription = to_int(conscription.substr(0, conscription.indexOf(' Soldiers')));
      var covertlevel = to_int(dict['Covert Level']);
      var sentrylevel = to_int(dict['Sentry Level']);
      var income = dict['Projected Income'];
      income = income.substr(0, income.indexOf(" Gold")).int();
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
      var race = textBetween($("head>link").eq(3).attr("href"), "css/", ".css").toLowerCase();
      // TODO(donato): Fix officer tracking
      var officers = ''; //this.getOfficers(false);

      // offie bonus feature is disabled
      // var bonus = parseFloat(textBetween($(".officers>tbody>tr:last").text(), "(x ",")")) || 1.0;
      var bonus = 1;

      db.put('sa', sa);
      db.put('da', da);
      db.put('spy', spy);
      db.put('sentry', sentry);
      db.put('income', income);
      db.put('technology', techBonus);
      db.put('tff', tff);
      db.put('bonus', bonus);
      db.put('fort', fortName);
      db.put('siege', siegeName);
      db.put('covertlevel', covertlevel);
      db.put('sentrylevel', sentrylevel);
      db.put('race', race);

      // Example inputs:
      //  stats=1037189702;46790709;650248517;111360121
      //  data=Stronghold;Cannons;Hunting;Printing;6400;20000;15;;723;33;0;58080;20475;5090;77975887;3;13;12052;8455;12174
      //  officers=
      const weaponStats = [sa.int(), da.int(), spy.int(), sentry.int()];
      const otherStats = [
        fortName, siegeName, economy, technologyName, conscription.int(), turns.int(), covertlevel.int(), bonus,
        attackMercs.int(), defenseMercs.int(), untrainedMercs.int(), attackers.int(), defenders.int(),
        untrained.int(), safe_gold.int(), exp_per_turn.int(), sentrylevel.int(), spies.int(), sentries.int(), experience.int()
      ];
      Log.logBase(weaponStats.join(';'), otherStats.join(';'), officers);
    }
  }
});
