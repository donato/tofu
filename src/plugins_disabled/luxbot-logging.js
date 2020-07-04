define(['jquery', 'underscore'], function($,_) {
    function logBase(stats, data, officers) {
        //stats=sa;da;spy;sentry;
        //details=fort;siege;econ;tech;conscription;turns;covertlevel;bonus
        //a=base&stats=1599739;7354;1244639;9023&data=Rabid Pitbulls;War Elephants;None;Salt (x 1.89);160;7008;12;1&officers=
        //a=base&stats=1599739;7354;1244639;9023&data=Rabid Pitbulls;War Elephants;None;189          ;160;7009;12;1&officers=
                            
        getLux('&a=base2' +
                '&stats=' + stats + 
                '&data=' + data +
                '&officers=' + officers,
            function(responseDetails) {
                    log("LogBase: "+ responseDetails.responseText);
        });
    }

    function sendLogDetails(user, opponent, oppid, siege, data, weaponstring,officers, logid) {
        getLux('&a=logspy&user=' + user + 
                                '&enemy=' + opponent + ';' + oppid + ';' + siege +
                                '&data=' + data + 
                                '&weapons=' + weaponstring +
                                '&officers=' + officers +
                                '&logid=' + logid,
                    function(responseDetails) {
                            log("SendLogDetails Response: "+ responseDetails.responseText);
                            // alert(responseDetails.responseText);
                    });
    }

	function sendAttackLogDetails(user, type, oppid, opponent, user_damages, opponent_damages, user_losses, opponent_losses, gold_stolen, logid, time) {
    getLux( '&a=logattack&type=' + type + 
        '&enemy=' + opponent + ';' + oppid + ';' + opponent_damages + ';' + opponent_losses +
        '&data=' + user_damages + ';' + user_losses + 
        '&gold=' + gold_stolen +
        '&time=' + time +
        '&logid=' + logid,
      function(responseDetails) {});
  }

    function logRecon(enemy, enemyid, logid, gold, data, weapons) {
      getLux('&a=logRecon' + 
          '&enemy=' + enemy + 
          '&enemyid=' + enemyid +
          '&logid=' + logid +
          '&gold=' + gold +
          '&data=' + data + 
          '&weapons=' + weapons,
        function(responseDetails) {
          log("logRecon Response: "+ responseDetails.responseText);
        });
    }    

    function sendConquestDetails(contype) {
        getLux('a=logcon&contype=' + contype);
    }

    function logArmory(weapons) {
      //name:qty:repair;
      var arrWeapons = Object.values(weapons);
      var data = arrWeapons.map(weapon => [weapon.name, weapon.quantity, weapon.strength].join(":")).join(';');
      postLux('&a=armory', '&data=' + data);
    }

    function logStats(nick, kocid, chain, palliance, alliances, data, officers) {
        //data = comid;race;rank;highest_rank;tff;morale;fortifications;treasury
        getLux('&a=stats' +
                            '&nick=' + nick +
                            '&kocid=' + kocid +
                            '&chain='+chain+
                            '&palliance=' + palliance + 
                            '&alliances=' + alliances + 
                            '&data=' + data +
                            '&officers=' + officers,
                function(responseDetails) {
                        log("LogStats: "+ responseDetails.responseText);
                        // alert(responseDetails.responseText);
                });
    }

	return {
    logArmory,
		logBase,
		sendLogDetails,
		sendAttackLogDetails,
		logRecon,
		sendConquestDetails,
		logStats
	}
});