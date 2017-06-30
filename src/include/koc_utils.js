define([
    './constants',
    'jquery',
    'underscore'
], function(Constants, $, _) {

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
        getObject: function(option, def) {
            option += "_"+ this.id;
            return JSON.parse(gmGetValue(option, false)) || def;
        },
        put: function(option, val) {
            option += "_" + this.id;
            gmSetValue(option, val);
        },
        putObject: function(option, val) {
            option += "_"+ this.id;
            gmSetValue(option, JSON.stringify(val));
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
    };
	
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
        return $table.find('tr').find('td:eq(' + column + ')').map(function() {
            return to_int($(this).text());
        });
    }
    function parseTableColumnToDict($table, key, val) {
        var dict = {};
        $table.find('tr').each(function(idx, row) {
            var $row = $(row);
            var $td = $row.find('td');
            dict[$td.eq(key).text()] = $td.eq(val).text();
        });
        return dict;
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

    function covertBonus(level) {
        level = level || db.getInt('covertlevel', 0);

        return Math.pow(1.6, level);
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

    function getFort(i) {
        if (_.isNumber(i)) {
            return i;
        }
        return  _.indexOf(Constants.fortifications, i || db.get('fort'));
    }
    function getSiege(i) {
        if (_.isNumber(i)) {
            return i;
        }
        return  _.indexOf(Constants.sieges, i || db.get('siege'));
    }

    /**
     * Given an int or string name of a fort, return the bonus
     */
    function fortBonus(fort) {
        var cb = getFort(fort);
        cb = Math.pow(1.25, cb);
        cb = Math.round(cb*1000)/1000;
        return cb;
    }
    function siegeBonus(siege){
        var cb = getSiege(siege);
        cb = Math.pow(1.3, cb);
        cb = Math.round(cb*1000)/1000;
        return cb;
    }

	function covertBonus(level) {
		level = level || db.getInt('covertlevel', 0);

		return Math.pow(1.6, level);
	};

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

    return {
        db: db,
        Page : Page,
        checkOption: checkOption,
        parseResponse: parseResponse,
        getTableByHeading: getTableByHeading,
        setTableId: setTableId,
        parseTableColumn: parseTableColumn,
        parseTableColumnToDict: parseTableColumnToDict,
        raceBonus: raceBonus,
        upgradeBonus: upgradeBonus,
        getWeaponType: getWeaponType,
        getRowValues : getRowValues,
        getFort : getFort,
        getSiege: getSiege,
        fortBonus : fortBonus,
        siegeBonus : siegeBonus,
    };
});