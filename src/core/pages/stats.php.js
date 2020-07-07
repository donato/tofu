define([
    'plugins/luxbot-logging',
    'utils/constants',
    'utils/koc_utils',
    'jquery',
    'underscore'
], function(Logging, Constants, Koc, $, _) {

    var getTableByHeading = Koc.getTableByHeading;

  return {
    run: function() {
      this.pageKocid = document.URL.split(/[=&?]/)[2];

      const logInfo = this.parsePage();

      if (!logInfo) {
        Logging.logStats('', this.pageKocid, '', '','', 'invalid', '');
        return;
      }
      var officers = this.getOfficers();
      Logging.logStats(this.pageKocid, logInfo, officers);
      this.insertTableSlots();
      // this.logOfficers();
      // this.addIncomeCalc(race, tff);
      // this.nav();

      // this.collapseAllianceInfoS();
      // this.showLoggedStats();
      // this.addStatsPageButtons();
    },
    
    /** Parses the main info, everything except the officers. */
    parsePage: function() {
      if (document.body.innerHTML.indexOf('Invalid User ID') != -1) {
        return null;
      } 

      var $infoTable = $("table:contains('Army Size')").last();
      var dict = Koc.parseTableColumnToDict($infoTable, 0, 1);

      var name = dict['Name:'];
      var rank = to_int(dict['Rank:']);
      var primaryAlliance = dict['Alliances:'];
      // Example race: "Humans | Let's hunt some Orcs!"
      var race = dict['Race:'].split(' | ')[0];
      // Example highestRank: "600 / 2 hours ago"
      var highestRank = to_int(dict['Highest Rank:'].split(' / ')[0]);
      var previousAgeRank = dict['Previous Age Rank'];
      var tff = to_int(dict['Army Size:']);
      // TODO() make sure to_int handles negatives properly
      var morale = to_int(dict['Army Morale:']);
      var fort = dict['Fortifications:'];
      var chain = dict.hasOwnProperty('Chain Name:') ? to_int(dict['Chain Name:']) : '';     
      var treasury = dict.hasOwnProperty('Treasury:') ? to_int(dict['Treasury:']) : '';

      const commanderRowHtml = $infoTable.find("tr:contains('Commander:')>td:last").html().trim();
      const commanderId = textBetween(commanderRowHtml,'id=','"');     

      return {
        name,
        commanderId,
        primaryAlliance,
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
    
    insertTableSlots() {
      // experimenting with the idea of providing a bunch of slots for places to put
      // ui elements and letting users drag/drop the table to wherever they want it.
      const $uiTables = $('td[width="50%"]').children('table');
      $uiTables.after('<div class="lux_table_slot">');
    },

    showLoggedStats: function() {
      var self = this;
      var userid = document.URL.substr(document.URL.indexOf('=')+1, 7);

      $('#luxstats_reload').on('click',function() {
          self.updateUserInfoS(userid);
      });

      var offieTable = $('body').find("table:contains('Officers'):last");
      offieTable.parent().prepend("<table id='luxstats_info' class='table_lines' width='100%' cellPadding=6 cellSpacing=0><tbody></tbody></table><br />");
      
      $("#luxstats_info>tbody").html('<tr><th colspan="3">LuXBot Info<span id="luxstats_reload" style="cursor:pointer;color:pink;font-size:8pt;float:right">(reload)</span></th></tr>');

      this.updateUserInfoS(userid);
    },

    updateUserInfoS: function(userid) {
      getLux('&a=getstats&userid=' + userid, (responseDetails) => {
            var i;
            var container = $("#luxstats_info");
            $(container).find("td").parent().remove();
            if (responseDetails.responseText == '403') {
                container.append('<tr><td colspan="2" style="font-weight:bold;text-align:center;">Access denied</td></tr>');
            } else if (responseDetails.responseText == 'N/A') {
                container.append('<tr><td colspan="2" style="font-weight:bold;text-align:center;">No data available</td></tr>');

            } else {
                var userInfo = responseDetails.responseText.split(';');

                for (i = 0; i < 10; i+=2) {
                    if (userInfo[i]== '???') {
                        container.append("<tr><td>"+Constants.statsdesc[i/2]+"</td><td colspan=2>"+userInfo[i]+"</td></tr>");
                    }
                    else
                        container.append("<tr><td>"+Constants.statsdesc[i/2]+"</td><td>"+userInfo[i]+"</td><td class='_luxbotago'>"+userInfo[i+1]+"</td></tr>");
                }
                if (userInfo.length > 10)
                    container.append("<tr><td>"+userInfo[11]+"</td></tr>");
            }
        });
    },
    
    collapseAllianceInfoS: function() {
      var nameRE = /User Stats<\/th>/ig;
      var q = document.getElementsByTagName('table');
      var statstable;
      var i;
      
      for(i = 0; i < q.length; i++){
          if(q[i].innerHTML.match(nameRE) && !q[i].innerHTML.match(/<table/)) {
              statstable = q[i];
              break;
          }
      }
      
      if (statstable === undefined) { return; }
      
      var allianceindex;
      for (i = 0; i < statstable.rows.length; i++) {
          if (statstable.rows[i].cells[0].innerHTML.indexOf('Alliances') > -1) {
              allianceindex = i;
              break;
          }
      }

      // alliance splitted
      var alliances = statstable.rows[allianceindex].cells[1].innerHTML.split(',');
      var pri_alliance = 'None';
      var sec_alliances = [];
      for (i = 0; i < alliances.length; i++) {
          if (alliances[i].indexOf('(Primary)') > -1) {
              pri_alliance = alliances[i];
          } else {
              sec_alliances[sec_alliances.length] = alliances[i];
          }
          continue;
      }
  
      statstable.rows[allianceindex].cells[0].innerHTML = '<b>Alliances (' + alliances.length + '):</b>';
      statstable.rows[allianceindex].cells[1].innerHTML = pri_alliance + '<br><div id="_luxbot_alliances">' + sec_alliances.join(', ') + '</div><a id="expandAlliances"> + Show Secondary</a>';

      $("body").on('click', '#expandAlliances', function(){
        var q = document.getElementById('_luxbot_alliances');
        q.style.display = 'none';
        q.style.visibility = 'hidden';
        q.nextSibling.id = 'collapseAlliances';
        q.nextSibling.innerHTML = ' + Show Secondary';
      });
      $("body").on('click', '#collapseAlliances', function(){
        var q = document.getElementById('_luxbot_alliances');
        q.style.display = 'block';
        q.style.visibility = 'visible';
        q.nextSibling.id = 'expandAlliances';
        q.nextSibling.innerHTML = ' - Hide Secondary'
      });
    },
    
    addIncomeCalc: function(race, tff) {
        var bonus = 1;        
        if(race == 'Humans') { bonus = 1.30; }
        if(race == 'Dwarves') { bonus = 1.15; }
        
        var formattedTbg = addCommas(Math.floor(60* tff *bonus));
        
        var nameIC = /<td><b>Name:<\/b>/;
        var z = document.getElementsByTagName('table');
        var table;
        
         for(var i = 0; i < z.length; i++){
            if(z[i].innerHTML.match(nameIC) && !z[i].innerHTML.match(/<table/)) {
                table = z[i];
                break;
            }
        }
         
         var x = table.insertRow(10);
         x.insertCell(0).innerHTML = '<b>Estimated gold per Hour:<b>';
         x.insertCell(1).innerHTML = '(' + formattedTbg + ')';
    },
    
    addStatsPageButtons: function() {
        var $table = getTableByHeading("User Stats");
        
        var $nameTd = $table.find('tr:contains("Name:")').first().find("td").last();
        $nameTd.append(' <a href="http://www.stats.luxbot.net/history.php?playerSearch='+ this.pageKocid +'" target="_blank" class="tofu viewHistory">View history</a>');
    },

    nav: function() {
        $("table.officers tr.nav a").click(() => {
            setTimeout(function() {
                this.logOfficers();
            },100);
            self.nav();
        });
    },
    
    logOfficers() {

    },

    getOfficers: function() {
      // var $officersTable = Koc.getTableByHeading('Officers');
      var officers = "";
      var rows = $("table.officers>tbody>tr>td>a").parent().parent();
      $(rows).each(function(i,row) {
          if ( ! $(row).hasClass('nav')) {
              var offieInfo = $(row).find("td:eq(0)").html();
              officers += textBetween(offieInfo,"id=",'"') +";";
          }
      });
      
      //cut off trailing semicolon
      officers = officers.slice(0, -1);

      return officers;            
    },

}});