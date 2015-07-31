define(['jquery', 'underscore'], function($, _) {

    var db = {
        // This allows it to store info for different koc ids on same pc
        init: function(kocid) {
            if(kocid === undefined || kocid === null) {
                this.id = gmGetValue("lux_last_user", 0);
                return;
            }
            gmSetValue("lux_last_user", kocid);
            this.id = kocid;
        },
        get: function(option, def) {
            option += "_" + this.id;
            var value = gmGetValue(option, def);
            if(option.indexOf('gold_') > 0) value = parseInt(value, 10);
            return value;
        },
        getInt: function(option, def) {
            var ret = this.get(option, def);
            return parseInt(ret, 10);
        },
        getFloat: function(option, def) {
            var ret = this.get(option, def);
            return parseFloat(ret, 10);
        },
        put: function(option, val) {
            option += "_" + this.id;
            gmSetValue(option, val);
        },
        del: function(option) {
            option += "_" + this.id;
            gmDeleteValue(option);
        }
    };


    Page = {
        // This gets extended with each page.
        getCurrentPage: function() {
            return document.URL.substring(document.URL.indexOf('.com') + 5, document.URL.indexOf('.php'));
        },
		
        getPlayerGold: function() {
            var gold = textBetween(document.body.innerHTML, 'Gold:<font color="#250202">', '<');

            if(gold !== '') {
                gold = gold.replace('B', '000000000');
                gold = gold.replace('M', '000000');
                gold = gold.replace('K', '000');
                gold = to_int(gold);
            }
            return(gold || 0);
        }
    }
	
    function timeToSeconds(time, timeunit) {
        if(timeunit.match('minute')) {
            time = time * 60;
        } else if(timeunit.match('hour')) {
            time = time * 60 * 60;
        } else if(timeunit.match('day')) {
            time = time * 60 * 60 * 24;
        } else if(timeunit.match('week')) {
            time = time * 60 * 60 * 24 * 7;
        } else {
            time = time;
        }
        return time;
    }

    function timeElapsed(time) {
        var d = new Date()
        var ds = d.getTime();
        var timespan = Math.floor((ds - time) / 1000)
        time = "";
        if((timespan > 1209600) && (time === "")) time = Math.floor(timespan / 604800) + ' weeks ago';
        if((timespan > 604800) && (time === "")) time = '1 week ago';
        if((timespan > 172800) && (time === "")) time = Math.floor(timespan / 86400) + ' days ago';
        if((timespan > 86400) && (time === "")) time = '1 day ago';
        if((timespan > 7200) && (time === "")) time = Math.floor(timespan / 3600) + ' hours ago';
        if((timespan > 3600) && (time === "")) time = '1 hour ago';
        if((timespan > 120) && (time === "")) time = Math.floor(timespan / 60) + ' minutes ago';
        if((timespan > 60) && (time === "")) time = '1 minute ago';
        if((timespan > 1) && (time === "")) time = timespan + ' seconds ago';
        if(time === "") time = '1 second ago';
        return time;
    }

    function checkOption(opt) {
        if(db.get(opt, "true") == "true") return true;
        else return false;
    }

    function parseResponse(text, key) {
        var tx = text.split("\t\t");
        var t;
        for(t in tx) {
            var s = tx[t].split("\t");
            if(s[0] == key) return s[1];
        }
        return "";
    }

    function getTableByHeading(heading) {
        var $table = $("table.table_lines > tbody > tr > th:contains('" + heading + "')");

        return $table.last().parents().eq(2);
    }

    // Since tables often don't have an id, we can make life easier by setting them.
    function setTableId(index, id) {
        return $('table.table_lines').eq(index).attr('id', id);
    }

    function parseTableColumn($table, column) {
        return $table.find('tr').find('td:eq(' + column + ')');
    }

    function getRowValues(searchText) {
        var $cells = $("tr:contains('" + searchText + "'):last > td");

        var vals = [];
        $.each($cells, function(index, val) {
            if(index === 0) return
            vals.push($(val).text().trim())
        });

        return vals;
    }

    function raceBonus(stat, race) {
        race = race || db.get('race');

        switch(stat) {
        case 'income':
            if(race == 'humans') {
                return 1.3;
            }
            if(race == 'dwarves') {
                return 1.15;
            }
            break;
        case 'sa':
            if(race == 'orcs') {
                return 1.35;
            }
            break;
        case 'da':
            if(race == 'orcs') {
                return 1.2;
            }
            if(race == 'dwarves') {
                return 1.4;
            }
            break;
        case 'spy':
            if(race == 'humans') {
                return 1.35;
            }
            if(race == 'elves') {
                return 1.45;
            }
            break;
        case 'sentry':
            if(race == 'undead') {
                return 1.35;
            }
            break;
        }
        return 1;
    }

    function getWeaponType(weaponName) {
        if(_.contains(Constants.saWeaps, weaponName)) {
            return 'sa';
        }
        if(_.contains(Constants.daWeaps, weaponName)) {
            return 'da';
        }
        if(_.contains(Constants.spyWeaps, weaponName)) {
            return 'spy';
        }
        if(_.contains(Constants.sentryWeaps, weaponName)) {
            return 'sentry';
        }
    }

    function fortBonus(fort) {
        fort = fort || db.get('fort');

        var cb = 0;
        if(fort == "Camp") cb = 0;
        if(fort == "Stockade") cb = 1;
        if(fort == "Rabid") cb = 2;
        if(fort == "Walled") cb = 3;
        if(fort == "Towers") cb = 4;
        if(fort == "Battlements") cb = 5;
        if(fort == "Portcullis") cb = 6;
        if(fort == "Boiling Oil") cb = 7;
        if(fort == "Trenches") cb = 8;
        if(fort == "Moat") cb = 9;
        if(fort == "Drawbridge") cb = 10;
        if(fort == "Fortress") cb = 11;
        if(fort == "Stronghold") cb = 12;
        if(fort == "Palace") cb = 13;
        if(fort == "Keep") cb = 14;
        if(fort == "Citadel") cb = 15;
        if(fort == "Hand of God") cb = 16;
        cb = Math.pow(1.25, cb);
        cb = Math.round(cb * 1000) / 1000;
        return cb;
    }

    function siegeBonus(siege) {
        siege = siege || db.get('siege');

        var cb = 0;
        if(siege == "None") cb = 0;
        if(siege == "Flaming Arrows") cb = 1;
        if(siege == "Ballistas") cb = 2;
        if(siege == "Battering Rams") cb = 3;
        if(siege == "Ladders") cb = 4;
        if(siege == "Trojan") cb = 5;
        if(siege == "Catapults") cb = 6;
        if(siege == "War Elephants") cb = 7;
        if(siege == "Siege Towers") cb = 8;
        if(siege == "Trebuchets") cb = 9;
        if(siege == "Black Powder") cb = 10;
        if(siege == "Sappers") cb = 11;
        if(siege == "Dynamite") cb = 12;
        if(siege == "Greek Fire") cb = 13;
        if(siege == "Cannons") cb = 14;
        cb = Math.pow(1.3, cb);
        cb = Math.round(cb * 1000) / 1000;
        return cb;
    }

    function covertBonus(level) {
        level = level || db.getInt('covertlevel', 0);

        return Math.pow(1.6, level);
    }

    function upgradeBonus(type, option) {
        switch(type) {
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