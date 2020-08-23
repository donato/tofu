define([
  'plugins/luxbot-logging',
  'utils/koc_utils',
  'jquery',
  'underscore'
], function (Logging, Koc, $, _) {
  const map = {};

  function findValue(key) {
    return map[key];
    // const $keyCell = $("table.table_lines td:contains('" + key + "')");
    // const $valueCell = $keyCell.next();
    // return $valueCell.text();
  }

  function findInt(key) {
    return to_int(findValue(key));
  }

  /**
   * Note: for sabotages it says "your spies" for recon "your spy"
   */
  function isSabotage(pageText) {
    return pageText.indexOf('Your spy') == -1;
  }

  return {
    //process recons and sabotages
    run: function () {
      $("table.table_lines tr td:first-child").each((a, b) => {
        $cell = $(b);
        $value = $cell.next().text();
        map[$.trim($cell.text())] = $value;
      });
      const logid = Koc.Page.getCurrentPageId('report_id');
      var enemyId = $("input[name='id']").val();
      var text = $("td.content").text();

      if (isSabotage(text)) {
        this.processSabotage(enemyId, logid, text);
      } else {
        this.processRecon(enemyId, logid, text);
      }
    },

    processRecon: function (enemyId, logid, text) {
      if (text.indexOf('As he gets closer, one of the sentries spots him and sounds the alarm.') != -1) {
        return;
      }

      var enemyNick = text.between("your spy sneaks into ", "'s camp");
      const $goldTable = Koc.getTableByHeading('Treasury');
      const treasuryGold = to_int($goldTable.find('tr').eq(1).text());
      const safeGold = to_int($goldTable.find('tr').eq(3).text());
      // Order is important here when sending logs to the server
      var rows = [
        findInt("Strike Action"),
        findInt("Defensive Action"),
        findInt("Spy Rating"),
        findInt("Sentry Rating"),
        findInt("Attack Mercenaries:"),
        findInt("Defense Mercenaries:"),
        findInt("Untrained Mercenaries:"),
        findInt("Attack Soldiers:"),
        findInt("Defense Soldiers:"),
        findInt("Untrained:"),
        findInt("Covert Skill:"),
        findInt("Experience:"),
        findInt("Attack Turns:"),
        findInt("Unit Production:"),
        treasuryGold,
        findInt("Covert Spies:"),
        findInt("Sentries:"),
        findInt("Sentry Skill:"),
        safeGold,
        findInt("Experience Per Turn:"),
      ];

      const sanitizedRows = rows.map(r => {
        if (r == -1) return '';
        return r;
      });
      const data = sanitizedRows.join(";");
      const siege = findValue('Siege Technology:');
      const economy = findValue('Economy:');
      const technology = findValue('Technology:');

      const stable = $("table:contains('Weapons')").last();
      var weap_rows = $(stable).find("tbody>tr>td").parent();
      var weap_array = _.map(weap_rows, function (row) {
        let $row = $(row);
        var r = $row.text().split("\n");
        var g = r[1].trim() + ":" + r[2].trim() + ":" + r[3].trim() + ":" + r[4].trim();
        return g;
      });
      var weaponString = weap_array.join(';').replace(/\?\?\?/g, '').replace(/,/g, '');
      // TODO: Redo how logging occurs from server
      Logging.logRecon(enemyNick, enemyId, siege, economy, technology, data, weaponString, logid);
    },

    processSabotage: function (enemyId, logId, sabtext) {
      if (!sabtext || sabtext.indexOf('Your covert team has successfully') == -1) {
        // failed sabotage
        return;
      }
      // Nothing to sabotage because the weapon was already taken
      if (sabtext.indexOf('your spies cannot find a') != -1) {
        return;
      }
      var enemyNick = textBetween(sabtext, ' infiltrated ', '\'s armory');
      //var targetAmount = to_int(textBetween(sabtext, 'attempt to sabotage ', ' of'));
      var targetWeapon = textBetween(sabtext, 'weapons of type ', '.');
      var sabbedAmount = to_int(textBetween(sabtext, 'successful in destroying ', ' of '));
      var leftAmount = to_int(textBetween(sabtext, 'now has ', ' left.'));
      var goldStolen = to_int(textBetween(sabtext, 'steal ', ' Gold'));
      var experience = to_int(textBetween(sabtext, 'gained ', ' Experience'));

      Logging.logSabotage(enemyNick, targetWeapon, sabbedAmount, leftAmount, goldStolen, experience, logId);
    }
  };
});