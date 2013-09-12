define(['jQuery', 'underscore'], function($, _) {
		
    var Page = {
		// This gets extended with each page.
        getCurrentPage:function() {
            return document.URL.substring(document.URL.indexOf('.com')+5, document.URL.indexOf('.php'));
        }
        
        , getPlayerGold :function() {
            var gold = textBetween(document.body.innerHTML, 'Gold:<font color="#250202">', '<');

            if (gold !== '') {
                gold = gold.replace('B', '000000000');
                gold = gold.replace('M', '000000');
                gold = gold.replace('K', '000');
                gold = to_int(gold);
            }
            return (gold || 0);
        }
    }

    function timeToSeconds (time, timeunit) {
        if (timeunit.match('minute'))    { time = time * 60; } 
        else if (timeunit.match('hour')) { time = time * 60*60; } 
        else if (timeunit.match('day'))  { time = time * 60*60*24; }
        else if (timeunit.match('week')) { time = time * 60*60*24*7; }
        return time;
    }
    
    function timeElapsed(time) {
		var d = new Date()
		var ds =  d.getTime();
		var timespan = Math.floor((ds - time) / 1000)
		time = "";
		if ((timespan > 1209600) && (time === "")) time = Math.floor(timespan / 604800) + ' weeks ago';
		if ((timespan > 604800) && (time === "")) time = '1 week ago';
		if ((timespan > 172800) && (time === "")) time = Math.floor(timespan / 86400) + ' days ago';
		if ((timespan > 86400) && (time === "")) time = '1 day ago';
		if ((timespan > 7200) && (time === "")) time = Math.floor(timespan / 3600) + ' hours ago';
		if ((timespan > 3600) && (time === "")) time = '1 hour ago';
		if ((timespan > 120) && (time === "")) time = Math.floor(timespan / 60) + ' minutes ago';
		if ((timespan > 60) && (time === "")) time = '1 minute ago';
		if ((timespan > 1) && (time === "")) time = timespan + ' seconds ago';    
		if (time === "") time = '1 second ago';        
        return time;
    }

    function getTableByHeading(heading) {
        var $table = $("table.table_lines > tbody > tr > th:contains('"+heading+"')");
		
		return $table.last().parents().eq(2);
    }

    function getRowValues(searchText) {
        var $cells = $("tr:contains('"+searchText+"'):last > td")
        
        var vals = []
        $.each($cells, function (index, val) {
            if (index === 0) return
            vals.push($(val).text().trim())
        });
        
        return vals
    }

	function raceBonus(stat, race) {
		race = race || db.get('race');
		
		switch(stat) {
			case 'income' : 
				if (race =='humans') { return 1.3; }
				if (race =='dwarves') { return 1.15; }
				break;
			case 'sa' : 
				if (race =='orcs') { return 1.35; }
				break;
			case 'da' : 
				if (race =='orcs') { return 1.2; }
				if (race =='dwarves') { return 1.4; }
				break;
			case 'spy' : 
				if (race =='humans') { return 1.35; }
				if (race =='elves') { return 1.45; }
				break;
			case 'sentry' : 
				if (race =='undead') { return 1.35; }
				break;
		}
		return 1;
	}

	function fortBonus(fort) {
		fort = fort || db.get('fort');
		
		var cb = _.find(Constants.sieges);
		cb = Math.pow(1.25,cb);
		cb = Math.round(cb*1000)/1000;
		return cb;
	}

	function siegeBonus(siege){
		siege = siege || db.get('siege');

		var cb = _.find(Constants.sieges);
		cb = Math.pow(1.3,cb);
		cb = Math.round(cb*1000)/1000;
		return cb;
	}
	
	function covertBonus(level) {
		level = level || db.getInt('covertlevel',0);
		
		return Math.pow(1.6, level);
	}
	
	function upgradeBonus(type, option) {
		switch (type) {
			case 'sa':
				return siegeBonus(option);
			case 'da':
				return fortBonus(option);
			case 'spy':
			case 'sentry':
				return covertBonus(option);
		}
		return 1;
	}
			
});