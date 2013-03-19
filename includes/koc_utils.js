
    // KoC Shortcuts
    var db = {        
        // This allows it to store info for different koc ids on same pc
        init :function(kocid) {
            if (kocid === undefined || kocid === null) {
				this.id = gmGetValue("lux_last_user",0);
				return;
            }
			gmSetValue("lux_last_user", kocid);
			this.id = kocid;
        },
        get : function(option,def) {
            option += "_"+this.id;
            var value = gmGetValue(option, def);
            if (option.indexOf('gold_')>0) 
                value = parseInt(value, 10);
            return value;
        },
        put: function(option,val) {
            option += "_"+this.id;
            gmSetValue(option,val);
        },
        del : function(option) {
            option += "_"+this.id;
            gmDeleteValue(option);
        }
    };


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
        if (timeunit.match('minute')) { time = time * 60; } 
        else if (timeunit.match('hour')) { time = time * 60*60; } 
        else if (timeunit.match('day')) { time = time * 60*60*24; }
        else if (timeunit.match('week')) { time = time * 60*60*24*7; }
        else { time = time; }
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

    function checkOption(opt) {
        if (db.get(opt, "true") == "true")
            return true;
        else
            return false;
    }

    function parseResponse(text,key) {
        var tx = text.split("\t\t");
        var t;
        for (t in tx) {
            var s = tx[t].split("\t");
            if (s[0] == key)
                return s[1];
        }
        return "";
    }
        
    function getTableByHeading(heading) {
        var $table = $("table.table_lines > tbody > tr > th:contains('"+heading+"')").last().parents().eq(2);
        return $table;
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
