
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
        // TODO: TEST THIS
        function betweenTags (x) {
		//eg broken..
			var text = '<' + x.html();
            var y = textBetween($(text).text(), ">","<");
			log (x + ".." + y);
			x = y;
			return y;
        }
        
		
        for (var i = 2; i < $rows.size()-1; i++) {
			
            var rawData = $rows.eq(i).html().split("<td");
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

            rawData = _.map(rawData, betweenTags );
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

 }
