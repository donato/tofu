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
        // Time in javascript is always unixtime
        getTime: function(option) {
            var ret = this.get(option, Date.now());
            return parseInt(ret);
        },
        putTime: function(option, val) {
            this.put(option, val);
        },
        putObject: function(option, val) {
            this.put(option, JSON.stringify(val));
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

          if (gold !== '') {
              gold = gold.replace('B', '000000000');
              gold = gold.replace('M', '000000');
              gold = gold.replace('K', '000');
              gold = to_int(gold);
          }
          return(gold || 0);
      },
  
      getPlayerSafe: function() {
        return to_int(textBetween(document.body.innerHTML, 'Safe:</a>', '</').replace(/<\/?[^>]+(>|$)/g, ""));
      },

      getPlayerExperience: function() {
        return to_int(textBetween(document.body.innerHTML, 'Experience:</td>', '</td').replace(/"/g, '').replace(/<\/?[^>]+(>|$)/g, ""));
      },

      getPlayerTurns: function() {
        return to_int(textBetween(document.body.innerHTML, 'Turns:</td>', '</td').replace(/"/g, '').replace(/<\/?[^>]+(>|$)/g, ""));
      },
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
        var d = new Date();
        var ds = d.getTime();
        return millisecondsToEnglish(ds - time) + " ago";
    }

    function timeConfidenceFormatter(ms) {
        var timespan = Math.floor(ms / 1000);
        if(timespan > 604800) return Math.floor(timespan / 604800) + 'w';
        if(timespan > 86400) return Math.floor(timespan / 86400) + 'd';
        if(timespan > 3600) return Math.floor(timespan / 3600) + 'h';
        if(timespan > 60) return Math.floor(timespan / 60) + 'm';
        if(timespan > 1) return timespan + 's';
        return '';
    }
    
    function millisecondsToEnglish(ms) {
        var timespan = Math.floor(ms / 1000);
        if(timespan > 1209600) return Math.floor(timespan / 604800) + ' weeks';
        if(timespan > 604800) return '1 week';
        if(timespan > 172800) return Math.floor(timespan / 86400) + ' days';
        if(timespan > 86400) return '1 day';
        if(timespan > 7200) return Math.floor(timespan / 3600) + ' hours';
        if(timespan > 3600) return '1 hour';
        if(timespan > 120) return Math.floor(timespan / 60) + ' minutes';
        if(timespan > 60) return '1 minute';
        if(timespan > 1) return timespan + ' seconds';
        return '1 second';
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

    /**
     * Useful when a table has a series of key value pairs, for example:
     *   | Strike Action | 1,000 |
     * @param {!jQuery<Table>} $table
     * @param {number} keyColumn
     * @param {number} valColumn
     * @return {{string:string}}
     */
    function parseTableColumnToDict($table, key, val) {
        var dict = {
          'element': {}
        };
        $table.find('tr').each(function(idx, row) {
            var $row = $(row);
            var $td = $row.find('td');
            dict[$td.eq(key).text().trim()] = $td.eq(val).text().trim();
            dict['element'][$td.eq(key).text().trim()] = $td.eq(val);
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
        if(_.includes(Constants.saWeaps, weaponName)) {
            return 'sa';
        }
        if(_.includes(Constants.daWeaps, weaponName)) {
            return 'da';
        }
        if(_.includes(Constants.spyWeaps, weaponName)) {
            return 'spy';
        }
        if(_.includes(Constants.sentryWeaps, weaponName)) {
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

  function parseKocIdFromLink($link) {
    if (!$link.is('a')) {
      $link = $link.find('a');
    }
    const href = $link.attr('href');
    if (!href || href.indexOf('id=') == -1) {
      return null;
    }
    return href.split('id=')[1]
  }

  function parseLogIdFromLink($link) {
    if (!$link.is('a')) {
      $link = $link.find('a');
    }
    const href = $link.attr('href');
    if (!href || href.indexOf('id=') == -1) {
      return null;
    }
    return href.split('id=')[1]
  }

    return {
        db: db,
        Page : Page,
        parseKocIdFromLink,
        parseLogIdFromLink,
        timeConfidenceFormatter: timeConfidenceFormatter,
        timeToSeconds,
        timeElapsed: timeElapsed,
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