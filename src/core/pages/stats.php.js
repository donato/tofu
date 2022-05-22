import Logging from 'plugins/luxbot-logging';
import Constants from 'utils/constants';
import Koc from 'utils/koc_utils';
import $ from 'jquery';

const TREASURY_UNKNOWN = -1;

export default {
  run: function() {

    this.pageKocid = Koc.Page.getCurrentPageId();
    
    const $infoTable = $("table")
        .filter((index, elem) => elem.textContent.includes("Army Size"))
        .last();
    const logInfo = this.parsePage($infoTable);
    if (!logInfo) {
      Logging.logStats('', this.pageKocid, '', '','', 'invalid', '');
      return;
    }
    Logging.logStats(this.pageKocid, logInfo, this.getOfficers());
    
    this.listenForOfficerNavigation(logInfo);
    this.addViewHistoryButton($infoTable, logInfo.name);
  },

  findAllianceElement($infoTable) {
    return $infoTable
      .find('td').get()
      .find(td => { 
        console.log(td);
        return td.innerHTML.indexOf('Alliance:') != -1;
      });
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

    const allianceElement = this.findAllianceElement($infoTable);
    const primaryAllianceLink = $(allianceElement).find('a').first().attr('href');
    var primaryAllianceId = primaryAllianceLink ? primaryAllianceLink.split('id=')[1] : '';
    // Example race: "Humans | Let's hunt some Orcs!"
    var race = dict['Race:'].split(' | ')[0];
    // Example highestRank: "600 / 2 hours ago"
    var highestRank = 0; //to_int(dict['Highest Rank:'].split(' / ')[0]);
    var previousAgeRank = dict['Previous Age Rank'];
    var tff = to_int(dict['Army Size:']);
    var morale = to_int(dict['Army Morale:']);
    var fort = dict['Fortifications:'];
    var chain = dict.hasOwnProperty('Chain Name:') ? to_int(dict['Chain Name:']) : '';     
    var treasury = dict.hasOwnProperty('Treasury:') ? to_int(dict['Treasury:']) : TREASURY_UNKNOWN;

    var commanderHtml = $infoTable.find("tr")
      .filter((index, elem) => elem.textContent.includes("Commander:"))
      .child("td")
      .last().html();
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
    var $nameTd = $infoTable.find('tr')
        .filter((index, elem) => elem.textContent.includes("Name:"))
        .first().find("td").last();
    const detailsUrl = Constants.statsUrl+'/intel.php?playerSearch='+ name;
    const historyUrl = Constants.statsUrl+'/history.php?playerSearch='+ name;
    $nameTd.append('<a href="'+ detailsUrl +'" target="_blank" class="tofu viewHistory">(Recon)</a>');
    $nameTd.append('<a href="'+ historyUrl +'" target="_blank" class="tofu viewHistory">(History)</a>');
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

    return Koc.compact(offieRows).join(';');            
  },
};