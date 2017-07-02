define([
    'utils/koc_utils',
    'plugins/luxbot-logging',
    'jquery',
    'underscore'
], function(Koc, Log, $, _) {
	return {
		
    run: function() {
        this.showBattleLog();
        // Gold Update on attacks 
        this.processAttackLogDetail();
    },

    
    showBattleLog : function() {
        var i;
        var a = Koc.db.get('battlelog', 0);
        if (a === 0) {
            return;
        } else if (a === 2 || a === 1) {
            var table;
            var q = document.getElementsByTagName('td');
            for (i = 0; i < q.length; i++) {
                if (q[i].className.indexOf('report') != -1) {
                    table = q[i];
                    break;
                }
            }
            
            for (i = 0; i < table.childNodes.length; i++) {
                if (table.childNodes[i].nodeName != '#text') {
                    table.childNodes[i].style.display = 'block';
                }
            }
            
            document.getElementsByClassName('battle')[0].className += '2';
            
            var dummyTable = document.body.appendChild(document.createElement('table'));
            dummyTable.className = 'battle';
            dummyTable.style.display = 'none';
            dummyTable.style.height = document.body.scrollTop;
            window.addEventListener(
                'scroll',
                function () {
                  dummyTable.style.height = document.body.scrollTop;
                },
                false);
        } else if (a == 3) {
            if (document.URL.indexOf('suspense') != -1) {
                document.location = document.URL.substr(0, document.URL.indexOf('suspense'));
            }
        }
    },
	
    processAttackLogDetail : function() {
        var gold_stolen, attack_id;

        //send specific attack to Lux
        var attackReport = $("td.report:first").text();
            
        if (attackReport.indexOf('counter-attack') == -1) {
            //TODO:: Write
            //processDefendLog();
            return;
        }
        
        var your_damage = to_int(textBetween(attackReport, 'Your troops inflict',' damage on the enemy!'));
        var enemy_damage = to_int(textBetween(attackReport, 'counter-attack and inflict ', ' damage on your army!'));
        var enemy_name = attackReport.match(/As (.*)'s army runs from the/);
            enemy_name = enemy_name[1];
        var your_losses = to_int(textBetween(attackReport, 'Your army sustains ', ' casualties'));

        var enemy_losses = to_int(textBetween(attackReport, 'The enemy sustains ', ' casualties'));

        var enemy_id = $("form > input [name='id']").val();
        enemy_id = textBetween(attackReport, 'name="id" value="', '"');
        enemy_id = to_int($("input[name='id']").val());
        
        if (attackReport.indexOf('You stole') == -1)
            gold_stolen = 'defended';
        else
            gold_stolen = to_int(textBetween(attackReport, 'You stole ', ' gold'));
        
        if (document.URL.indexOf('&') == -1) {
            attack_id = to_int(document.URL.substring(document.URL.indexOf('attack_id=')+10));
        } else {
            attack_id = to_int(document.URL.substring(document.URL.indexOf('attack_id=') + 10, document.URL.indexOf('&')));
        }

        Log.sendAttackLogDetails(User.kocnick, "attack", enemy_id, enemy_name, your_damage, enemy_damage, your_losses, enemy_losses, gold_stolen, attack_id, 'now');
    }
}});