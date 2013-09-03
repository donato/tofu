define(['jQuery', 'underscore'], function($, _) {
	return {
		
    run: function() {
        this.processIntelLog();
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
            this.processSabLog();
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

}});