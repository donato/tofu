
    //Attack Logs
Page.attacklog = {
    run : function() {
        //send entire attacklog to lux
        var defendedRows = $("td.content > table.attacklog > tbody > tr");
        this.attackLogHelper(defendedRows,0);
        
        var attackRows = $("td.content > p > table.attacklog > tbody > tr");
        this.attackLogHelper(attackRows, -1);
    }
    
    , processAttackLogDetail : function() {
        var gold_stolen, attack_id;

        //send specific attack to Lux
        var attackReport = $("td.report:first").text();
            
        if (attackReport.indexOf('counter-attack') == -1) {
            //TODO:: Write
            //processDefendLog();
            return;
        }
        
        var your_damage = textBetween(attackReport, 'Your troops inflict',' damage on the enemy!');
        var enemy_damage = textBetween(attackReport, 'counter-attack and inflict ', ' damage on your army!');
        var enemy_name = attackReport.match(/As (.*)'s army runs from the/);
            enemy_name = enemy_name[1];
        var your_losses = textBetween(attackReport, 'Your army sustains ', ' casualties');

        var enemy_losses = textBetween(attackReport, 'The enemy sustains ', ' casualties');

        var enemy_id = $("form > input [name='id']").val();
        enemy_id = textBetween(attackReport, 'name="id" value="', '"');
        enemy_id = $("input[name='id']").val();
        
        if (attackReport.indexOf('You stole') == -1)
            gold_stolen = 'defended';
        else
            gold_stolen = textBetween(attackReport, 'You stole ', ' gold');
        
        if (document.URL.indexOf('&') == -1)
            attack_id = document.URL.substring(document.URL.indexOf('attack_id=')+10);
        else
            attack_id = document.URL.substring(document.URL.indexOf('attack_id=')+10,document.URL.indexOf('&'));

        sendAttackLogDetails(User.kocnick, "attack", enemy_id, enemy_name, your_damage, enemy_damage, your_losses, enemy_losses, gold_stolen, attack_id, 'now');
    }

    , attackLogHelper: function (rows, shift ) {
        // TODO: TEST THIS
        function betweenTags (x) {
            x[i] = textBetween(x[i], ">","<");
        }
        
        for (var i = 2; i < rows.size()-1; i++) {
            var rawData = rows.eq(i).html().split("<td");
            //alert(rawData[3]);
            //this removes the junk to get value (ie. align="right">2</td> becomes 2)
            var enemy_id;
            var enemy;
            if (rawData[3].indexOf("not active") == -1) {
                enemy_id = rawData[3].match(/id=(\d*)"/)[1];
                enemy = rawData[3].match(/\d">(.+)<\/a>/)[1];
            } else {
                enemy_id = "";
                enemy = rawData[3].match(/">(.+)\(not active/)[1];
            }
            var logid = rawData[5+shift].match(/id=(\d*)"/)[1];
            var goldTemp = rawData[5+shift].match(/">([\d,]*) Gold/);
            var gold;
            if (goldTemp== null)
                gold = "defended";
            else 
                gold=goldTemp[1];

            _.map(rawData, betweenTags );
            var time = rawData[1];
            var timeunit = rawData[2];
            var type = rawData[4];
            var enemy_losses = rawData[6+shift];
            var your_losses = rawData[7+shift];
            var enemy_damage = rawData[8+shift];
            var your_damage = rawData[9+shift];
                
            //alert(your_damage);
            
            time = timeToSeconds(time,timeunit);
            if(!enemy_id)
                enemy_id=":invalid";//DONATO, Check this before release

            if(type.indexOf("attack")!=-1 || type.indexOf("raid")!=-1)    //this seems contradictory but it makes sense
                type="defend";
            else
                type="attack";
                
            //alert('time: ' + time + ' :: enemy: ' + enemy + ' :: gold: ' + gold + ' :: enemy_losses: ' + enemy_losses + ' :: your_losses: ' + your_losses + ' ::  enemy_damage: ' + enemy_damage + ' :: your_damage: ' + your_damage + ' :: logid: ' + logid);
            sendAttackLogDetails(User.kocnick, type, enemy_id, enemy, your_damage, enemy_damage, your_losses, enemy_losses, gold, logid, time);
        }
    }


    , sendAttackLogDetails : function(user, type, oppid, opponent, user_damages, opponent_damages, user_losses, opponent_losses, gold_stolen, logid, time) {
        getLux( '&a=logattack&type=' + type + '&user=' + user + 
            '&enemy=' + opponent + ';' + oppid + ';' + opponent_damages + ';' + opponent_losses +
            '&data=' + user_damages + ';' + user_losses + 
            '&gold=' + gold_stolen +
            '&time=' + time +
            '&logid=' + logid,
            function(responseDetails) {
        
        });
    }    
    
    , showBattleLog : function() {
        var i;
        var a = db.get('battlelog', 0);
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
    }
 
    , processSabLog : function() {
        var sabtext = $("td.content").text();
        if (sabtext.indexOf('Your spies successfully enter') == -1) {
          //turned illegal
          //  history.back();
            return;
        }
        
        var player = sabtext.between("successfully enter ", "'s armory");
        var amount = sabtext.between("and destroy ", " of the enemy's");
        var weapon = sabtext.between("of the enemy's ", " stockpile.");
        var logid = String(document.location).substr(String(document.location).indexOf('=')+1);
        getLux('&a=logsab&target=' + player + '&weapon=' + weapon + '&amount=' + amount + '&logid=' + logid,
            function(responseDetails) {
                //log(responseDetails.responseText);
            });
    }
    
    , processIntelLog : function()  {
        //proccess recons and sabotages

        var text = $("td.content").text()
        
        //notice for sabotages it says "your spies" for recon "your spy"
        if (text.indexOf('Your spy') == -1) {
            processSabLog();
            return;
        }

        if (text.indexOf('As he gets closer, one of the sentries spots him and sounds the alarm.') != -1) {
            //now illegal
            //history.back();
            return;
        }

        
        var enemy = text.between("your spy sneaks into ","'s camp");
        var enemyid = $("input[name='id']").val()
        var logid = String(document.location).substr(String(document.location).indexOf('=')+1);
        
        var rowsToGrab = ["Mercenaries", "Soldiers",
                        "Strike Action", "Defensive Action", "Spy Rating", "Sentry Rating",
                        "Covert Skill", "Covert Operatives", "Siege Technology", "Attack Turns",
                        "Unit Production"]
                        
        var data = []
        _.map(rowsToGrab, function (str) {
            var temp = getRowValues(str);
            data = data.concat(temp)
        });
        data = data.join(";")

        var stable = $("table:contains('Treasury')").last();
        var gold = to_int($(stable).find("tr>td").text());
        
        
        stable = $("table:contains('Weapons')").last();
        var weap_rows = $(stable).find("tbody>tr>td").parent();
        var weapons = "";
        $(weap_rows).each(function(i,e) {
            var r = $(e).text().split("\n");
            var g = r[1].trim()+":"+r[2].trim()+":"+r[3].trim()+":"+r[4].trim();
            weapons += g +";";
        });        
        logRecon(enemy, enemyid, logid, gold, data, weapons)
    }
}
