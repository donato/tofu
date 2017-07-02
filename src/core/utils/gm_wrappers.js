var is_greasemonkey_enabled = false;
try {
    GM_getResourceText('abc');
    is_greasemonkey_enabled = true;
} catch(e) { }

if (is_greasemonkey_enabled) {
    var log = function (s)               { GM_log(s); };
    var openTab = function (t)           { GM_openInTab(t); };
    var gmSetValue = function(t, t2)    {
        // log('storing ' + t + ' ' + t2);
        GM_setValue(t, t2);
    };
    var gmDeleteValue = function(t)     { GM_deleteValue(t); };
    var gmGetValue = function(t, def)   { return GM_getValue(t, def);};
    var gmGetResourceText = function(t) { return GM_getResourceText(t); };
    var gmGetResourceURL = function(t)  { return GM_getResourceURL(t); };
    var get = function (address, callback) {
        log('loading: ' + address);
         GM_xmlhttpRequest({
            method: 'GET',
            url: address,
            onload: function(r) {
                log(arguments);
                if (callback) { callback(r); }
            }
        });
    };

    var post = function(address, data, callback) {
        GM_xmlhttpRequest({
            method: "POST",
            url: address,
            headers: {'Content-type':'application/x-www-form-urlencoded'},
            data: encodeURI(data),
            onload: function(r) {
                if (callback) { callback(r); }
            }
        });
    };
} else {
    log = console.log;
    openTab = function(t) { window.open(t, '_blank'); };
    gmSetValue = function(t, t2) {
        localStorage.setItem(t, t2);
    };
    gmDeleteValue = function(t) { localStorage.removeItem(t); };
    gmGetValue = function(t, def) {
        var item = localStorage.getItem(t);
        if (item === null) {
            return def;
        }
        return item;
    };
    gmGetResourceText = function(t) { return ""; }; // GM_getResourceText(t); };
    gmGetResourceURL = function(t) { return ""; }; // GM_getResourceURL(t); };
    get = function(url, callback) {
        $.get(url, function(text) {
            // Add nesting to avoid breaking compatibility with GM
            callback({responseText: text});
        });
    };
    post = function(url, data, callback) {
        $.post(url, data, function(text) {
            // Add nesting to avoid breaking compatibility with GM
            callback({responseText: text});
        });
    };
}

gmAddStyle = function(text) {
    $('head').append('<style>' + text + '</style>');
};

	
	function makeUrl(url) {
        // TODO : Use constants
		return '//donatoborrello.com/bot/luxbot.php?'+ 'user='+User.kocnick+'&username='+User.kocnick+'&password=' + User.forumPass +'&auth=' + User.auth + url;
	}
	
	function getLux(url, callback) {
        var address = makeUrl(url);
        get(address, callback);
    }

    function postLux(url, data, callback) {
        post( makeUrl(url), data, callback );
    }

    function postLuxJson(url, data, callback) {
		postLux( url, '&json='+JSON.stringify(data), callback );
    }
