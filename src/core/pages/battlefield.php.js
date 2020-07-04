define([
  'utils/koc_utils',
  'utils/constants',
  'jquery',
  'underscore'
], function (Koc, Constants, $, _) {

  const kocidToRowMap = {};

  return {
    statsLoadedId: undefined,

    run: function () {
      this.handlePage();
    },

    // we break this out, so it can be rerun when navigating across pages.
    handlePage() {
      var $playerRows = $('tr.player');
      var logInfo = this.parseBattlefieldPlayers($playerRows);
      this.handleTreasury(logInfo);

      var kocids = _.keys(logInfo);
      this.needsRecon(kocids);

      // This needs to be done every time because the links are reset
      this.addClickEventsForUsers();
      this.addClickEventsForNavigation();

      // I think this feature has been banned. May try to appeal the ruling.
      // this.onlineUsers(kocids);
    },

    parseBattlefieldPlayers: function($playerRows) {
      var logInfo = {};
      $playerRows.each(function (index, row) {
        var $row = $(row);
        var $cols = $row.find('td');
        var kocid = $row.attr('user_id');
        if (!kocid) {
          return;
        }

        var gold = to_int($cols.eq(5).text());
        if (gold === -1 || name == User.kocnick && User.logself === 0) {
          gold = '';
        }
        kocidToRowMap[kocid] = $row;
        logInfo[kocid] = {
          'name': $cols.eq(2).text(),
          'race': $cols.eq(4).text().trim(),
          'gold': gold,
          'rank': to_int($cols.eq(7).text()),
          'alliance': $.trim($cols.eq(1).text()),
          'tff': to_int($cols.eq(3).text())
        };
      });
      return logInfo;
    },

    handleTreasury: function(logInfo) {
      function showGold(json) {
        _.each(json, function (obj, id) {
          var rowTd = kocidToRowMap[id].find('td').eq(5);
          rowTd.text(addCommas(obj['gold']) + ' Gold, ' + obj['update']);
          rowTd.css('color', '#aaaaaa');
          rowTd.css('font-style', 'italic');
        });
      }
      //logInfo: {"4530059":{"name":"x","race":"y","gold":"z","rank":666,"alliance":"","tff":53445}}
      postLuxJson('&a=battlefield', logInfo,
          function (r) {
            var json = $.parseJSON(r.responseText);
            showGold(json);
      });
    },

    /*
     * Ask lux which of these kocids need updated recon data
     */
    needsRecon: function (kocids) {
      getLux('&a=bf_needsrecon&u=' + kocids,
          function (r) {
            // 4538896:678:SHAMELESS;
            var players = r.responseText.split(';');
            for (i = 0; i < players.length; i++) {
              if (players[i] === '') {
                continue;
              }
              var [kocid, rank, name] = players[i].split(':');
              var $row = kocidToRowMap[kocid];
              var $user_td = $row.children('td').eq(2);
              $user_td.append('<a href="http://www.kingsofchaos.com/attack.php?id=' + kocid + '"><img title="Stats are out of date" class="_lux_needs_update" src="http://donatoborrello.com/bot/img/luxupdate.gif" /></a>');
            }
          });
    },

    onlineUsers: function (kocids) {
      getLux('&a=bf_online&u=' + kocids,
          function (r) {
            var players = r.responseText.split(';');
            var i;
            for (i = 0; i < players.length; i++) {
                if (players[i] === '') {
                    continue;
                }
                var s = players[i].split(':');
                var id = s[0];
                var $row = kocidToRowMap[id];
                var $user_td = $row.children('td').eq(2);
                $user_td.append(' <sup style="color:0066CC">Online</sup>');
              }
          });
    },

    showUserInfo: function(response, userid) {
      clearTimeout(this.showInfoTimeout);
      var data = response.responseText;

      // It may take koc a second to unload the previous id and load the new one
      var $container = $('tr.profile').find("form[action='writemail.php']").closest('tbody');
      if ($container.size() < 1) {
        this.showInfoTimeout = setTimeout(() => this.showUserInfo(response, userid), 100);
        return;
      }
      
      var activeTable = $('tr.profile').find('input[name="to"]').attr('value');
      if (activeTable !== userid) {
        this.showInfoTimeout = setTimeout(() => this.showUserInfo(response, userid), 100);
        return;
      }

      if (data == '403') {
        $container.prepend('<tr class="lux_bf_inject"><td colspan="4" style="font-weight:bold;text-align:center;background-color:#B4B5B4;color:#181818;border-bottom:1px solid black;padding:5px 0 5px 10px;">Access denied</td>');
      } else if (data == 'N/A') {
        $container.prepend('<tr class="lux_bf_inject"><td colspan="4" style="font-weight:bold;text-align:center;background-color:#B4B5B4;color:#181818;border-bottom:1px solid black;padding:5px 0 5px 10px;">No data available</td>');
      } else {
        var userInfo = data.split(';');
        var i;

        for (i = 4; i >= 0; i--) {
          var stat = userInfo[i * 2];
          var time = userInfo[i * 2 + 1];
          $container.prepend("<tr class='lux_bf_inject'><td style='font-weight:bold'>" + Constants.statsdesc[i] + "</td><td>" + stat + "</td><td class='time_passed'>" + time + "</td></tr>")
        }
      }
    },

    addClickEventsForUsers: function () {
      var self = this;
      // we can't use $('table.battlefield').on(click, 'a.player', ..) because events are not propagated after click.
      $("a.player").click((event) => {
        if (String(event.target).indexOf('stats.php') > -1) {
          var userid = String(event.target).substr(String(event.target).indexOf('=') + 1, 7);
          if (self.statsLoadedId == userid) {
            self.statsLoadedId = 0;
            return;
          }

          getLux('&a=getstats&userid=' + userid,
              (response) => this.showUserInfo(response, userid));
        }
      });
    },

    addClickEventsForNavigation: function() {
      var $nav = $("tr.nav");
      if ($nav.size()) {
        var q = $nav.find('a');
        var self = this;
        q.on('click', () => {
          setTimeout(() => this.handlePage(), 1000);
        });
        
        if (q.size() > 1) {
          q[1].accessKey = 'c';
          q[0].accessKey = 'x';
        } else {
          if (q[0].innerHTML.indexOf('lt') !== -1) {
            q[0].accessKey = 'x';
          } else {
            q[0].accessKey = 'c';
          }
        }
      }
    }
  }
});