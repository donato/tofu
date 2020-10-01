define([
    'plugins/luxbot-logging',
    'utils/constants',
    'utils/koc_utils',
    'jquery',
    'underscore'
], function(Logging, Constants, Koc, $, _) {

  return {
    run: function() {

      this.pageKocid = Koc.Page.getCurrentPageId();
      
      const $infoTable = $("table:contains('Army Size')").last();
      const logInfo = this.parsePage($infoTable);
      if (!logInfo) {
        Logging.logStats('', this.pageKocid, '', '','', 'invalid', '');
        return;
      }
      Logging.logStats(this.pageKocid, logInfo, this.getOfficers());
      
      this.listenForOfficerNavigation(logInfo);
      this.addViewHistoryButton($infoTable, logInfo.name);
    },
    
    /** Parses the main info, everything except the officers. */
    parsePage: function($infoTable) {
      if (document.body.innerHTML.indexOf('Invalid User ID') != -1) {
        return null;
      } 

      var dict = Koc.parseTableColumnToDict($infoTable, 0, 1);

      var name = dict['Name:'];
      if (name.indexOf('[MAXED]') != -1) {
        name = name.split('[MAXED]')[0];
      }
      var rank = to_int(dict['Rank:']);
      const primaryAllianceLink = dict['element']['Alliances:'].find('a').first().attr('href');
      var primaryAllianceId = primaryAllianceLink ? primaryAllianceLink.split('id=')[1] : '';
      // Example race: "Humans | Let's hunt some Orcs!"
      var race = dict['Race:'].split(' | ')[0];
      // Example highestRank: "600 / 2 hours ago"
      var highestRank = to_int(dict['Highest Rank:'].split(' / ')[0]);
      var previousAgeRank = dict['Previous Age Rank'];
      var tff = to_int(dict['Army Size:']);
      var morale = to_int(dict['Army Morale:']);
      var fort = dict['Fortifications:'];
      var chain = dict.hasOwnProperty('Chain Name:') ? to_int(dict['Chain Name:']) : '';     
      var treasury = dict.hasOwnProperty('Treasury:') ? to_int(dict['Treasury:']) : '';

      const commanderRowHtml = $.trim($infoTable.find("tr:contains('Commander:')>td:last").html());
      const commanderId = textBetween(commanderRowHtml,'id=','"');     

      return {
        name,
        commanderId,
        primaryAllianceId,
        secondaryAlliances : '',
        race,
        rank,
        previousAgeRank,
        highestRank,
        tff,
        morale,
        treasury,
        fort,
        chain,
      }
    },
    
    addViewHistoryButton: function($infoTable, name) {
      var $nameTd = $infoTable.find('tr:contains("Name:")').first().find("td").last();
      const url = Constants.statsUrl+'/history.php?playerSearch='+ name;
      $nameTd.append('<a href="'+ url +'" target="_blank" class="tofu viewHistory">View history</a>');
    },

    listenForOfficerNavigation: function(logInfo) {
      $('body').on('DOMNodeInserted', 'table.officers', () => {
        Logging.logStats(this.pageKocid, logInfo, this.getOfficers());
      });
    },

    getOfficers: function() {
      // var $officersTable = Koc.getTableByHeading('Officers');
      const $officersTable = $('table.officers');
      const $officerRows = $officersTable.find('tr').filter(':not(".nav")').get()
      const offieRows = $officerRows.map(element => {
        return Koc.parseKocIdFromLink($(element));
      });

      return _.compact(offieRows).join(';');            
    },
}});