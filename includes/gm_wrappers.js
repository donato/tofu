    // GM Wrappers
    function log(s)     { GM_log(s); console.log(s);   }
    function openTab(t) { GM_openInTab(t); }
    function gmSetValue(t, t2) { GM_setValue(t, "" + t2 + ""); } // Convert to string for allowing storage of large ints
    function gmGetValue(t) { GM_getValue(t); }
    function gmDeleteValue(t) { GM_deleteValue(t); }
    function gmGetResourceText(t) { return GM_getResourceText(t); }
    function gmGetResourceURL(t) { return GM_getResourceURL(t); }
    function gmAddStyle(t) { GM_addStyle(t); }


    function get(address, callback) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: address,
            headers: {
                'User-agent': 'Mozilla/4.0 (compatible)',
                'Accept': 'application/atom+xml,application/xml,text/xml'
            },
            onload: function(r) {
                if (callback)
                    callback(r);
            }
        });        
    }
    
    function getLux(url, callback) {
        var address= baseURL+'&username='+User.kocnick+'&password=' + User.forumPass +'&auth=' + User.auth + url;
        
        log("Get URL: " +address);
        get(address,callback);
    }  
    
    function post(address, data, callback) {
        GM_xmlhttpRequest({
            method: "POST",
            url: address,
            headers:{'Content-type':'application/x-www-form-urlencoded'},
            data: encodeURI(data),
            onload: function(r) {
                if (callback)
                    callback();
            }
        });
    }
    function postLux(url, data, callback) {
        var address = baseURL+'&username='+User.kocnick+'&password=' + User.forumPass +'&auth=' + User.auth + url;
        
        log("Post URL: "+ address);
        post(address, data, callback);
    }
