
    //Attack Logs
Page.attacklog = {
    run : function() {
        //send entire attacklog to lux
        var defendedRows = $("td.content > table.attacklog > tbody > tr");
        this.attackLogHelper(defendedRows,0);
        
        var $attackRows = $("td.content > p > table.attacklog > tbody > tr");
        this.attackLogHelper($attackRows, -1);
    }
    

    , attackLogHelper: function ($rows, shift ) {
        function betweenTags (x) {
			return textBetween(x, ">","<");
        }
        
        for (var i = 2; i < $rows.size()-1; i++) {
			var gold, enemy_id, enemy;
            var rawData = $rows.eq(i).html().split("<td");

            if (rawData[3].indexOf("(not active)") === -1) {
                enemy_id = rawData[3].match(/id=(\d*)"/)[1];
                enemy = rawData[3].match(/\d">(.+)<\/a>/)[1];
            } else {
                enemy_id = "";
                enemy = rawData[3].match(/">(.+)\(not active/)[1];
            }
            var logid = rawData[5+shift].match(/id=(\d*)"/)[1];
            var goldTemp = rawData[5+shift].match(/">([\d,]*) Gold/);
            if (goldTemp === null)
                gold = "defended";
            else 
                gold = goldTemp[1].int();

			// For specific indexes, grab data between > and <
            rawData = _.map(rawData, betweenTags );
            var time = rawData[1];
            var timeunit = rawData[2];
            var type = rawData[4];
            var enemy_losses = rawData[6+shift].int();
            var your_losses = rawData[7+shift].int();
            var enemy_damage = rawData[8+shift].int();
            var your_damage = rawData[9+shift].int();
                            
            time = timeToSeconds(time,timeunit);
            if(!enemy_id) {
                enemy_id=":invalid";//DONATO, Check this before release
			}
			
		    // If it is an attack/raid on you, then you were Defending
            if(type.indexOf("attack") != -1 || type.indexOf("raid")!=-1) 
                type="defend";
            else
                type="attack";
                
            log('type: ' + type +' :: time: ' + time + ' :: enemy: ' + enemy + '('+enemy_id+') :: gold: ' + gold + ' :: enemy_losses: ' + enemy_losses + ' :: your_losses: ' + your_losses + ' ::  enemy_damage: ' + enemy_damage + ' :: your_damage: ' + your_damage + ' :: logid: ' + logid);
            sendAttackLogDetails(User.kocnick, type, enemy_id,  enemy, your_damage, enemy_damage, your_losses, enemy_losses, gold, logid, time);

        }
    }

 }
