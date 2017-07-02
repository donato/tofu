define([
    'plugins/luxbot-logging',
    'utils/koc_utils',
    'jquery',
    'underscore'
], function (Logging, Koc, $, _) {
    
    return {

        //process recons and sabotages
        run: function () {
            var text = $("td.content").text();

            //notice for sabotages it says "your spies" for recon "your spy"
            if (text.indexOf('Your spy') == -1) {
                this.processSabotage(text);
            } else {
                this.processRecon(text);
            }
        },

        processRecon: function (text) {

            if (text.indexOf('As he gets closer, one of the sentries spots him and sounds the alarm.') != -1) {
                return;
            }


            var enemy = text.between("your spy sneaks into ", "'s camp");
            var enemyid = $("input[name='id']").val();
            var logid = String(document.location).substr(String(document.location).indexOf('=') + 1);
            var stable = $("table:contains('Treasury')").last();
            var gold = to_int($(stable).find("tr>td").text());

            // Order is important here when sending logs to the server
            var rowsToGrab = [
                ["Strike Action", 0],
                ["Defensive Action", 0],
                ["Spy Rating", 0],
                ["Sentry Rating", 0],
                ["Mercenaries", 0],
                ["Mercenaries", 1],
                ["Mercenaries", 2],
                ["Soldiers", 0],
                ["Soldiers", 1],
                ["Soldiers", 2],
                ["Covert Skill", 0],
                ["Covert Operatives", 0],
                ["Attack Turns", 0],
                ["Unit Production", 0]
            ];

            var data = _.map(rowsToGrab, function(tuple) {
                let [name, idx] = tuple;
                var val = Koc.getRowValues(name)[idx];
                return val.replace(/\?\?\?/g, '').replace(/,/g, '');
            });
            data = data.join(";") + ";" + gold;

            stable = $("table:contains('Weapons')").last();
            var weap_rows = $(stable).find("tbody>tr>td").parent();
            var weap_array = _.map(weap_rows, function(row) {
                let $row = $(row);
                var r = $row.text().split("\n");
                var g = r[1].trim() + ":" + r[2].trim() + ":" + r[3].trim() + ":" + r[4].trim();
                return g;
            });
            var weaponString = weap_array.join(';').replace(/\?\?\?/g, '').replace(/,/g, '');

            postLux('&a=logspy', '&enemy=' + enemy + ';' + enemyid + ';' + 
                '&data=' + data +
                '&weapons=' + weaponString +
                '&logid=' + logid);
            // TODO: Redo how logging occurs from server
            // Logging.logRecon(enemy, enemyid, logid, gold, data, weapons)
        },
        
        processSabotage: function (sabtext) {
            if (sabtext.indexOf('Your spies successfully enter') == -1) {
                //turned illegal
                //  history.back();
                return;
            }

            var player = sabtext.between("successfully enter ", "'s armory");
            var amount = sabtext.between("and destroy ", " of the enemy's");
            var weapon = sabtext.between("of the enemy's ", " stockpile.");
            var logid = String(document.location).substr(String(document.location).indexOf('=') + 1);
            getLux('&a=logsab&target=' + player + '&weapon=' + weapon + '&amount=' + amount + '&logid=' + logid);
        }

    }
});
