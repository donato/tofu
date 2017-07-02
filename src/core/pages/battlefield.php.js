define([
    'utils/constants',
    'jquery',
    'underscore'
], function (Constants, $, _) {

    return {
        statsLoadedId: undefined,

        run: function () {
            this.battlefieldAct();
        },

        battlefieldAct: function () {
            var $playerRows = $('tr.player');
            var logInfo = this.parseBattlefieldPlayers($playerRows);

            this.handleTreasury(logInfo);
            this.needsRecon(logInfo);
            this.onlineUsers($playerRows);
            
            // This needs to be done every time because the
            // links are reset
            this.addClickEventsForUsers();
            this.addClickEventsForNavigation();
        },
        
        handleTreasury: function(logInfo) {
            var self = this;
            postLuxJson('&a=battlefield', logInfo,
                function (r) {
                    var json = $.parseJSON(r.responseText);

                    self.showGold(json);
                });
        },

        addClickEventsForNavigation: function() {
            var $nav = $("tr.nav");
            if ($nav.size()) {
                var q = $nav.find('a');
                var self = this;
                q.on('click', function() {
                    setTimeout(self.battlefieldAct.bind(self), 1000);
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
        },

        parseBattlefieldPlayers: function($playerRows) {
            var logInfo = {};
            $playerRows.each(function (index, row) {
                var $cols = $(row).find('td');
                var kocid = $(row).attr('user_id');
                if (!kocid) {
                    return;
                }

                var gold = to_int($cols.eq(5).text());
                if (gold === -1 || name == User.kocnick && User.logself === 0) {
                    gold = '';
                }

                logInfo[kocid] = {
                    '$elem': row,
                    'name': $cols.eq(2).text(),
                    'race': $cols.eq(4).text().trim(),
                    'gold': gold,
                    'rank': to_int($cols.eq(6).text()),
                    'alliance': $.trim($cols.eq(1).text()),
                    'tff': to_int($cols.eq(3).text())
                };
            });
            return logInfo;
        },

        showGold: function (json) {

            _.each(json, function (obj, id) {
                var GoldTd = $("tr[user_id='" + id + "'] > td").eq(5);
                GoldTd.text(addCommas(obj['gold']) + ' Gold, ' + obj['update']);
                GoldTd.css('color', '#aaaaaa');
                GoldTd.css('font-style', 'italic');
            });
        },

        needsRecon: function (logInfo) {
            var kocids = _.keys(logInfo);

            getLux('&a=bf_needsrecon&u=' + kocids,
                function (r) {
                    var i, s, id, rank, name;
                    var players = r.responseText.split(';');

                    for (i = 0; i < players.length; i++) {
                        if (players[i] === '') {
                            continue;
                        }
                        s = players[i].split(':');
                        id = s[0];
                        rank = s[1];
                        name = s[2];
                        var $row = $(logInfo[id]['$elem']);
                        var $user_tds = $row.children('td').eq(2);
                        $user_tds.append('<a href="http://www.kingsofchaos.com/attack.php?id=' + id + '"><img title="Stats are out of date" class="_lux_needs_update" src="http://donatoborrello.com/bot/img/luxupdate.gif" /></a>');
                    }
                });
        },

        onlineUsers: function (logInfo) {
            var kocids = _.keys(logInfo);

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
                        var $row = $(logInfo[id]['$elem']);
                        var $user_td = $row.children('td').eq(2);
                        $user_td.append(' <sup style="color:0066CC">Online</sup>');
                    }
                });
        },


        showUserInfo: function (response) {
            clearTimeout(this.showInfoTimeout);
            var data = response.responseText;

            // It may take koc a second to unload the previous id and load the new one
            var $container = $('tr.profile').find("form[action='writemail.php']").closest('tbody');
            if ($container.size() < 1) {
                this.showInfoTimeout = setTimeout(this.showUserInfo.bind(this, response), 50);
                return;
            }
            
            var activeTable = $('tr.profile').find('input[name="to"]').attr('value');
            if (activeTable !== this.statsLoadedId) {
                this.showInfoTimeout = setTimeout(this.showUserInfo.bind(this, response), 50);
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
            $("a.player").on('click', function (event) {
                if (String(event.target).indexOf('stats.php') > -1) {
                    var userid = String(event.target).substr(String(event.target).indexOf('=') + 1, 7);
                    if (self.statsLoadedId == userid) {
                        self.statsLoadedId = 0;
                        return;
                    }
                    self.statsLoadedId = userid;

                    getLux('&a=getstats&userid=' + userid, self.showUserInfo.bind(self));
                }
            });
        }
    }
});