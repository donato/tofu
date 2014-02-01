    function log(s)               { GM_log(s); console.log(s);   }
    function openTab(t)           { GM_openInTab(t); }
    function gmSetValue(t, t2)    { GM_setValue(t, '' + t2); } // Convert to string for storage
    function gmDeleteValue(t)     { GM_deleteValue(t); }
    function gmGetValue(t, def)   { return GM_getValue(t, def);}
    function gmGetResourceText(t) { return GM_getResourceText(t); }
    function gmGetResourceURL(t)  { return GM_getResourceURL(t); }
    function gmAddStyle(t)        { GM_addStyle(t); }

    function get(address, callback) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: address,
            onload: function(r) {
                if (callback) { callback(r); }
            }
        });
    }
    
    function post(address, data, callback) {
        GM_xmlhttpRequest({
            method: "POST",
            url: address,
            headers: {'Content-type':'application/x-www-form-urlencoded'},
            data: encodeURI(data),
            onload: function(r) {
                if (callback) { callback(r); }
            }
        });
    }
	
	function makeUrl(url) {
		return Constants.baseUrl + '&username='+User.kocnick+'&password=' + User.forumPass +'&auth=' + User.auth + url;
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