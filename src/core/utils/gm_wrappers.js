var is_greasemonkey_enabled = false;
try {
    GM_getResourceText('abc');
    is_greasemonkey_enabled = true;
} catch(e) {}

let log, openTab, gmSetValue, gmDeleteValue, gmGetValue, gmGetResourceText, gmGetResourceURL;
let get, post;
if(is_greasemonkey_enabled) {
    log = function(s) {
        GM_log(s);
    };
    openTab = function(t) {
        GM_openInTab(t);
    };
    gmSetValue = function(t, t2) {
        // log('storing ' + t + ' ' + t2);
        GM_setValue(t, t2);
    };
    gmDeleteValue = function(t) {
        GM_deleteValue(t);
    };
    gmGetValue = function(t, def) {
        return GM_getValue(t, def);
    };
    gmGetResourceText = function(t) {
        return GM_getResourceText(t);
    };
    gmGetResourceURL = function(t) {
        return GM_getResourceURL(t);
    };
    get = function(address, callback) {
        log('loading: ' + address);
        GM_xmlhttpRequest({
            method: 'GET',
            url: address,
            onload: function(r) {
                log(arguments);
                if(callback) {
                    callback(r);
                }
            }
        });
    };

    post = function(address, data, callback) {
        GM_xmlhttpRequest({
            method: "POST",
            url: address,
            headers: {
                'Content-type': 'application/x-www-form-urlencoded'
            },
            data: encodeURI(data),
            onload: function(r) {
                if(callback) {
                    callback(r);
                }
            }
        });
    };
} else {
    log = console.log;
    openTab = function(t) {
        window.open(t, '_blank');
    };
    gmSetValue = function(t, t2) {
        localStorage.setItem(t, t2);
    };
    gmDeleteValue = function(t) {
        localStorage.removeItem(t);
    };
    gmGetValue = function(t, def) {
        var item = localStorage.getItem(t);
        if(item === null) {
            return def;
        }
        return item;
    };
    gmGetResourceText = function(t) {
        return "";
    }; // GM_getResourceText(t); };
    gmGetResourceURL = function(t) {
        return "";
    }; // GM_getResourceURL(t); };
    get = function(url, callback) {
        $.get(url, function(text) {
            // Add nesting to avoid breaking compatibility with GM
            callback({
                responseText: text
            });
        });
    };
    post = function(url, data, callback) {
        $.post(url, data, function(text) {
            // Add nesting to avoid breaking compatibility with GM
            callback({
                responseText: text
            });
        });
    };
}

function addStyle(text) {
    const s = document.createElement('style');
    s.innerHTML = text;
    document.head.appendChild(s);
};


function makeUrl(url) {
    // TODO : Use constants
    return 'http://fearlessforce.net/bot/luxbot.php?tofu=1&' + 'username=' + User.kocnick + '&password=' + User.forumPass + '&auth=' + User.auth + url;
}

const MemoizedFetches = new Map();
function getLux(url, callback) {
    var address = makeUrl(url);
    //get(address, callback);
    if (MemoizedFetches.has(address)) {
      MemoizedFetches.get(address).then(callback);
      return;
    }
    const promise = new Promise(resolve => {
      get(address, (response) => {
        resolve(response);
      });
    });
    MemoizedFetches.set(address, promise);
    promise.then(callback);
}

function postLux(url, data, callback) {
    post(makeUrl(url), data, callback);
}

function postLuxJson(url, data, callback) {
    postLux(url, '&json=' + JSON.stringify(data), callback);
}

// TODO(): Don't use globals, just include this file instead
window.getLux = getLux;
window.postLux = postLux;
window.log = log;
window.openTab = openTab;

module.exports = {
    getLux, postLuxJson, makeUrl, addStyle, log, openTab, gmSetValue, gmDeleteValue, gmGetValue, gmGetResourceText, gmGetResourceURL, get, post
};