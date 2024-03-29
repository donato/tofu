import Logging from 'plugins/luxbot-logging';
import Koc from 'utils/koc_utils';
import $ from 'jquery';
// Both tables get reset any time either table is paged between.
const loggedIds = new Set();

function logTable(aggressor, $table) {
  let columnNames = $table.find('th.subh').map((idx, element) => $(element).text()).get();
  const nameToIndex = columnNames.reduce((memo, name, idx) => {
    memo[name] = idx;
    return memo;
  }, {});

  let $rows = $table.find('tr').not('.nav').not(':has(th)');
  $rows.map((idx, row) => {
    const $columns = $(row).find('td');

    const $enemy = $columns.eq(nameToIndex['Enemy']);
    const $result = $columns.eq(nameToIndex['Result']);
    const type = $columns.eq(nameToIndex['Type']).text();
    const enemyLosses = $columns.eq(nameToIndex['Enemy Losses']).text();
    const yourLosses = $columns.eq(nameToIndex['Your Losses']).text();
    const enemyDamage = $columns.eq(nameToIndex['Damage by Enemy']).text();
    const yourDamage = $columns.eq(nameToIndex['Damage by You']).text();
    // TODO(): Use timestamp instead of calculating time.
    const timePart = $columns.eq(0).text();
    const timeUnit = $columns.eq(1).text();
    const time = Koc.timeToSeconds(timePart, timeUnit);
    const timestamp = $columns.eq(nameToIndex['TimeStamp']).text();

    let enemyId, enemyNick;
    if ($enemy.text().indexOf("(not active)") === -1) {
      enemyId = Koc.parseKocIdFromLink($enemy);
      enemyNick = $enemy.text();
    } else {
      enemyId = ":invalid";
      enemyNick = $enemy.text().match(/">(.+)\(not active/)[1];
    }

    const logid = Koc.parseLogIdFromLink($result);
    let gold = to_int($result.text());
    if (gold === -1) {
      gold = "defended";
    }
 
    if (loggedIds.has(logid)) {
      return;
    }
    loggedIds.add(logid);

    // TODO(): Begin logging type
    Logging.sendAttackLogDetails(
      User.kocnick, aggressor, enemyId, enemyNick,
      yourDamage, enemyDamage, yourLosses, enemyLosses,
      gold, logid, time);
  });
}

export default {
  run : function() {
    this.logPage();
    this.listenForNavigation();
  },

  logPage: function() {
    const $defenses = Koc.getTableByHeading('Attacks on You');
    const $attacks = Koc.getTableByHeading('Attacks by You');
    logTable("defend", $defenses);        
    logTable('attack', $attacks);
  },

  listenForNavigation: function(logInfo) {
    $('body').on('DOMNodeInserted', 'table.attacklog', () => {
      this.logPage();
    });
  },
};
