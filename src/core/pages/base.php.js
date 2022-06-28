import Koc from 'utils/koc_utils';
import Upgrades from 'utils/upgrades.json';
import Log from 'plugins/luxbot-logging';
import $ from 'jquery';
const db = Koc.db;



class BasePage {
  run() {
    this.defineTables();
    this.logBaseStats();
  }

  defineTables() {
    this.$militaryTable = Koc.getTableByHeading('Military Effectiveness');
    this.$overviewTable = Koc.getTableByHeading('Military Overview');
    this.$armyTable = Koc.getTableByHeading('Personnel');
  }

  logBaseStats() {
    const stats = Koc.parseTableColumnToDict(this.$militaryTable, 0, 1);
    const sa = stats['Strike'];
    const da = stats['Defense'];
    const spy = stats['Spy'];
    const sentry = stats['Sentry'];
    db.putAll({
      'sa': sa,
      'da': da,
      'spy': spy,
      'sentry': sentry,
    });

    const dict = Koc.parseTableColumnToDict(this.$overviewTable, 0, 1);
    const fortName = dict['Fortification'].substr(0, dict['Fortification'].indexOf(' ('));
    const siegeName = dict['Siege'].substr(0, dict['Siege'].indexOf(' ('));
    const economy = dict['Economy'].substr(0, dict['Economy'].indexOf(' ('));
    const technologyName = dict['Technology'].substr(0, dict['Technology'].indexOf(' ('));
    const techDetails = Upgrades.technological_development.find((obj) => obj.name == technologyName);
    const techBonus = techDetails.multiplier;
    // Conscription has been disabled in game.
    // let conscription = dict['Conscription'];
    // conscription = to_int(conscription.substr(0, conscription.indexOf(' Soldiers')));
    const conscription = 0;
    const covertlevel = to_int(dict['Covert Level']);
    const sentrylevel = to_int(dict['Sentry Level']);
    var income = dict['Projected Income'];
    income = income.substr(0, income.indexOf(" Gold")).int();
    const exp_per_turn = to_int(dict['Experience Per Turn']);
    const soldiersPerTurn = to_int(dict['Soldier Per Turn']);
    db.putAll({
      'income': income,
      'technology': techBonus,
      'fort': fortName,
      'siege': siegeName,
      'covertlevel': covertlevel,
      'sentrylevel': sentrylevel,
    });

    const armyDict = Koc.parseTableColumnToDict(this.$armyTable, 0, 1);
    const tff = to_int(armyDict['Total Fighting Force']);
    const attackMercs = to_int(armyDict['Trained Attack Mercenaries']);
    const defenseMercs = to_int(armyDict['Trained Defense Mercenaries']);
    const attackers = to_int(armyDict['Trained Attack Soldiers']);
    const defenders = to_int(armyDict['Trained Defense Soldiers']);
    const untrained = to_int(armyDict['Untrained Soldiers']);
    const untrainedMercs = to_int(armyDict['Untrained Mercenaries']);
    const spies = to_int(armyDict['Spies']);
    const sentries = to_int(armyDict['Sentries']);
    const hostageTotal = to_int(armyDict['Hostages Taken Total This Era']);
    db.putAll({
      'tff': tff,
    });

    // Other stuff
    const turns = Koc.Page.getPlayerTurns();
    const safe_gold = Koc.Page.getPlayerSafe();
    const experience = Koc.Page.getPlayerExperience();
    const race = textBetween($("head>link").eq(3).attr("href"), "css/", ".css").toLowerCase();
    const officers = ''; 
    // officer bonus feature is disabled
    // const bonus = parseFloat(textBetween($(".officers>tbody>tr:last").text(), "(x ",")")) || 1.0;
    const bonus = 1;
    db.putAll({
      'turns': turns,
      'experience': experience,
      'race': race,
      'bonus': bonus,
    });


    // Example inputs:
    //  stats=1037189702;46790709;650248517;111360121
    //  data=Stronghold;Cannons;Hunting;Printing;6400;20000;15;;723;33;0;58080;20475;5090;77975887;3;13;12052;8455;12174
    //  officers=
    const totalStats = [sa.int(), da.int(), spy.int(), sentry.int()];
    const otherStats = [
      fortName, siegeName, economy, technologyName, conscription.int(), turns.int(), covertlevel.int(), bonus,
      attackMercs.int(), defenseMercs.int(), untrainedMercs.int(), attackers.int(), defenders.int(),
      untrained.int(), safe_gold.int(), exp_per_turn.int(), sentrylevel.int(), spies.int(), sentries.int(), 
      experience.int(), soldiersPerTurn.int(), hostageTotal.int()
    ];
    Log.logBase(totalStats.join(';'), otherStats.join(';'), officers);
  }
}

export default new BasePage();
