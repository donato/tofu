// ==UserScript==
// @name            ToFu Script
// @description     The next generation of Kingsofchaos enhancement
// @version         0.20121110
// @include         http://*kingsofchaos.com/*
// @exclude         http://*kingsofchaos.com/chat/*
// @require            http://cdnjs.cloudflare.com/ajax/libs/jquery/1.8.2/jquery.min.js
// @require            http://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.4.2/underscore-min.js
// @require			http://bot.luxbot.net/includes/highstock.js
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @grant       GM_xmlhttpRequest
// @grant       GM_openInTab
// @grant       GM_log
// @grant       GM_addStyle
// @grant       GM_getResourceText
// @grant       GM_getResourceURL
// @resource    sidebar_targets      http://www.luxbot.net/download/img/sidebar_targets.gif
// @resource    sidebar_sabargets    http://www.luxbot.net/download/img/sidebar_sabtargets.gif
// @resource    styles    http://www.luxbot.net/download/css/styles.css
// ==/UserScript==

// Info on GM resources : http://stackoverflow.com/questions/5250187/greasemonkey-image-not-showing

//
// For information on the development of this through the ages please visit: http://stats.luxbot.net/about.php
// 


!function($, document) {

    "use strict";
    
    //version is year, month, day OR yymmdd
	
 
    // GLOBALS - Remove ASAP
	var Plugins = {}
    var widget        // For lux popups
      , previd         // For battlefield, which user is displaying stats of
      , guicontent
      , messages
      , stats
      , rows
      , kocid

	var Tofu = {
		version : 0.1
	}
var version = 0.2.130324;

	
    //
    // Auto-fill buttons
    //
var Buttons = {
    btn_update: function(rows, num_rows, cost_col, max_col) {
        function btn_cost(rows) {
            var total_cost = 0;
            $(".btn_go").each(function(i,e) {
                var amount = $(e).parent().parent().find("input").eq(0).val();    
                if (amount === '')
                    amount=0;
                var price = $(e).attr('cost');
                
                total_cost += amount*price;
            }); 
            return total_cost;
        }
        
        var g = String(User.gold).replace(/[^0-9]/g,'');    
        var cur_cost = btn_cost(rows);
        var money_left = Math.max(0, g - cur_cost);
        
        var sum_trained=0;
        rows.each(function(index,element) {
            var cols = $(element).children("td");
            //alert($(cols).size()+" "+num_rows);
            if ($(cols).size() == (1+num_rows)) {
                var cost = $(element).find("td>input:eq(1)").attr("cost");

                var amount = Math.floor(money_left/cost);
                if(max_col) {
                    var max = $(cols).eq(max_col).text().replace(/[^0-9]/g,'');
                    amount = Math.min(amount, max);
                }
                if (document.URL.match('train.php')) {
                    sum_trained += parseInt($(cols).eq(2).children("input").val(), 10);
                }
                $(element).find(".btn_go").val(amount);
            }
        });
        
        if (document.URL.match('train.php')) {        
            var untrained = $("table.personnel>tbody>tr").eq(5).find("td").eq(1).text().replace(/[^0-9]/g,'');
            
            untrained = untrained - sum_trained;
            rows.each(function(i,e) {
                var a = $(e).find(".btn_go").val();    
                
                a = Math.min(a,untrained);
                $(e).find(".btn_go").val(a);
            });
        }
    }

    , init: function(rows, num_rows, cost_col, max_col) {
		var self = this;
        $(rows).find("input").keyup(function() {
            self.btn_update(rows, num_rows, cost_col, max_col); 
        });
        rows.each(function(index,element) {
            var cols = $(element).children("td");
            if ($(cols).size() == num_rows) {
                var cost = $(cols).eq(cost_col).text().replace(/[^0-9]/g,'');
                if (cost > 0)
                    $(element).append("<td><input type='button' cost="+cost+" value=0 class='btn_go' /></td>");
            }
        });
        
        this.btn_update(rows, num_rows, cost_col, max_col);
        
        $(".btn_go").click(function(element) {
            var amount = $(element.target).val();
            $(this).parent().parent().find("input").eq(0).val(amount);
            self.btn_update(rows, num_rows, cost_col, max_col); 
        });
    }

}


var Constants = {

	version : '0.1.20130321'
	
	, baseUrl : 'http://bot.luxbot.net/luxbot.php?'
	, downloadUrl : 'http://bot.luxbot.net/luxbot.user.js'
	, versionUrl : 'http://bot.luxbot.net/luxbot.version.php'
	
    , statsdesc : {0:'Strike Action', 1:'Defensive Action', 2:'Spy Rating', 3:'Sentry Rating', 4:'Gold'}

    , storedStrings : ['race',  'kocnick', 'forumName', 'forumPass', 'auth', 'logself']

    , storedNumbers :['kocid', 'tff', 'income', 'sa', 'da', 'spy', 'sentry', 'spyWeaps', 'sentryWeaps', 'daWeaps', 'saWeaps']
	
	
    , spyWeaps : ["Rope","Dirk","Cloak","Grappling Hook","Skeleton Key","Nunchaku"]
	
    , sentryWeaps : ["Big Candle","Horn","Tripwire","Guard Dog","Lookout Tower"]
	
    , daWeaps : ['Helmet', 'Shield','Chainmail','Plate Armor', 'Mithril', 'Elven Cloak', 'Gauntlets', 'Heavy Shield', 'Dragonskin', 'Invisibility Shield' ]
	
	, options : [ 'logself', 'scrollbattlelog', 'turnclock', 'commandCenterStats', 'targets', 'fakesabtargets', 'goldprojection', 'armorygraph', 'armorydiff']
	
}
   
    // GM Wrappers
    function log(s)     { GM_log(s); console.log(s);   }
    function openTab(t) { GM_openInTab(t); }
    function gmSetValue(t, t2) { GM_setValue(t, "" + t2 + ""); } // Convert to string for allowing storage of large ints
    function gmDeleteValue(t) { GM_deleteValue(t); }
    function gmGetValue(t, def) { return GM_getValue(t, def);}
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

//
// GUI
//

/* 
GUI.init();

GUI.displayHtml( xx)
GUI.displayText(xx)
*/
var GUI = {
	
    init: function () {
        // First add the corner box
        this.$popup = $("<div class='tofu' id='popup_box'>  </div>");  
        this.$controlbox = $("<div class='tofu' id='control_box'> <ul><li>ToFu Version</li><li>Version: "+Tofu.version+"</li></ul> </div>");  
		$("body").append( this.$controlbox );
		$("body").append( this.$popup );
    }

    , displayText: function(tx) {
        this.displayHtml("<div>"+tx+"</div>");
    }

    , displayHtml: function (html) {
		GM_log("Displaying HTML: " + html);
        this.$popup.html(html);
        this.$popup.show();  
    }

	// This is a temporary function to be removed later
    , showMessage:function (text) {
        this.displayText(text);
    }
	
	, hide: function() {
		this.$popup.hide();
	}
	
    /*
    , showControlPanel() {

        this.createGUIBox();
        
        this.addGUILink('Open Control Panel<br>' + version, this.toggle, "#_luxbot_gui");
        this.addGUILink('Show links', this.showLinkBox, "#_luxbot_nav_div");
        this.addGUILink('Farmlist Setup', this.showFarmList, "#_luxbot_nav_div");
        this.addGUILink('Check for update', Init.checkForUpdate, "#_luxbot_nav_div");
        
        
        var q = document.getElementsByTagName('td');
        var i, t;
        for (i = 0; i < q.length; i++) {
            if (q[i].className == 'menu_cell' && q[i].innerHTML.indexOf('username') == -1) {
                if (checkOption('option_sabTargets')) {
                    t = q[i].childNodes[1].insertRow(3);
                    t.innerHTML = '<a href="javascript:void(0);" id="_luxbot_sablist_nav"><img src="'+ gmGetResourceURL("sidebar_sabtargets")+'" /></a>';
                    document.getElementById("_luxbot_sablist_nav").addEventListener('click', sabTargetsButton, true);
                }
                if (checkOption('option_Targets')) {
                    t = q[i].childNodes[1].insertRow(3);
                    t.innerHTML = '<a href="javascript:void(0);" id="_luxbot_farmlist_nav"><img src="'+ gmGetResourceURL("sidebar_targets")+'" /></a>';
                    document.getElementById("_luxbot_farmlist_nav").addEventListener('click', showFarmList, true);
                }
                
                if (checkOption('option_fakeSabTargets')) {
                    t = q[i].childNodes[1].insertRow(3);
                    t.innerHTML = '<a href="javascript:void(0);" id="_luxbot_fakesablist_nav"><img src="'+ gmGetResourceURL("sidebar_fakesabtargets")+'" /></a>';
                    document.getElementById("_luxbot_fakesablist_nav").addEventListener('click', showFakeSabList, true);
                }
                break;
            }
        } 
    }

    , createGUIBox: function() {
        if (widget === undefined) {
            
            var x = document.createElement('div');
            x.id = '_luxbot_darken';
            document.body.appendChild(x);

            
            var q = document.createElement('div');
            q.id = '_luxbot_guibox';
            document.body.appendChild(q);
                            
            q.innerHTML = '<button id="_luxbot_closenav">X</button><div id="_luxbot_nav_div"><ul id="_luxbot_nav"></ul></div><div style="clear:both;"></div><div id="_luxbot_content"></div>';
            document.getElementById("_luxbot_closenav").addEventListener('click', this.toggle, true);
            document.getElementById("_luxbot_darken").addEventListener('click', this.toggle, true);
            
            guicontent = document.getElementById('_luxbot_content');
            
            this.toggle();
        }
        
        guicontent.innerHTML = '<h1>This is the Control Panel for LuXBOT</h1>Please select a task from above!<br /><button id="_luxbot_close">Close</button>';
        document.getElementById('_luxbot_nav_div').style.display = 'block';
        document.getElementById("_luxbot_close").addEventListener('click', this.toggle, true);
    }


    ,  toggle: function() {
        var $d = $("_luxbot_darken").toggle()
    }

    , addGUILink: function(text, event, parent) {
        var id = '_luxbot_' + event.name;
        $(parent+">ul").append("<li><a href='javascript:void(0);' id='"+id+"'>"+text+"</a></li>");
        $("#"+id).click(event);
    }

    // GUI pages

    , showLinkBox: function () {

        var html =  " <table class='table_lines' id='_luxbot_links_table' width='100%' cellspacing='0'\
        cellpadding='6' border='0'>\
        <tr>\
        <th colspan='7'>FF Links</th>\
        </tr>\
        <tr>\
        <td><a href='http://stats.luxbot.net/'>Player Statistics</a></td>\
        <td><a href='http://fearlessforce.net/'>FF Forums</a></td>\
        <td><a href='http://stats.luxbot.net/sabbing.php'>Enemies Sablist</a></td>\
        </tr>\
        </table> ";

        html += '<table class="table_lines" id="_luxbot_links_table" width="100%" cellspacing="0" cellpadding="6" border="0">\
        <tr><th>Recruiters Links</th></tr>\
        <tr><td><a href="http://stats.luxbot.net/clicks.php">Clitclick</a></td>\
        </tr></table>';

        showMessage(html);

    }

    ,  showMessageBox: function() {
        if (messages === undefined) {
            return;
        }
        var content = '';
        var i;
        for (i = 0; i < messages.length; i++) {
            var y = messages[i].split('|');
            content += '<tr id="_luxbot_message_' + y[3] + '"><td><a href="javascript:void(0);" name="' + y[3] + '">+</a></td><td>' + y[1] + '</td><td>' + y[0] + '</td><td>' + y[2] + '</td></tr>';
        }
        
        GUI.showMessage('<h3>Messages</h3><table id="_luxbot_messages" width="100%"><tr><th>Show</th><th>Sender</th><th>Subject</th><th>Date</th></tr>' + content + '</table>');
        document.getElementById("_luxbot_guibox").addEventListener('click', GUI.showMessageDetails, true);
    }

    , showMessageDetails: function(event) {
        if (event.target.name !== undefined) {
            
            getLux('&a=getmessage&id=' + String(event.target.name),
               function(r) {
                    var q = document.getElementById('_luxbot_message_' + String(event.target.name));
                    GUI.showMessage('<h3>Messages</h3><table id="_luxbot_messages" width="100%"><tr><th>From</th><td>' + q.childNodes[1].innerHTML + '</td></tr><tr><th>Subject</th><td>' + q.childNodes[2].innerHTML + '</td></tr><tr><th>Date</th><td>' + q.childNodes[3].innerHTML + '</td></tr><tr><th>Message</th><td>' + r.responseText + '</td></tr>', GUI.showMessageBox);
                    addCSS('#_luxbot_messages {border-spacing:4px;}\
                    #_luxbot_messages th{width:100px;padding:6px;}');
            });
        }
    }
    */
}

//Thank you to vbulletin, for letting me borrow this code. Not gonna take credit for it ;)
var HEX = {

	hex_md5 : function(dothis) {
		var hexcase=0;var b64pad="";var chrsz=8;function hex_md5(A){return binl2hex(core_md5(str2binl(A),A.length*chrsz))}function b64_md5(A){return binl2b64(core_md5(str2binl(A),A.length*chrsz))}function str_md5(A){return binl2str(core_md5(str2binl(A),A.length*chrsz))}function hex_hmac_md5(A,B){return binl2hex(core_hmac_md5(A,B))}function b64_hmac_md5(A,B){return binl2b64(core_hmac_md5(A,B))}function str_hmac_md5(A,B){return binl2str(core_hmac_md5(A,B))}function core_md5(K,F){K[F>>5]|=128<<((F)%32);K[(((F+64)>>>9)<<4)+14]=F;var J=1732584193;var I=-271733879;var H=-1732584194;var G=271733878;for(var C=0;C<K.length;C+=16){var E=J;var D=I;var B=H;var A=G;J=md5_ff(J,I,H,G,K[C+0],7,-680876936);G=md5_ff(G,J,I,H,K[C+1],12,-389564586);H=md5_ff(H,G,J,I,K[C+2],17,606105819);I=md5_ff(I,H,G,J,K[C+3],22,-1044525330);J=md5_ff(J,I,H,G,K[C+4],7,-176418897);G=md5_ff(G,J,I,H,K[C+5],12,1200080426);H=md5_ff(H,G,J,I,K[C+6],17,-1473231341);I=md5_ff(I,H,G,J,K[C+7],22,-45705983);J=md5_ff(J,I,H,G,K[C+8],7,1770035416);G=md5_ff(G,J,I,H,K[C+9],12,-1958414417);H=md5_ff(H,G,J,I,K[C+10],17,-42063);I=md5_ff(I,H,G,J,K[C+11],22,-1990404162);J=md5_ff(J,I,H,G,K[C+12],7,1804603682);G=md5_ff(G,J,I,H,K[C+13],12,-40341101);H=md5_ff(H,G,J,I,K[C+14],17,-1502002290);I=md5_ff(I,H,G,J,K[C+15],22,1236535329);J=md5_gg(J,I,H,G,K[C+1],5,-165796510);G=md5_gg(G,J,I,H,K[C+6],9,-1069501632);H=md5_gg(H,G,J,I,K[C+11],14,643717713);I=md5_gg(I,H,G,J,K[C+0],20,-373897302);J=md5_gg(J,I,H,G,K[C+5],5,-701558691);G=md5_gg(G,J,I,H,K[C+10],9,38016083);H=md5_gg(H,G,J,I,K[C+15],14,-660478335);I=md5_gg(I,H,G,J,K[C+4],20,-405537848);J=md5_gg(J,I,H,G,K[C+9],5,568446438);G=md5_gg(G,J,I,H,K[C+14],9,-1019803690);H=md5_gg(H,G,J,I,K[C+3],14,-187363961);I=md5_gg(I,H,G,J,K[C+8],20,1163531501);J=md5_gg(J,I,H,G,K[C+13],5,-1444681467);G=md5_gg(G,J,I,H,K[C+2],9,-51403784);H=md5_gg(H,G,J,I,K[C+7],14,1735328473);I=md5_gg(I,H,G,J,K[C+12],20,-1926607734);J=md5_hh(J,I,H,G,K[C+5],4,-378558);G=md5_hh(G,J,I,H,K[C+8],11,-2022574463);H=md5_hh(H,G,J,I,K[C+11],16,1839030562);I=md5_hh(I,H,G,J,K[C+14],23,-35309556);J=md5_hh(J,I,H,G,K[C+1],4,-1530992060);G=md5_hh(G,J,I,H,K[C+4],11,1272893353);H=md5_hh(H,G,J,I,K[C+7],16,-155497632);I=md5_hh(I,H,G,J,K[C+10],23,-1094730640);J=md5_hh(J,I,H,G,K[C+13],4,681279174);G=md5_hh(G,J,I,H,K[C+0],11,-358537222);H=md5_hh(H,G,J,I,K[C+3],16,-722521979);I=md5_hh(I,H,G,J,K[C+6],23,76029189);J=md5_hh(J,I,H,G,K[C+9],4,-640364487);G=md5_hh(G,J,I,H,K[C+12],11,-421815835);H=md5_hh(H,G,J,I,K[C+15],16,530742520);I=md5_hh(I,H,G,J,K[C+2],23,-995338651);J=md5_ii(J,I,H,G,K[C+0],6,-198630844);G=md5_ii(G,J,I,H,K[C+7],10,1126891415);H=md5_ii(H,G,J,I,K[C+14],15,-1416354905);I=md5_ii(I,H,G,J,K[C+5],21,-57434055);J=md5_ii(J,I,H,G,K[C+12],6,1700485571);G=md5_ii(G,J,I,H,K[C+3],10,-1894986606);H=md5_ii(H,G,J,I,K[C+10],15,-1051523);I=md5_ii(I,H,G,J,K[C+1],21,-2054922799);J=md5_ii(J,I,H,G,K[C+8],6,1873313359);G=md5_ii(G,J,I,H,K[C+15],10,-30611744);H=md5_ii(H,G,J,I,K[C+6],15,-1560198380);I=md5_ii(I,H,G,J,K[C+13],21,1309151649);J=md5_ii(J,I,H,G,K[C+4],6,-145523070);G=md5_ii(G,J,I,H,K[C+11],10,-1120210379);H=md5_ii(H,G,J,I,K[C+2],15,718787259);I=md5_ii(I,H,G,J,K[C+9],21,-343485551);J=safe_add(J,E);I=safe_add(I,D);H=safe_add(H,B);G=safe_add(G,A)}return Array(J,I,H,G)}function md5_cmn(F,C,B,A,E,D){return safe_add(bit_rol(safe_add(safe_add(C,F),safe_add(A,D)),E),B)}function md5_ff(C,B,G,F,A,E,D){return md5_cmn((B&G)|((~B)&F),C,B,A,E,D)}function md5_gg(C,B,G,F,A,E,D){return md5_cmn((B&F)|(G&(~F)),C,B,A,E,D)}function md5_hh(C,B,G,F,A,E,D){return md5_cmn(B^G^F,C,B,A,E,D)}function md5_ii(C,B,G,F,A,E,D){return md5_cmn(G^(B|(~F)),C,B,A,E,D)}function core_hmac_md5(C,F){var E=str2binl(C);if(E.length>16){E=core_md5(E,C.length*chrsz)}var A=Array(16),D=Array(16);for(var B=0;B<16;B++){A[B]=E[B]^909522486;D[B]=E[B]^1549556828}var G=core_md5(A.concat(str2binl(F)),512+F.length*chrsz);return core_md5(D.concat(G),512+128)}function safe_add(A,D){var C=(A&65535)+(D&65535);var B=(A>>16)+(D>>16)+(C>>16);return(B<<16)|(C&65535)}function bit_rol(A,B){return(A<<B)|(A>>>(32-B))}function str2binl(D){var C=[];var A=(1<<chrsz)-1;for(var B=0;B<D.length*chrsz;B+=chrsz){C[B>>5]|=(D.charCodeAt(B/chrsz)&A)<<(B%32)}return C}function binl2str(C){var D="";var A=(1<<chrsz)-1;for(var B=0;B<C.length*32;B+=chrsz){D+=String.fromCharCode((C[B>>5]>>>(B%32))&A)}return D}function binl2hex(C){var B=hexcase?"0123456789ABCDEF":"0123456789abcdef";var D="";for(var A=0;A<C.length*4;A++){D+=B.charAt((C[A>>2]>>((A%4)*8+4))&15)+B.charAt((C[A>>2]>>((A%4)*8))&15)}return D}function binl2b64(D){var C="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";var F="";for(var B=0;B<D.length*4;B+=3){var E=(((D[B>>2]>>8*(B%4))&255)<<16)|(((D[B+1>>2]>>8*((B+1)%4))&255)<<8)|((D[B+2>>2]>>8*((B+2)%4))&255);for(var A=0;A<4;A++){if(B*8+A*6>D.length*32){F+=b64pad}else{F+=C.charAt((E>>6*(3-A))&63)}}}return F}function str_to_ent(D){var A="";var C;for(C=0;C<D.length;C++){var E=D.charCodeAt(C);var B="";if(E>255){while(E>=1){B="0123456789".charAt(E%10)+B;E=E/10}if(B===''){B="0"}B="#"+B;B="&"+B;B=B+";";A+=B}else{A+=D.charAt(C)}}return A}function trim(A){while(A.substring(0,1)==" "){A=A.substring(1,A.length)}while(A.substring(A.length-1,A.length)==" "){A=A.substring(0,A.length-1)}return A}function md5hash(B,A,E,C){if(navigator.userAgent.indexOf("Mozilla/")===0&&parseInt(navigator.appVersion, 10)>=4){var D=hex_md5(str_to_ent(trim(B.value)));A.value=D;if(E){D=hex_md5(trim(B.value));E.value=D}if(!C){B.value=""}}return true}
		return hex_md5(dothis);
	}
}
    // INIT
    var Init = {

        init: function() {
            var newCSS = gmGetResourceText ("styles");
            gmAddStyle (newCSS);
            
            GUI.init();
        }

      , loadUser : function(kocid) {
            db.init(kocid)
            if (db.id === 0) return false;
                    
            var userObject = {};

            _.map(Constants.storedStrings, function(val) {
                userObject[val] = db.get(val, '')
				// log(val + " : " + db.get(val, ''));
            })

            _.map(Constants.storedNumbers, function (val) {
                userObject[val] = db.get(val, 0);
				// log(val + " : " + db.get(val, 0));
            });


            var d = new Date();
            userObject.time_loaded = d.getTime();
            userObject.gold = Page.getPlayerGold()

            return userObject
        }    
        
        , showInitBox: function () {
            
            function initLogin() {

                var f_user = $("#_forum_username").val();
                var f_pass = $("#_forum_password").val();
                if (f_pass === '' || f_user === '')
                    return;
                GUI.showMessage("Verifying...<br />");
                
                get('http://www.kingsofchaos.com/base.php',
                    function(responseDetails) {
                            var html = responseDetails.responseText;
                            var user = textBetween(html,'<a href="stats.php?id=', '</a>');
                            user = user.split('">');
                            
                            db.put('kocnick', user[1]);
                            db.put('kocid', user[0]);
                            var password = HEX.hex_md5(f_pass);
                            db.put('forumPass', password);
                            db.put('forumName', f_user);
                            initVB();
                    }
                );
            }
			
            function initVB() {
                getLux('&a=vb_login&kocid=' + db.get('kocid')+'&forumname='+db.get('forumName'),
                    function(r) {
                        var ret = r.responseText;
                        if (ret.indexOf("Error") == -1) {
                            //success
                            db.put('auth', ret);
                            alert("Success");
                            GUI.hide();
                        } else {
							GUI.displayText("There was an error, try refreshing your command center.");
                        }
                });    
            }
			
            var welcome ='<h1>Welcome</h1>There is no data for your LuX account.<br /><br />';
            GUI.showMessage(welcome + 'Please login with your <a href="http://www.fearlessforce.net">FF Forums</a> info.<br /><br /> '+
                        'User: <input type="text" id="_forum_username" value="'+(User.forumName? User.forumName : '')+'"/> Password: <input type="password" id="_forum_password" /> <input type="button" value="Login"'+
                                        'id="_luxbot_login" /><br />');   
                                        
            $("#_luxbot_login").click(initLogin);
        
        }
     
        , checkForUpdate: function(startup) {
            if (db.get("luxbot_version",0) != Constants.version) {
                //if the version changes
                db.put("luxbot_version", Constants.version);
                db.put("luxbot_needsUpdate",0);
            }
            if (startup == 1 && db.get("luxbot_needsUpdate",0) == 1) {
                setTimeout(function() {
                    $("#_luxbot_gui>ul").append("<li id='getUpdate' style='padding-top:5px;color:yellow'>Get Update!</li>");
                    $("#getUpdate").click(function() {
                        openTab(Constants.downloadUrl); 
                    });
                },1000);
                return;
            }
            
            var now = new Date(); 
            var lastCheck = db.get('luxbot_lastcheck', 0);

            if (startup != 1 || (now - new Date(lastCheck)) > (60*1000)) {
                get( Constants.versionUrl,
                    function(responseDetails) {
                            var latestVersion = Number(responseDetails.responseText.replace(/\./, ''));
                            var thisVersion = Number(version.replace(/\./, ''));
                            if (latestVersion > thisVersion){
                                db.put("luxbot_needsUpdate",1);
                                db.put("luxbot_version",Constants.version);
                                if (startup != 1) {
                                    alert("There is an update!");
									openTab(Constants.downloadUrl); 
                                }
                            } else if (startup != 1) {
                                alert("You are up to date!");
                            }
                    }
                );
                db.put('luxbot_lastcheck', now.toString());
            }
        }
        
        , checkUser: function() {
			log(User);log(" eh " + User.forumName + User.forumPass + User.forumName + User.auth);
            if (User.forumName === 0 || User.forumPass === 0 || User.forumName === undefined 
              || User.forumPass === undefined || User.auth === undefined || User.auth === 0 
              || User.auth.length !== 32) {
                    Init.showInitBox();
                    return 0;
            } else {
                getLux('&a=vb_auth',
                    function(r) {
                        if (r.responseText == '403') {
                            Init.showInitBox();
                            return 0;
                        }
                        
                        var x = r.responseText.split(';');
                        var logself = x.shift();
                        
                        stats = {'tffx':x.shift(), 'dax':x.shift(), 'goldx':x.shift()};
                        
                        var temp = document.getElementById('_luxbot_showMessageBox');
                        if (!temp) return;
                        temp.innerHTML = 'Show Messages (' + (x.length-1) + ')';
                        
                        // messages is a global var
                        if ((messages = x.pop()) === '1') {
                            GUI.showMessageBox();
                        }
                    });
                
                return 1;
            }
            return 1;
        }

    }

    
    //
    // Javascript Shortcuts
    //
    String.prototype.trim = function () {return this.replace(/^\s+|\s+$/g, '');};
    String.prototype.between = function(first,second) {
            var x = this.indexOf(first) + first.length;
            var z = this.substring(x);
            var y = z.indexOf(second);
            return z.substring(z,y);
    };
    String.prototype.instr = function(strFind){return (this.indexOf(strFind) >= 0);};
    String.prototype.int = function() {
        var r = parseInt(this.replace(/,/g,''),10);
        if (isNaN(r)) r=-1;
        return r;
        };
    String.prototype.float = function() {
        var r = parseFloat(this.replace(/[^0-9\.]*/g,''),10);
        if (isNaN(r)) r=-1;
        return r;
        };
    Number.prototype.int = function() {
        return this;
    }

    function to_int(str) {
        str = str.replace(/[^0-9]/g, '');
        if (str === '') {
            return '';
        }
        return parseInt(str, 10);
    }
    
    function remove_delimiters(str) {
        str = str.replace(/[;:&?]/g,'');
        return str;
    }    

    function textBetween (str,first,second) {
        if (str === null) {
            alert("Unexpected page formatting, please reload.");
            return "";
        }
        var x = str.indexOf(first) + first.length;
        var z = str.substr(x);
        var y = z.indexOf(second);
        return z.substr(z,y);
    }
    
    function html_row() {
        // Turn the arguments object into an array
        var arr = [].slice.call(arguments)
        return "<tr><td>"+arr.join("</td><td>")+"</td></tr>";
    }
    
    function addCSS(cssText) {
        $("head").append("<style>"+cssText+"</style>");
    }
    
    function addJS(jsText) {
        //$("head").append('<script>'+jsText+'</script>');
        
        
        var head = document.getElementsByTagName("head")[0];
        if (!head) {
            return;
        }
        var style = document.createElement("script");
        style.type = "text/javascript";
        style.innerHTML = jsText;
        head.appendChild(style);
        
    }
    
    function striptags(html) {
        var re= /<\S[^>]*>/g;
        return html.replace(re, " ").replace(/^\s+|\s+$/g, '');
    }
    
    function addCommas(sValue) {

    sValue = String(sValue);
        var sRegExp = new RegExp('(-?[0-9]+)([0-9]{3})');
        
        while(sRegExp.test(sValue)) {
            sValue = sValue.replace(sRegExp, '$1,$2');
        }
        return sValue;
    }
    

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

	function getLux(url, callback) {
        var address= baseURL+'&username='+User.kocnick+'&password=' + User.forumPass +'&auth=' + User.auth + url;
        
        log("Get URL: " +address);
        get(address,callback);
    }  
    
    function postLux(url, data, callback) {
        var address = Constants.baseURL+'&username='+User.kocnick+'&password=' + User.forumPass +'&auth=' + User.auth + url;
        
        log("Post URL: "+ address);
        post(address, data, callback);
    }

    function makeCollapsable(action) {
        //TODO: ensure only once
        addCSS(".expando {float:right;}")
        addCSS(".collapsed_table > tbody > tr:nth-child(n+2) { visibility:hidden; display:none;}");
        addCSS("table.table_lines > tbody > tr > th {cursor:pointer;}")
        addCSS("table.table_lines { margin-top:5px; }")
        
        function collapseTable(table) {
            var $table = $(table)
            $table.find(".expando").text("+")
            $table.addClass("collapsed_table")
        }       
    
        function onTableClick(e) {        
            var $table = $(e.target).closest("table")

            if ($table.is(".collapsed_table")) {
                $table.find(".expando").text("-");
            } else {
                $table.find(".expando").text("+");
            }
            $table.toggleClass("collapsed_table");

            saveCollapsed();
        }

        function saveCollapsed() {
            var store = [];
            $("table").each(function(i,e) {
                if ($(e).is(".collapsed_table"))
                    store.push(i)
            });
            db.put('coltables_' + action, store.join(','));
        }    
        
        $(document).on('click', "table.table_lines > tbody > tr > th", onTableClick)

        var $tables = $("table").each(function(i,e) {
            // This is the only table that koc handles for us.
            if ($(e).is(".personnel"))
                return;
                
            $(e).find("tbody > tr:eq(0) >th").append("<span class='expando'>-</span>");
        });
        
        var coltables = db.get('coltables_' + action, '').split(',');
        _.map(coltables, function (i) { collapseTable($tables.eq(i)); });
    }


    //
    // LOGGING
    //
 
    function logBase(stats, data, officers) {
        //stats=sa;da;spy;sentry;
        //details=fort;siege;econ;tech;conscription;turns;covertlevel;bonus
                            
        getLux('&a=base' +
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

	function sendAttackLogDetails (user, type, oppid, opponent, user_damages, opponent_damages, user_losses, opponent_losses, gold_stolen, logid, time) {
        getLux( '&a=logattack&type=' + type + '&user=' + user + 
            '&enemy=' + opponent + ';' + oppid + ';' + opponent_damages + ';' + opponent_losses +
            '&data=' + user_damages + ';' + user_losses + 
            '&gold=' + gold_stolen +
            '&time=' + time +
            '&logid=' + logid,
            function(responseDetails) {
        
        });
    }    
    function logRecon(enemy, enemyid, logid, gold, data, weapons) {
        getLux('&a=logRecon&enemy=' + enemy + 
                                '&enemyid=' + enemyid +
                                '&logid=' + logid +
                                '&gold=' + gold +
                                '&data=' + data + 
                                '&weapons=' + weapons
                    , function(responseDetails) {
                            log("logRecon Response: "+ responseDetails.responseText);
                    });
    }    

    function SendConquestDetails(contype) {
        getLux('a=logcon&contype=' + contype);
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
 

var Options = {         
       showUserOptions: function() {
            var htmlToggle = function(name,value,opt1,opt2) {
				var current = db.get(value, "true");
				var html;
				
				if (!opt1)
					opt1 = "Enabled";
				if (!opt2)
					opt2 = "Disabled";
				if (current == "true") {
					html = "<tr><td> "+name+"</td><td><input type='radio' name='"+value+"' checked='checked' value='true'>"+opt1+"</input>"
							+"<input type='radio' name='"+value+"' value='false'>"+opt2+"</input></tr>";
				} else {
					html = "<tr><td> "+name+"</td><td><input type='radio' name='"+value+"' value='true'>"+opt1+"</input>"
					+"<input type='radio' name='"+value+"' checked='checked' value='false'>"+opt2+"</input></tr>";
				}
				return html;
            }
            var c = (User.logself === 1) ?  ' checked="checked"' : '';
            
            var battlelog = db.get('battlelog', 0);
            
            GUI.showMessage('<h3>LuXBOT User Options</h3> <br />\
            <fieldset><legend>User Options</legend>\
                Log own details and gold from base: <input type="checkbox" id="_luxbot_logself"' + c + ' /><br />\
                Battle Log: <input type="radio" name="_luxbot_battlelog" value="0"' + (battlelog === 0 ? ' checked="checked"' : '') + ' />\
                    No Action <input type="radio" name="_luxbot_battlelog" value="1"' + (battlelog === 1 ? ' checked="checked"' : '') + ' /> \
                    Show Full Log with Bottom Scroll <input type="radio" name="_luxbot_battlelog" value="2"' + (battlelog === 2 ? ' checked="checked"' : '') + ' /> \
                    Show Full Log with Top Scroll <input type="radio" name="_luxbot_battlelog" value="3"' + (battlelog === 3 ? ' checked="checked"' : '') + ' /> \
                    Show Full Log with Redirect<br />\
                Always Focus Security Pages: <input type="checkbox" id="_luxbot_securitycheck" ' + (db.get('securityfocus', 0) === 1 ? ' checked="checked"' : '') + '/></fieldset>'
                +'<table>'
                +htmlToggle("Turn Clock","option_clock") 
                +htmlToggle("Stats In Command Center","option_commandCenterStats","Top","Side") 
                +htmlToggle("Attack Targets","option_Targets") 
                // +htmlToggle("Show Enemy Sab List","option_sabTargets") 
                +htmlToggle("Show Fake Sab Targets","option_fakeSabTargets") 
                +htmlToggle("Show Personal Gold Projections","option_goldProjection") 
                +htmlToggle("Show Stats Changes in Armory","option_armory_diff") 
                +htmlToggle("Show Armory Value Graph in Armory","option_armory_graph") 
                +"</table>"
                
                + '<br /><br /><input type="button" value="Save!" id="_luxbot_save" /> <br />');
                
            document.getElementById("_luxbot_save").addEventListener('click', GUI.saveUserOptions, true);
        }
     
      , saveUserOptions: function() {

			_.each(Constants.options, function (option) {
				db.put("option_"+option, $("input[name='option_"+option+"']:checked").val());
			});
            
            GUI.toggleGUI();
        }
 }

    // 
    // Sab Targets Button
    //
    
    function sabTargetsButton() {
    
        var html = '<table class="table_lines" id="_luxbot_targets_table" width="100%" cellspacing="0" cellpadding="6" border="0">'
        html += '<tr><td><input type="button" id="getTodaysSabs" value="View Your Sabs" /></td></tr><tr><td id="_sab_content">Loading... Please wait...</td></tr> </table>';
        GUI.showMessage(html);
        getSabTargets();
    
   }
 
    function getTodaysSabs() {
       getLux('&a=getTodaysSabs',
            function(r) {
                document.getElementById('_sab_content').innerHTML = r.responseText;    
                document.getElementById('getTodaysSabs').value="View Sab List";
                document.getElementById('getTodaysSabs').addEventListener('click',getSabTargets,true);
                document.getElementById('getTodaysSabs').removeEventListener('click',getTodaysSabs,false);
        });      
    }

    function getSabTargets() {
        getLux('&a=getsabtargets',
            function(r) {
                function onClick(e) {
                    openTab('http://www.kingsofchaos.com/attack.php?id=' + String(e.target.id).replace(/__/, ''));
                }
                var i;
                if ( r.responseText != '403' ) {
                    document.getElementById('_sab_content').innerHTML = r.responseText;
                }
               
                var q = document.getElementsByName('_luxbot_targets_t');
                for (i = 0; i < q.length; i++) {
                    q[i].addEventListener('click', onClick, true);
                }
                
                document.getElementById('getTodaysSabs').value="View Your Sabs";
                document.getElementById('getTodaysSabs').addEventListener('click',getTodaysSabs,true);
                document.getElementById('getTodaysSabs').removeEventListener('click',getSabTargets,false);
 
            });
    }
 

    // 
    // Attack Targets Button
    //

    function showFarmList() {
        var goldInputType = db.get("goldinput", 0);
        var tffInputType = db.get("tffinput", 0);
        var daInputType = db.get("dainput", 0);
        
        var maxDa = db.get("maxDa", 1000);
        var minTff = db.get("minTff", 10);
        var minGold = db.get("minGold", 0);
        var maxSeconds = db.get("maxSeconds", 120);
        var byProjection = db.get("byProjection", "");
        
        var saMultiplier = db.get("saMultiplier", 0.80);
        var tffAdder = db.get("tffAdder", 50);
        
         var html = '<table class="table_lines" id="_luxbot_targets_table" width="100%" cellspacing="0" cellpadding="6" border="0">'
        +'<tr><th colspan="7">Master Targets (Loading)</th></tr>'
        +'<tr id="targetsFirstRow"><td><b>Name</b></td><td colspan="2" align="center"><b>Defensive Action</b></td><td align="center"><b>Total Fighting Force</b></td><td width=200 align="right"><b>Gold</b></td><td>&nbsp;</td><td>&nbsp;</td></tr>'
        +'<tr><th colspan="7">Settings</th></tr>'
        +'<tr><td colspan=7 id="targets_settings"> </td></tr>'
        +'</table>';
        
         
        var form1 = $("<fieldset style='width: 20%; padding:10px 0 5px 10%; float: left;' id='autofill'><legend>Autofill</legend></fieldset>");
            form1.append($("<label for=saMultiplier />").text("SA x "));
            form1.append($("<input type=text name=saMultiplier size=5/><br />").val(saMultiplier));

            form1.append($("<label for=tffAdder>").text("TFF + "));
            form1.append($("<input type=text name=tffAdder size=4/><br />").val(tffAdder));
            form1.append($("<input type=button id='targets_autofill' value='Autofill' /><br />"));
        
        var form2 = $("<fieldset style='width: 30%; padding:10px; float: left;' id='values'><legend>Filter Settings</legend></fieldset>");
            form2.append($("<label  class='tLabel' for=maxDa />").text("Max Defense: "));
            form2.append($("<input type=text name=maxDa /><br />").val(maxDa));
            form2.append($("<label class='tLabel' for=minTff>").text("Min TFF: "));
            form2.append($("<input type=text name=minTff /><br />").val(minTff));
            form2.append($("<label  class='tLabel' for=minGold>").text("Min Gold: "));
            form2.append($("<input type=text name=minGold /><br />").val(minGold));
            form2.append($("<label  class='tLabel' for=maxSeconds>").text("Max Gold Age: "));
            form2.append($("<input type=text name=maxSeconds /><br />").val(maxSeconds));
            form2.append($("<label  class='tLabel' for=maxSeconds>").text("Filter by Projection: "));
            form2.append($("<input type=checkbox name=by_projection value='1' /><br />").attr("checked",byProjection));

        var form3 = $("<fieldset style='width: 20%; padding:10px 0 5px 10%; float: left;' id='autofill'><legend>Reset / Save</legend></fieldset>");
            form3.append($("<input type=button id='targets_refresh' value='Refresh' /><br /><br />"));
            form3.append($("<input type=button id='targets_save' value='Save' /><br />"));
            form3.append($("<input type=button id='targets_reset' value='Reset' /> "));

        GUI.showMessage(html);
        $("#targets_settings").append(form1);    
        $("#targets_settings").append(form2);    
        $("#targets_settings").append(form3);    
            
        $("#targets_refresh").click(function() {
            getTargets();
        });            
        $("#targets_autofill").click(function() {
            var tffAdd = $("input[name='tffAdder']").val();
            var saMult = $("input[name='saMultiplier']").val();
            $("input[name='minTff']").val(Math.floor(User.tff.int()+tffAdd.int()));
            $("input[name='maxDa']").val(Math.floor(User.sa.int() * saMult ));
        });
        $("#targets_reset").click(function() {
            $("input[name='minTff']").val(10);
            $("input[name='maxDa']").val(1000);
            $("input[name='minGold']").val(0);
            $("input[name='maxSeconds']").val(120);
            $("input[name='saMultiplier']").val(0.80);
            $("input[name='tffAdder']").val(50);
            $("input[name='by_projection']").attr("checked", "");
        });
        $("#targets_save").click(function() {
            db.put("maxDa", $("input[name='maxDa']").val().int().toString());
            db.put("minTff", $("input[name='minTff']").val().int());
            db.put("minGold", $("input[name='minGold']").val().int());
            db.put("maxSeconds", $("input[name='maxSeconds']").val().int());
            db.put("saMultiplier", $("input[name='saMultiplier']").val().float().toString());
            db.put("tffAdder", $("input[name='tffAdder']").val().int());
            db.put("byProjection", $("input[name='by_projection']").prop('checked'));
            getTargets();

        });
         
        getTargets(); 
        
    }
    
    function getTargets() {
        $(".targetTR").remove();
        getLux('&a=gettargets&g=' + db.get('minGold',0) + '&t=' + db.get('minTff', 0) 
             + '&d=' + db.get('maxDa', 0) + '&q=' + db.get('maxSeconds', 0)
             + '&by_projection=' + db.get('byProjection',0),
           function(r) {
                var row, i;
                var x = r.responseText.split(';');
                var html="";
                for(i = 0; i < x.length-1; i++) {
                    row = x[i].split(':');
                    html += '<tr class="targetTR"><td><a href="/stats.php?id=' + row[1] + '">' + row[0] + '</a></td><td align="right">' + (row[3]) + '</td><td>(' + row[4] + ')</td><td align="center">' + row[2] + '</td>'
                    +'<td align="right">'
                        +'<span class="gold">' + row[5] + '</span>'
                        +'<span class="projection" style="display:none;">Projected: '+row[7] + '</span>' +
                    '</td><td align="left">(' +row[6] + ')</td><td align="right"><input type="button" value="Attack" style="cursor:pointer" name="_luxbot_targets_t" id="__' + row[1] + '"></td></tr>';
                }
                $("#targetsFirstRow").after(html);
                
               
                $(".projection").css("color","#B3FFF8");
                $(".targetTR").hover(
                  function () {
                    $(this).find(".gold").hide();
                    $(this).find(".projection").show();
                  }, 
                  function () {
                  //alert("off");
                    $(this).find(".gold").show();
                    $(this).find(".projection").hide();                  
                });

            });    
    }
   
    function showFakeSabList() {
    
        var html = '<table class="table_lines" id="_luxbot_targets_table" width="100%" cellspacing="0" cellpadding="6" border="0">'
        html += '<tr><td id="_sab_content">Loading... Please wait...</td></tr> </table>';
        GUI.showMessage(html);
        getFakeSabTargets();
   }

    function getFakeSabTargets() {
        //log('http://' + serverURL + 'targets.php?username=' + username + '&password=' + password + '&g=' + GM_getValue('mingold', stats['goldx']) + '&t=' + GM_getValue('mintff', stats['tffx']) + '&d=' + GM_getValue('minda', stats['dax']) + '&a=' + GM_getValue('minage', 120));
        
        function clickHelper(e) {
            openTab('http://www.kingsofchaos.com/attack.php?id=' + String(e.target.id).replace(/__/, ''));
        }
        getLux('&a=getfakesabtargets',
            function(r) {
                var i;
                if ( r.responseText != '403' ) {
                    document.getElementById('_sab_content').innerHTML = r.responseText;
                }
               
                var q = document.getElementsByName('_luxbot_targets_t');
                for (i = 0; i < q.length; i++) {
                    q[i].addEventListener('click', clickHelper, true);
                }
                
                document.getElementById('getTodaysSabs').value="View Your Sabs";
                document.getElementById('getTodaysSabs').addEventListener('click',getTodaysSabs,true);
                document.getElementById('getTodaysSabs').removeEventListener('click',getSabTargets,false);
 
            });
    }


Page.armory = {
    
        run : function() {
            $("table.table_lines:eq(2)").attr("id","military_effectiveness");
            $("table.table_lines:eq(5)").attr("id","buy_weapons_form");
            
            //next two lines adds the clickable buttons
            rows = $("form[name='buyform']").find("table>tbody>tr");
            Buttons.init(rows,4,2); 

            this.formatPage()
            this.addBuyButton();
        }
        
        , formatPage : function () { 
            var spyWeaps = Constants.spyWeaps.join(",");
            var sentryWeaps = Constants.sentryWeaps.join(",");
            var daWeaps = Constants.daWeaps.join(",");
            
            var stable = $("table:contains('Military Effectiveness')").last();
            var sa = $(stable).find("tr:contains('Strike Action'):first>td:eq(1)").text();
            var da = $(stable).find("tr:contains('Defensive Action'):first>td:eq(1)").text();
            var spy = $(stable).find("tr:contains('Spy Rating'):first>td:eq(1)").text();
            var sentry = $(stable).find("tr:contains('Sentry Rating'):first>td:eq(1)").text();
            
            if (checkOption('option_armory_diff'))
                this.armory_diff(sa,da,spy,sentry);
                    
            //Send Armory to Luxbot
            var spyWeapsQty = 0;
            var sentryWeapsQty = 0;
            var daWeapsQty = 0;
            var saWeapsQty = 0;
            
            function retrieveWeapons(str) {
                //name:qty:repair
                str = str.split("\n");
                str[1] = str[1].split(" (")[0];
                
                if (spyWeaps.instr($.trim(str[1])))
                    spyWeapsQty +=  $.trim(str[2]).int();
                else if (sentryWeaps.instr($.trim(str[1])))
                    sentryWeapsQty +=  $.trim(str[2]).int();
                else if (daWeaps.instr($.trim(str[1])))
                    daWeapsQty += $.trim(str[2]).int();
                else 
                    saWeapsQty +=  $.trim(str[2]).int();
                    
                return $.trim(str[1]) + ':' + $.trim(str[2]) + ':' + $.trim(str[3]) + ';';
            }

            // This will be sent to luxbot server.
            var tempvar = ''; 
            
            // gets an array of weapons and tools
            var arr = $("input[name='doscrapsell']").parent().parent().parent().parent().parent().parent();


            arr.each(function(){
                tempvar+=retrieveWeapons($(this).text());
            });
            
            this.sabLogs_update(tempvar);
            this.sabLogs_init();
            
            this.armory_upgradeSuggestions(User);
            this.armory_aat();
            db.put('sa',sa);
            db.put('da',da);
            db.put('spy',spy);
            db.put('sentry',sentry);
            db.put('sentryWeaps',sentryWeapsQty);
            db.put('spyWeaps',spyWeapsQty);
            db.put('daWeaps',daWeapsQty);
            db.put('saWeaps',saWeapsQty);
            
            postLux('&a=armory', '&data='+tempvar); // pass the info to the db. 
            
            if (checkOption('option_armory_graph'))
                this.showStats();
        }    
  
        , showStats : function () {
            addCSS("#container {max-width:500px;height:300px;}");
            $(".personnel").before('<table class="table_lines" width="100%" cellspacing="0" cellpadding="6" border="0"><tbody><tr><th>Armory Value Stats</th></tr><tr><td><div id="container"></div></td></tr></tbody></table><br />');

            getLux('&a=armoryStats',function(a) {
                
                    window.chart = new Highcharts.StockChart({
                        chart : {
                            renderTo : 'container'
                          , zoom : 'none'
                            // width: '100%'
                        },
                        rangeSelector: {
                            enabled: false
                        },
                        scrollbar : {
                            enabled : false
                        },
                        yAxis: {
                            min: 0
                            // startOnTick: false,
                            // endOnTick: false    
                        },

                        title : {
                            text : 'Armory Value'
                        },
                        
                        series : [{
                            name : 'Weapon Value',
                            data : $.parseJSON(a.responseText),
                            tooltip: {
                                valueDecimals: 0
                            }
                        }]
                    });        
                });
            }
            
        , armory_diff : function(sa,da,spy,sentry) {
        
            function describeDiff(diff,total) {
                if (diff === 0)
                    return '<span style="color:white"> + '+diff+'</span></td><td>&nbsp;';
                else if (diff < 0)
                    diff = '<span style="color:red"> '+addCommas(diff)+'</span></td><td>&nbsp;&nbsp;<span style="color:red">  '+(diff/total ).toFixed(4)+' %</span>';
                else
                    diff = '<span style="color:green"> + '+addCommas(diff)+'</td><td>&nbsp;&nbsp;<span style="color:green">  + '+(diff/total).toFixed(4)+' %</span>';
                return diff;
            }
            
            $("#military_effectiveness").after('<table id="armory_diff" class="table_lines" width="100%" cellspacing="0" cellpadding="6" border="0"><tbody id="diffFirstRow"><tr><th colspan=3>Stats Differences</th></tr></tbody></table>');
            
            $("#diffFirstRow").append("<tr><td>Strike Action: </td><td>"+describeDiff(sa.int() - User.sa.int(),User.sa.int())+"</td></tr>");
            $("#diffFirstRow").append("<tr><td>Defensive Action: </td><td>"+describeDiff(da.int() - User.da.int(),User.da.int())+"</td></tr>");
            $("#diffFirstRow").append("<tr><td>Spy: </td><td>"+describeDiff(spy.int() - User.spy.int(),User.spy.int())+"</td></tr>");
            $("#diffFirstRow").append("<tr><td>Sentry: </td><td>"+describeDiff(sentry.int() - User.sentry.int(),User.sentry.int())+"</td></tr>");
        
        }

        , addBuyButton : function() {
            var html ='<td colspan="5" align="center"><br><input name="buybut" type="submit" value="Buy Weapons" onclick="document.buyform.buybut.value="Buying.."; document.buyform.buybut.disabled=true; document.buyform.submit();"><br><br></td>';         

            $("#buy_weapons_form>tbody>tr").eq(1).before("<tr>"+html+"</tr>");
        }
        
        , sabLogs_update : function(weapList) {
            weapList = ';'+weapList;    //this is hack is important because of "shield" vs "invis shield"

            var d = new Date()
            var time = "" + d.getTime() + "";

            var old_weapList = db.get('lux_weaponList', '');
            old_weapList = old_weapList.split(';');
            var losses = '';
            $(old_weapList).each(function (i,e) {
                if (e) {
                    var weapName = e.split(':')[0];
                    var old_weapCount = parseInt(e.split(':')[1].replace(/[^0-9]/g,''), 10);
                    
                    //notice we search for weapName after a semi-colon, explaining prev hack.
                    var new_weapCount = parseInt(textBetween(weapList, ';'+weapName+':', ':').replace(/[^0-9]/g,''), 10);
                    
                    if (old_weapCount > new_weapCount) {
                        losses += (old_weapCount-new_weapCount) +":"+weapName +":"+time+";";
                    }
                    //handle if it is no longer in the list
                    if (weapList.indexOf(';'+weapName+':')== -1) {
                        losses += (old_weapCount) +":"+weapName+":"+time +";";
                    }
                }
            });
            
            if (losses !== '') {
                addCSS("#_lux_sabbed_popup {text-align:center;border-top: 5px solid red; border-left: 5px solid red; border-right: 5px solid darkred; border-bottom: 5px solid darkred;position:fixed;right:10px;bottom:10px;width:auto;}");

                var arr = losses.split(';');
                var i=0;
                var h ="";
                for (i=0;i<=arr.length;i++) {
                    if(arr[i]){
                        var cols = arr[i].split(":");
                        h += "You have lost "+ cols[0] + " "+cols[1]+"s<br />";
                    }
                }

                
                
                
                $("body").append("<table id='_lux_sabbed_popup'><tbody><tr><th>Attention!</th></tr></tbody></table>");
                $('#_lux_sabbed_popup>tbody').append("<tr><td>"+h+"</td></tr>");
                
                
                var old_losses = db.get('lux_lostWeapons','');
                db.put('lux_lostWeapons', losses + old_losses);
            }
            db.put('lux_weaponList', weapList);
        }

        , sabLogs_init: function() {
            $("#military_effectiveness").before('<table id="_lux_sabbed" class="table_lines" width="100%" cellspacing="0" cellpadding="6" border="0"></table>');
            $("#buy_weapons_form").before('<table id="_lux_upgrades" class="table_lines" width="100%" cellspacing="0" cellpadding="6" border="0"></table>');
            this.sabLogs_display();
        }
        
        , sabLogs_display: function() {
            var losses = db.get('lux_lostWeapons','').split(';');
            var i;
            $("#_lux_sabbed").html('<table class="table_lines" width="100%" cellspacing="0" cellpadding="6" border="0"><tbody><tr><th colspan=2>Lost Weapons Log </th></tr><tr><td colspan=2 style="border-bottom:none"><div id="lux_sablogs_2"></div></td></tr></tbody></table>');
            $("#lux_sablogs_2").html('<table width="100%" cellspacing="0" cellpadding="6" border="0"><tbody></tbody></table>');
            
            for (i=0;i<5;i++) {
                if(losses[i]){
                    var cols = losses[i].split(':');
                    $("#lux_sablogs_2>table>tbody").append("<tr><td>"+cols[0]+" "+cols[1]+"s</td><td align=right>"+timeElapsed(cols[2])+"</td></tr>");
                }
            }
            $("#lux_sablogs_2>table>tbody").append("<tr><td>(<a id='viewSablog'>View All</a>)</td><td>(<a id='clearSablog'>Clear</a>)</td></tr>");
            $("#clearSablog").click(function() { sabLogs_clear();});
            $("#viewSablog").click(function() { sabLogs_viewAll();});
        }
        
        , sabLogs_clear: function() {
            db.put("lux_lostWeapons",'');
            $("#lux_sablogs_2>table>tbody>tr>td").parent().remove();
        }
        
        , sabLogs_viewAll : function() {
            $("#lux_sablogs_2").css("overflow-y","scroll");
            $("#lux_sablogs_2").css("height","180px");
            var losses = db.get('lux_lostWeapons','').split(';');
            $("#lux_sablogs_2>table>tbody>tr>td").parent().remove();
            
            var i;
            for (i=0;i<losses.length;i++) {
                if(losses[i]){
                    var cols = losses[i].split(':');
                    $("#lux_sablogs_2>table>tbody").append("<tr><td>"+cols[0]+" "+cols[1]+"s</td><td align=right>"+timeElapsed(cols[2])+"</td></tr>");
                }
            }
            $("#_lux_sabbed>table>tbody").append("<tr><td>(<a id='viewSablogLess'>View Less</a>)</td><td>(<a id='clearSablog'>Clear</a>)</td></tr>");
            $("#clearSablog").click(function() { sabLogs_clear();});
            $("#viewSablogLess").click(function() { sabLogs_display();});
        }

        , armory_aat: function() {
            var sellVal = 0;
            $("input[name='doscrapsell']").each(function(i,e) {
                var row = $(e).parents("tr").eq(1);        
                var qty = to_int($(row).children("td").eq(1).text());
                var cost = to_int($(e).val());
        
                sellVal += qty*cost;
            });
            var retailValue = sellVal*10/7;
            
            
            $("input[name='doscrapsell']").each(function(i,e) {
                var row = $(e).parents("tr").eq(1);        
                var cost = to_int($(e).val());
                $(row).children("td:eq(0)").append(" (" + Math.floor(retailValue / 400 / (cost*10/7)) + " aat)");
            });        
            
            $("table.table_lines:eq(0)>tbody>tr:eq(0)>th").append(" (Total Sell Off Value: "+ addCommas(sellVal)+" Gold)");
        }
        
        , armory_upgradeSuggestions: function(User) {
            var bpms, chars, skins, ivs, da_bonus, sa_bonus, da_bonus_new, sa_bonus_new, sa_cost, da_cost, da_sellRow, sa_sellRow;
            var gold = User.gold;
            function get_da(fort){
                var cb = 0;
                if (fort == "Camp") cb = 0;
                if (fort == "Stockade") cb = 1;
                if (fort == "Rabid") cb = 2;
                if (fort == "Walled") cb = 3;
                if (fort == "Towers") cb = 4;
                if (fort == "Battlements") cb = 5;
                if (fort == "Portcullis") cb = 6;
                if (fort == "Boiling Oil") cb = 7;
                if (fort == "Trenches") cb = 8;
                if (fort == "Moat") cb = 9;
                if (fort == "Drawbridge") cb = 10;
                if (fort == "Fortress") cb = 11;
                if (fort == "Stronghold") cb = 12;
                if (fort == "Palace") cb = 13;
                if (fort == "Keep") cb = 14;
                if (fort == "Citadel") cb = 15;
                if (fort == "Hand of God") cb = 16;
                //cb = Math.pow(1.25,cb);
                //cb = Math.round(cb*1000)/1000;
                return cb;
            }

            function get_sa(siege){
                var cb = 0;
                if (siege == "None") cb = 0;
                if (siege == "Flaming Arrows") cb = 1;
                if (siege == "Ballistas") cb = 2;
                if (siege == "Battering Rams") cb = 3;
                if (siege == "Ladders") cb = 4;
                if (siege == "Trojan") cb = 5;
                if (siege == "Catapults") cb = 6;
                if (siege == "War Elephants") cb = 7;
                if (siege == "Siege Towers") cb = 8;
                if (siege == "Trebuchets") cb = 9;
                if (siege == "Black Powder") cb = 10;
                if (siege == "Sappers") cb = 11;
                if (siege == "Dynamite") cb = 12;
                if (siege == "Greek Fire") cb = 13;
                if (siege == "Cannons") cb = 14;
                //cb = Math.pow(1.3,cb);
                //cb = Math.round(cb*1000)/1000;
                return cb;
            }


            var race = User.race;
            var da_race_factor = 1;
            var sa_race_factor = 1;
            if (race == "Dwarfs") 
                da_race_factor = 1.4;
            if (race == "Orcs") {
                da_race_factor = 1.2;
                sa_race_factor = 1.35;
            }

            var fort = $("form:nth-child(4) td:nth-child(1)").text();
            fort = fort.substr(0,fort.indexOf("("));
            var siege = $("form:nth-child(5) td:nth-child(1)").text();
            siege = siege.substr(0,siege.indexOf("("));
            
            var da_factor = get_da($.trim(fort));
            var sa_factor = get_sa($.trim(siege));


            
            var t = $("#military_effectiveness");
            var sa = to_int($(t).find("tbody>tr:eq(1)>td:eq(1)").text());
            var da = to_int($(t).find("tbody>tr:eq(2)>td:eq(1)").text());
        
            //sure this can be optimized but cba right now
            var saCost = new Array(40000,80000,160000,320000,640000,1280000,2560000,5120000,10240000,20480000,40960000,81920000,163840000,327680000);
            var daCost = new Array(40000,80000,160000,320000,640000,1280000,2560000,5120000,10240000,20480000,40960000,81920000,163840000,327680000,655360000,1310720000);

            sa_cost = saCost[sa_factor];
            da_cost = daCost[da_factor];
            
                sa_bonus = Math.pow(1.3,sa_factor);
                sa_bonus_new = Math.pow(1.3,sa_factor+1);
                da_bonus = Math.pow(1.25,da_factor);
                da_bonus_new = Math.pow(1.25,da_factor+1);
            
            var sell_ivs = Math.ceil((da_cost - gold) / 700000 );
            var sell_bpms = Math.ceil((sa_cost - gold) / 700000 );
            var sell_chars = Math.ceil((sa_cost - gold) / 315000 );
            var sell_skins = Math.ceil((da_cost - gold) / 140000 );
            
                var valPerBPM = sa_race_factor * 1000 * 5 * ((db.get("Tech",100) +1)/ 100) * (db.get("Offiebonus",100) / 100);
                var valPerCHA = sa_race_factor * 600 * 5 * (db.get("Tech",100) / 100) * (db.get("Offiebonus",100) / 100);
                var valPerIS = da_race_factor * 1000 * 5 * (db.get("Tech",100) / 100) * (db.get("Offiebonus",100) / 100);
                var valPerDS = da_race_factor * 256 * 5 * (db.get("Tech",100) / 100) * (db.get("Offiebonus",100) / 100);    
            
            var weaps = db.get('lux_weaponList');
            if (weaps.instr("Invisibility Shield"))
                ivs = to_int(textBetween(weaps,"Invisibility Shield:",":"));
            else
                ivs = 0;
            if (weaps.instr("Blackpowder Missile:"))
                bpms = to_int(textBetween(weaps,"Blackpowder Missile:",":"));
            else
                bpms = 0;
            if (weaps.instr("Chariot:"))
                chars = to_int(textBetween(weaps,"Chariot:",":"));
            else
                chars = 0;
            if (weaps.instr("Dragonskin:"))
                skins = to_int(textBetween(weaps,"Dragonskin:",":"));
            else
                skins = 0;
            
            
            var oldDa = Math.floor((valPerDS * skins + valPerIS *ivs) *da_bonus);
            var oldSa = Math.floor((valPerCHA * chars + valPerBPM *bpms) *sa_bonus);

            var newDa_skins = 0;
            var newDa_ivs = 0;
            var newSa_chars = 0;
            var newSa_bpms = 0;
            if (skins >= sell_skins) { 
                newDa_skins = valPerDS * (skins-sell_skins) + valPerIS *ivs;
                newDa_skins *= da_bonus_new;
                newDa_skins = Math.floor(newDa_skins);
            }
            if (ivs >= sell_ivs) {
                newDa_ivs = valPerDS *skins + valPerIS *(ivs-sell_ivs);
                newDa_ivs *= da_bonus_new;
                newDa_ivs = Math.floor(newDa_ivs);

            }
            
            if (chars >= sell_chars) {
                newSa_chars = valPerCHA *(chars - sell_chars) + valPerBPM*bpms;
                newSa_chars *= sa_bonus_new;
                newSa_chars = Math.floor(newSa_chars);

            } 
            if (bpms >= sell_bpms) {
                newSa_bpms = valPerCHA *(chars) + valPerBPM*(bpms-sell_bpms);
                newSa_bpms *= sa_bonus_new;
                newSa_bpms = Math.floor(newSa_bpms);
                
            }

            //DA first
            //Create thing with id ="_lux_armory_suggestions"
            var da_html = '<span style="color:red"> Not enough tools</span>';
            if (da_factor < 16) {
                da_sellRow = addCommas(da_cost);

                if (ivs >= sell_ivs) {
                    if (sell_ivs > 0)     
                        da_sellRow = addCommas(da_cost) + ' (Sell ' + addCommas(sell_ivs) + ' Invisibility Shields)';
                        
                    if (oldDa < newDa_ivs) 
                         da_html = addCommas(Math.floor(newDa_ivs)) + ' (<a style="color:green"><b>+</b></a>' + addCommas(Math.floor(Math.abs(newDa_ivs-oldDa))) + ')';
                    else 
                         da_html = addCommas(Math.floor(newDa_ivs)) + ' (<a style="color:red"><b>-</b></a>' + addCommas(Math.floor(Math.abs(newDa_ivs-oldDa))) + ')';
                }
                if (skins >= sell_skins) {
                    if (sell_skins > 0)     
                        da_sellRow = addCommas(da_cost) + ' (Sell ' + addCommas(sell_skins) + ' Dragonskins)';
                        
                    if (oldDa < newDa_skins) 
                         da_html = addCommas(Math.floor(newDa_skins)) + ' (<a style="color:green"><b>+</b></a>' + addCommas(Math.floor(Math.abs(newDa_skins-oldDa))) + ')';
                    else 
                         da_html = addCommas(Math.floor(newDa_skins)) + ' (<a style="color:red"><b>-</b></a>' + addCommas(Math.floor(Math.abs(newDa_skins-oldDa))) + ')';
                } 
            }
            
            //SA second
            var sa_html = '<span style="color:red"> Not enough tools</span>';
            if (sa_factor < 14) {
                 sa_sellRow = addCommas(sa_cost);
                
                if (bpms >= sell_bpms) {
                    if (sell_bpms > 0)    
                        sa_sellRow = addCommas(sa_cost) + ' (Sell ' + addCommas(sell_bpms) + ' Blackpowder Missles)';
                        
                    if (newSa_bpms > oldSa) 
                        sa_html = addCommas(newSa_bpms) + ' (<a style="color:green"><b>+</b></a>' + addCommas(Math.floor(Math.abs(oldSa-newSa_bpms))) + ')';
                    else 
                        sa_html = addCommas(newSa_bpms) + ' (<a style="color:red"><b>-</b></a>' + addCommas(Math.floor(Math.abs(oldSa-newSa_bpms))) + ')';
                } 
                if (chars >= sell_chars) {
                    if (sell_chars > 0)     
                        sa_sellRow = addCommas(sa_cost) + ' (Sell ' + addCommas(sell_chars) + ' Chariots)';
                        
                    if (newSa_chars > oldSa) 
                        sa_html = addCommas(newSa_chars) + ' (<a style="color:green"><b>+</b></a>' + addCommas(Math.floor(Math.abs(oldSa-newSa_chars))) + ')';
                    else 
                        sa_html = addCommas(newSa_chars) + ' (<a style="color:red"><b>-</b></a>' + addCommas(Math.floor(Math.abs(oldSa-newSa_chars))) + ')';
                }
            }    
            
            $("#_lux_upgrades").html('<table class="table_lines" width="100%" cellspacing="0" cellpadding="6" border="0"><tbody><tr><th colspan="2">Upgrade Suggestions</th></tr></tbody></table>');
            var temp = $("#_lux_upgrades>tbody");
            temp.append("<tr><td><b>Current Fortifications:</b></td><td align='right'>"+fort+" (" + da_factor + ")</td></tr>");
            if(da_factor<16) {
                temp.append("<tr><td>Upgrade Cost:</td><td align='right'>"+da_sellRow+"</td></tr>");
                temp.append("<tr><td>Estimated new DA</td><td align='right'>"+da_html+"</td></tr>");
            } else
                temp.append("<tr><td colspan=2>There are no more upgrades</td></tr>");
                
            temp.append("<tr><td><b>Current Siege:</b></td><td align='right'>"+siege+" (" + sa_factor + ")</td></tr>");
            if (sa_factor<14) {
                temp.append("<tr><td>Upgrade Cost:</td><td align='right'>"+sa_sellRow+"</td></tr>");
                temp.append("<tr><td>Estimated new SA</td><td align='right'>"+sa_html+"</td></tr>");
            } else
                temp.append("<tr><td colspan=2>There are no more upgrades</td></tr>");
            
        }
        
}

Page.attack = {

    run : function() {
    
            this.getSabInfo();
            this.checkCap();
    }
    
    , getSabInfo : function () {
        var userid = document.URL.substr(document.URL.indexOf('=')+1, 7);
        if (userid == "http://") {
            var getopponent = document.getElementsByName('defender_id');
            userid = getopponent[0].value;
        }
        

        addCSS(".sabbable>span { border-bottom:thin dotted white;}");
        $(".personnel").before("<table id='lux_sabbable' class='table_lines' width='100%' cellpadding='6' cellSpacing='0'><th colspan='3'>LuXBot Info - Sabbable<span style='float:right;'><a href='http://www.kingsofchaos.com/intelfile.php?asset_id="+userid+"'>(Logs)</a></span></th></table>");
    
        

        $("input[name='numsab']").after("&nbsp;<input type='button' id='bumpup' value='+1' />");
        $("#bumpup").click(function() {
            $("input[name='numsab']").val($("input[name='numsab']").val().int() + 1);
        });
        
        getLux('&a=getsab2&userid=' + userid,
            function(responseDetails) {
                var i;
                if (responseDetails.responseText == '403') {
                    $("#lux_sabbable").append('<td colspan="2" style="font-weight:bold;text-align:center;">Access denied</td>');
                } else if (responseDetails.responseText == 'N/A') {
                    $("#lux_sabbable").append('<td colspan="2" style="font-weight:bold;text-align:center;">No data available</td>');
                } else if (responseDetails.responseText.indexOf('<') > -1) {
                    $("#lux_sabbable").append('<td colspan="2" style="font-weight:bold;text-align:center;">Server Error. Contact Admin.</td>');
                } else {
                    var rt = responseDetails.responseText;
                    var sabInfo = parseResponse(rt, "sabinfo");
                    var hilight = parseResponse(rt, "hilight");
                    var userInfo = sabInfo.split(';');

                    for (i = 0; i < userInfo.length-1; i+=2) {
                        var builder = '<tr><td class="sabbable">';
                        if (! isNaN(userInfo[i].charAt(0)))
                            builder += '<span>'+userInfo[i]+'</span>';
                        else
                            builder += userInfo[i];
                        builder += '</td><td class="sabbable"><span>'+userInfo[i+1]+"</span></td></tr>";
                        
                         $("#lux_sabbable").append(builder);
                    }

                    if (hilight.length > 0)
                        $("#lux_sabbable").find("td").eq(hilight).css("border","1px solid #00FF66");
                    
                    $(".sabbable>span").click(function(e) {
                        var t = $(e.target).text();
                        t = t.trim().split(" ");
                        var count = t.shift();
                        var weap = t.join(" ");
                        weap = weap.substr(0,weap.length-1);//take off last "s"

                        var val = $("option[label='"+weap+"']").val();
                        $("select[name='enemy_weapon']").val(val);
                        $("input[name='numsab']").val(count);
                        $("input[name='numspies']").val('1');
                        $("select[name='sabturns']").val('5');
                    });
                }
            });
    }
    
    , checkCap: function() {
        var getopponent = document.getElementsByName('defender_id');
        var userid = getopponent[0].value;
        //alert(userid);
        
        if (document.body.innerHTML.indexOf('Your opponent has already suffered heavy losses today') != -1) {
            var data = userid;
            postLux('&a=logcap','targetID='+userid,function(){});
        }
    }
}

    //Attack Logs
Page.attacklog = {
    run : function() {
        //send entire attacklog to lux
        var defendedRows = $("td.content > table.attacklog > tbody > tr");
        this.attackLogHelper(defendedRows,0);
        
        var $attackRows = $("td.content > p > table.attacklog > tbody > tr");
        this.attackLogHelper($attackRows, -1);
    }
    

    , attackLogHelper: function ($rows, shift ) {
        // TODO: TEST THIS
        function betweenTags (x) {
		//eg broken..
			var text = '<' + x.html();
            var y = textBetween($(text).text(), ">","<");
			log (x + ".." + y);
			x = y;
			return y;
        }
        
		
        for (var i = 2; i < $rows.size()-1; i++) {
			
            var rawData = $rows.eq(i).html().split("<td");
            //alert(rawData[3]);
            //this removes the junk to get value (ie. align="right">2</td> becomes 2)
            var enemy_id;
            var enemy;
            if (rawData[3].indexOf("not active") == -1) {
                enemy_id = rawData[3].match(/id=(\d*)"/)[1];
                enemy = rawData[3].match(/\d">(.+)<\/a>/)[1];
            } else {
                enemy_id = "";
                enemy = rawData[3].match(/">(.+)\(not active/)[1];
            }
            var logid = rawData[5+shift].match(/id=(\d*)"/)[1];
            var goldTemp = rawData[5+shift].match(/">([\d,]*) Gold/);
            var gold;
            if (goldTemp== null)
                gold = "defended";
            else 
                gold=goldTemp[1];

            rawData = _.map(rawData, betweenTags );
            var time = rawData[1];
            var timeunit = rawData[2];
            var type = rawData[4];
            var enemy_losses = rawData[6+shift];
            var your_losses = rawData[7+shift];
            var enemy_damage = rawData[8+shift];
            var your_damage = rawData[9+shift];
                
            //alert(your_damage);
            
            time = timeToSeconds(time,timeunit);
            if(!enemy_id)
                enemy_id=":invalid";//DONATO, Check this before release

            if(type.indexOf("attack")!=-1 || type.indexOf("raid")!=-1)    //this seems contradictory but it makes sense
                type="defend";
            else
                type="attack";
                
            //alert('time: ' + time + ' :: enemy: ' + enemy + ' :: gold: ' + gold + ' :: enemy_losses: ' + enemy_losses + ' :: your_losses: ' + your_losses + ' ::  enemy_damage: ' + enemy_damage + ' :: your_damage: ' + your_damage + ' :: logid: ' + logid);
            sendAttackLogDetails(User.kocnick, type, enemy_id, enemy, your_damage, enemy_damage, your_losses, enemy_losses, gold, logid, time);
        }
    }

 }
    
    //
    // Command Center Functions
    //
Page.base = {
    run: function() {
        this.basePage();
        this.baseLayout();
        this.commandCenterStats();
        makeCollapsable(action);
    }
    
    , commandCenterStats: function() {
        var $tbody = $("#tbody");

        if (checkOption('option_commandCenterStats'))
            $tbody.prepend("<tr id='ff-stats'><td colspan='2'><table class='table_lines' cellpadding=6 width='100%'><tbody><tr><th colspan='2' align='center'>Your Statistics</th></tr><tr><td id='ff-load'></td></tr></tbody></table></td></tr>");//prepend(tab);
        else
            $("tr:contains('Recent Attacks'):last").parent().parent().before("<table class='table_lines' cellpadding=6 width='100%'><tbody><tr><th colspan='2' align='center'>Your Statistics</th></tr><tr><td id='ff-load'></td></tr></tbody></table>");//prepend(tab);
            getLux("&a=sabstats",
             function(r) { $("#ff-load").html(""+r.responseText); 
        }); 
    }

    , baseLayout: function() {
        var $tbody = $("td.content > table > tbody").last()
        $tbody.attr("id","tbody");
        
        var $cols = $tbody.children("tr").children("td")
        $cols.children("br").remove()
        
        $cols.first().attr("id", "base_left_col")
        $cols.last().attr("id", "base_right_col")
        
        var $military_overview = getTableByHeading("Military Overview")
                        .addClass("military_overview")
                        .remove()
        var $military_effectiveness = getTableByHeading("Military Effectiveness")
                        .addClass("military_effectiveness")
                        .remove()
        var $personnel = getTableByHeading("Personnel")
        var $user_info = getTableByHeading("User Info")
                        .addClass("user_info")
        var $recent_attacks = getTableByHeading("Recent Attacks on You")
                        .addClass("recent_attacks")
                        .remove()
        var $commander_notice = getTableByHeading("Notice from Commander")
                        .addClass("commander_notice")
                        .remove()
        var $grow_army = getTableByHeading("Grow Your Army")
                        .addClass("grow_army")
                        .remove()
        var $officers = getTableByHeading("Officers")
                        .remove()
        $("#base_right_col").prepend($military_overview )
        $("#base_right_col").prepend($officers )
        $("#base_right_col").prepend($military_effectiveness )
        $("#base_left_col").append($recent_attacks )
        // $("#base_left_col").append($grow_army ) // Causes errors?
        $(".user_info").after($commander_notice)
        
        //if player is blocking ads, this adds some extra space.
         $("td.content").parent().children("td").eq(2).attr("width", "50");
    }
      
    , basePage: function() {
        db.put('race', textBetween($("head>link").eq(3).attr("href"),"css/",".css"));

        var stable = $("table:contains('Military Effectiveness')").last();
        var sa = $(stable).find("tr:contains('Strike Action'):first>td:eq(1)").text();
        var da = $(stable).find("tr:contains('Defensive Action'):first>td:eq(1)").text();
        var spy = $(stable).find("tr:contains('Spy Rating'):first>td:eq(1)").text();
        var sentry = $(stable).find("tr:contains('Sentry Rating'):first>td:eq(1)").text();

        
        stable = $("table:contains('Military Overview')").last();
        var fort = $(stable).find("tr:contains('Fortification'):first>td:eq(1)").text();
        var siege = $(stable).find("tr:contains('Siege Technology'):first>td:eq(1)").text();
        var economy = $(stable).find("tr:contains('Economy'):first>td:eq(1)").text();
        var technology = $(stable).find("tr:contains('Technology'):last>td:eq(1)").text();
        var conscription = $(stable).find("tr:contains('Conscription'):first>td:eq(1)").text();
        conscription = conscription.substr(0, conscription.indexOf(' soldiers'));
        var tff = $("body").find("tr:contains('Total Fighting Force'):last>td:eq(1)").text();
        var turns = $(stable).find("tr:contains('Game Turns'):first>td:eq(1)").text();
        turns = turns.substr(0,turns.indexOf(" /"));
        var covertlevel = $(stable).find("tr:contains('Covert Level'):first>td:eq(1)").text();
        var income = $(stable).find("tr:contains('Projected Income'):first>td:eq(1)").text();
        income = income.substr(0,income.indexOf(" Gold")).int();

        var officers = Page.stats.stats_getOfficers(false);

        var bonus = textBetween($(".officers>tbody>tr:last").text(), "(x ",")");
        
		// this will help for paging through officers and recording their info
       // nav();
        
        db.put('sa',sa);
        db.put('da',da);
        db.put('spy',spy);
        db.put('sentry',sentry);
        db.put('income',income + "");
        db.put('tff',tff);
        
        logBase(sa.int() + ";"+da.int()+";"+spy.int()+";"+sentry.int(), fort+";"+siege+";"+economy+";"+technology+";"+conscription.int()+";"+turns.int()+";"+covertlevel+";"+bonus, officers);
    }
}

    //
    // BATTLEFIELD
    //
Page.battlefield = {

    run: function() { 
        this.battlefieldAct();
        this.showUserInfoB();
    }
    
    , battlefieldAct: function () {
        var $playerRows = $("tr.player");
         
        var missedGold = this.bf_logGold($playerRows);
        this.bf_showGold(missedGold);
        this.bf_needsRecon($playerRows);
        this.bf_online($playerRows);
        
        var $nav = $("tr.nav")
        if ($nav.size()) {
            var q = $nav.find('a');
            q.on("click", this.battlefieldAct);
            if (q.size() > 1) {
                $(q[1]).on('click', this.battlefieldAct);
                q[1].accessKey = 'c';
                q[0].accessKey = 'x';
            } else {
                if (q[0].innerHTML.indexOf('lt') !== -1) {
                    q[0].accessKey = 'x';
                } else {
                    q[0].accessKey = 'c';
                }
            }
        }
    }
    
    , bf_logGold: function (users) {
    //name,userid,gold,rank,alliance,Tff

        var unscannedGold ='';
        var logstr = '';
        $(users).each(function(index, row) {
        
            var userid= $(row).attr("user_id");
            if (userid) {
                
                var x = $(row).find("td");
                
                var name = remove_delimiters($(x[2]).text());
                var tff  = to_int($(x[3]).text());
                var rank = to_int($(x[6]).text());
                var alliance = remove_delimiters($.trim($(x[1]).text()));
                var gold = to_int($(x[5]).text());
                
                if(gold === '')
                    unscannedGold += userid + ";";
                    
                if (name == User.kocnick && User.logself === 0)
                    gold = '';
                                
                var temp = name + ":" + userid + ":" + gold + ":" + rank + ":" + alliance + ":" + tff +";";
                
                logstr+= temp;
            }
        });
            
        if (logstr !== '') {
            postLux('&a=loggold','&g=' + logstr ,
                function(responseDetails) {
                    log("Response: "+responseDetails.responseText);
                });
        }
        return unscannedGold;
    }
    
    , bf_showGold: function (userstr) {
        if (userstr === "")
            return;
            
        //cut off trailing comma
        userstr = userstr.slice(0, -1);
        
        
        getLux('&a=loggold&u=' + userstr,
            function(r) {
                //log(r.responseText);
                var players = r.responseText.split(';');
                $(players).each(function(index, val) {
                    if (val !== '') {    
                        var info = val.split(":");
                        var GoldTd = $("tr[user_id='"+info[0]+"'] > td").eq(5);
                        GoldTd.text( info[1] + ' Gold, ' + info[2]);
                        GoldTd.css("color","#aaaaaa");
                        GoldTd.css("font-style","italic");

                    }
                });
        });
    }
        
    , bf_needsRecon: function ($pRows) {
        addCSS(" ._lux_needs_update {position:absolute; padding-left:12px;}");
        
        var kocids = '';
        $pRows.each(function() {
            kocids += textBetween($(this).children('td').eq(2).html(),'id=','">')+",";
        });
        kocids = kocids.slice(0,-1);
        if (kocids === '') {
            return;
        }
        
        var page = textBetween($(".battlefield>tbody>tr").last().text(), 'page ', ' of'); 
        var ppx = (page-1)*20+1;


        getLux('&a=bf_needsrecon&u=' + kocids,
            function(r) {
                //log(r.responseText);
                var i, s, id, rank, name;
                var players = r.responseText.split(';');
                
                for (i = 0; i < players.length; i++) {
                    if (players[i] === '') {
                        continue;
                    }
                    s = players[i].split(':');
                    id = s[0];
                    rank = s[1];
                    name = s[2];
                    $(".battlefield>tbody>tr.player[user_id='"+id+"']").children("td").eq(2).append('<a href="http://www.kingsofchaos.com/attack.php?id='+id+'"><img title="Stats are out of date" class="_lux_needs_update" src="http://www.luxbot.net/bot/img/luxupdate.gif" /></a>');
                }
            });
    }
    
    , bf_online: function (users) {

        var kocids = '';
        $(".battlefield>tbody>tr.player").each(function() {
            kocids += textBetween($(this).children('td').eq(2).html(),'id=','">')+",";
        });
        
        kocids = kocids.slice(0,-1);
        if (kocids === '') 
            return;

        var page = textBetween($(".battlefield>tbody>tr").last().text(), 'page ', ' of'); 
        var ppx = (page-1)*20+1;

        addCSS(" ._lux_online {position:absolute; right:240px;}");

        getLux('&a=bf_online&u=' + kocids,
            function(r) {
                //log(r.responseText);
                var players = r.responseText.split(';');
                var i;
                for (i = 0; i < players.length; i++) {
                    if (players[i] === '') {
                        continue;
                    }
                    var s = players[i].split(':');
                    var id = s[0];
                    var rank = s[1];
                    var name = s[2];
                    $(".battlefield>tbody>tr.player").eq(rank-ppx).children("td").eq(2).append(' <sup style="color:0066CC">Online</sup>');
                }
            });
    }    
    
    
    , battlefieldShowInfo: function (data) {
        // Hack to get the element to write into
        var $container = $("tr.profile").find("form[action='writemail.php']").closest("tbody");
        // if (!$container || $container.size() ==0) {
            // setTimeout( function() {battlefieldShowInfo(data);}, 200)
            // return
        // }
        
        $("tr.bf_inject").remove();
        
        if (data == '403') {
            $container.prepend('<tr class="bf_inject"><td colspan="4" style="font-weight:bold;text-align:center;background-color:#B4B5B4;color:#181818;border-bottom:1px solid black;padding:5px 0 5px 10px;">Access denied</td>');
        } else if (data == 'N/A') {
             $container.prepend('<tr class="bf_inject"><td colspan="4" style="font-weight:bold;text-align:center;background-color:#B4B5B4;color:#181818;border-bottom:1px solid black;padding:5px 0 5px 10px;">No data available</td>');
        } else {
            var userInfo = data.split(';');
            var i;

            for (i = 4 ; i >=0; i--) {
                var stat = userInfo[i*2]
                var time = userInfo[i*2+1]
                
                $container.prepend("<tr class='bf_inject><td style='font-weight:bold'>"+statsdesc[i]+"</td><td>"+stat+"</td><td class='_luxbotago'>"+time+"</td></tr>")
            }
        }
    }
  
    , showUserInfoB: function () {
        $("a.player").on('click', function(event) {
            if (String(event.target).indexOf('stats.php') > -1) {
                var userid = String(event.target).substr(String(event.target).indexOf('=')+1, 7);
                if (previd == userid) {
                    previd=0;
                    return;
                }
                previd = userid;
                getLux('&a=getstats&userid=' + userid,
                    function(responseDetails) {
                        var r = responseDetails.responseText;
                        this.battlefieldShowInfo(r);
                });
            }
        });
    }

}

    //
    // Conquest Page Functions
    //
Page.conquest = {
    run: function() {
    
        function doConquest() {
          // Need approval from Ta- for this.
            // var count = 1 + to_int($("#wCount").text());
            // $("#wCount").text('Wizards (x'+count+')');
            // post("http://www.kingsofchaos.com/conquest.php",
                // "conquest_target=Wizards&conquest=Go+on+a+conquest+against+Wizards%21&hash=",false);

            $("tr:contains('Wizards')").last().find("input[type='submit']").click();//last().submit();
        }
        
        if ($("table.table_lines>tbody>tr").size() > 10) {
            $("table.table_lines>tbody>tr:eq(2)").before("<tr><td id='wCount'>Wizards (x0)</td><td align='right'>1,000,000,000</td><td align='center'><button style='width:90%' id='doCon'>Go on a conquest against Wizards!</button></td></tr>");
            $("#doCon").click(doConquest);
        }
    }
    
}
    
  

Page.detail = {

    run: function() {
        this.showBattleLog();
        // Gold Update on attacks 
        this.processAttackLogDetail();
    }

    
    , showBattleLog : function() {
        var i;
        var a = db.get('battlelog', 0);
        if (a === 0) {
            return;
        } else if (a === 2 || a === 1) {
            var table;
            var q = document.getElementsByTagName('td');
            for (i = 0; i < q.length; i++) {
                if (q[i].className.indexOf('report') != -1) {
                    table = q[i];
                    break;
                }
            }
            
            for (i = 0; i < table.childNodes.length; i++) {
                if (table.childNodes[i].nodeName != '#text') {
                    table.childNodes[i].style.display = 'block';
                }
            }
            
            document.getElementsByClassName('battle')[0].className += '2';
            
            var dummyTable = document.body.appendChild(document.createElement('table'));
            dummyTable.className = 'battle';
            dummyTable.style.display = 'none';
            dummyTable.style.height = document.body.scrollTop;
            window.addEventListener(
                'scroll',
                function () {
                  dummyTable.style.height = document.body.scrollTop;
                },
                false);
        } else if (a == 3) {
            if (document.URL.indexOf('suspense') != -1) {
                document.location = document.URL.substr(0, document.URL.indexOf('suspense'));
            }
        }
    }
	
    , processAttackLogDetail : function() {
        var gold_stolen, attack_id;

        //send specific attack to Lux
        var attackReport = $("td.report:first").text();
            
        if (attackReport.indexOf('counter-attack') == -1) {
            //TODO:: Write
            //processDefendLog();
            return;
        }
        
        var your_damage = textBetween(attackReport, 'Your troops inflict',' damage on the enemy!');
        var enemy_damage = textBetween(attackReport, 'counter-attack and inflict ', ' damage on your army!');
        var enemy_name = attackReport.match(/As (.*)'s army runs from the/);
            enemy_name = enemy_name[1];
        var your_losses = textBetween(attackReport, 'Your army sustains ', ' casualties');

        var enemy_losses = textBetween(attackReport, 'The enemy sustains ', ' casualties');

        var enemy_id = $("form > input [name='id']").val();
        enemy_id = textBetween(attackReport, 'name="id" value="', '"');
        enemy_id = $("input[name='id']").val();
        
        if (attackReport.indexOf('You stole') == -1)
            gold_stolen = 'defended';
        else
            gold_stolen = textBetween(attackReport, 'You stole ', ' gold');
        
        if (document.URL.indexOf('&') == -1)
            attack_id = document.URL.substring(document.URL.indexOf('attack_id=')+10);
        else
            attack_id = document.URL.substring(document.URL.indexOf('attack_id=')+10,document.URL.indexOf('&'));

        sendAttackLogDetails(User.kocnick, "attack", enemy_id, enemy_name, your_damage, enemy_damage, your_losses, enemy_losses, gold_stolen, attack_id, 'now');
    }
}
  

Page.inteldetail = {

    run: function() {
        this.processIntelLog();
    }

    , processSabLog : function() {
        var sabtext = $("td.content").text();
        if (sabtext.indexOf('Your spies successfully enter') == -1) {
          //turned illegal
          //  history.back();
            return;
        }
        
        var player = sabtext.between("successfully enter ", "'s armory");
        var amount = sabtext.between("and destroy ", " of the enemy's");
        var weapon = sabtext.between("of the enemy's ", " stockpile.");
        var logid = String(document.location).substr(String(document.location).indexOf('=')+1);
        getLux('&a=logsab&target=' + player + '&weapon=' + weapon + '&amount=' + amount + '&logid=' + logid,
            function(responseDetails) {
                //log(responseDetails.responseText);
            });
    }
    
    , processIntelLog : function()  {
        //proccess recons and sabotages

        var text = $("td.content").text()
        
        //notice for sabotages it says "your spies" for recon "your spy"
        if (text.indexOf('Your spy') == -1) {
            this.processSabLog();
            return;
        }

        if (text.indexOf('As he gets closer, one of the sentries spots him and sounds the alarm.') != -1) {
            //now illegal
            //history.back();
            return;
        }

        
        var enemy = text.between("your spy sneaks into ","'s camp");
        var enemyid = $("input[name='id']").val()
        var logid = String(document.location).substr(String(document.location).indexOf('=')+1);
        
        var rowsToGrab = ["Mercenaries", "Soldiers",
                        "Strike Action", "Defensive Action", "Spy Rating", "Sentry Rating",
                        "Covert Skill", "Covert Operatives", "Siege Technology", "Attack Turns",
                        "Unit Production"]
                        
        var data = []
        _.map(rowsToGrab, function (str) {
            var temp = getRowValues(str);
            data = data.concat(temp)
        });
        data = data.join(";")

        var stable = $("table:contains('Treasury')").last();
        var gold = to_int($(stable).find("tr>td").text());
        
        
        stable = $("table:contains('Weapons')").last();
        var weap_rows = $(stable).find("tbody>tr>td").parent();
        var weapons = "";
        $(weap_rows).each(function(i,e) {
            var r = $(e).text().split("\n");
            var g = r[1].trim()+":"+r[2].trim()+":"+r[3].trim()+":"+r[4].trim();
            weapons += g +";";
        });        
        logRecon(enemy, enemyid, logid, gold, data, weapons)
    }

}

Page.mercs = {

    run: function() {
        rows = $("form").find("table>tbody>tr");
        Buttons.btn_init(rows, 4, 1, 2);
    }
	
    
}

    //
    // Stats Page Functions
    //
Page.stats = {   

    run: function() {
        this.statsPage();
        this.collapseAllianceInfoS();
        this.showUserInfoS();
        this.addStatsPageButtons();
        this.statsOnlineCheck();
    }
    
    , statsPage: function() {
        var enemyid = document.URL.split(/[=&?]/)[2];
        if (document.body.innerHTML.indexOf('Invalid User ID') != -1) {
            logStats('', enemyid, '', '','', 'invalid', '');
        } else {
            var stable = $("table:contains('User Stats')").last();
            
            var name = $(stable).find("tr:contains('Name:'):first>td:last").html().trim();
            var comid = $(stable).find("tr:contains('Commander:')>td:last").html().trim();
            comid = textBetween(comid,'id=','"');
            var race = $(stable).find("tr:contains('Race:')>td:last").html().trim();
            var rank = $(stable).find("tr:contains('Rank:'):first>td:last").html().trim();
            var highest_rank = $(stable).find("tr:contains('Highest Rank:')>td:last").html().trim();
            var tff = to_int($(stable).find("tr:contains('Army Size:')>td:last").html().trim());
            var morale = $(stable).find("tr:contains('Army Morale:')>td:last").text().trim();
            var chain = $(stable).find("tr:contains('Chain Name:')>td:last");
            if ($(chain).size() > 0)
                chain = $(chain).html().trim();
            else 
                chain = "";
                                 
            var treasury = $(stable).find("tr:contains('Treasury:')>td:last").html();
            if (treasury)
                treasury = to_int(treasury);
            else
                treasury = '';
            var fort = $(stable).find("tr:contains('Fortifications:')>td:last").html().trim();
            
            var officers = this.stats_getOfficers(false);
            var alliances = this.stats_getAlliances(stable);



            this.addIncomeCalc(race, tff);
            this.nav();
            logStats(name, enemyid, chain, alliances[0],alliances[1], comid + ";"+race+";"+rank+";"+highest_rank+";"+tff+";"+morale+";"+fort+";"+treasury, officers);
        }
    }
  
    , showUserInfoS: function() {
        var userid = document.URL.substr(document.URL.indexOf('=')+1, 7);


        $("#luxstats_reload").live("click",function() {
            this.updateUserInfoS(userid);
        });
        
        var offieTable = $("body").find("table:contains('Officers'):last");
        offieTable.parent().prepend("<table id='luxstats_info' class='table_lines' width='100%' cellPadding=6 cellSpacing=0><tbody></tbody></table><br />");
        
        $("#luxstats_info>tbody").html('<tr><th colspan="3">LuXBot Info<span id="luxstats_reload" style="cursor:pointer;color:pink;font-size:8pt;float:right">(reload)</span></th></tr>');
        
        this.updateUserInfoS(userid);
    }

    , updateUserInfoS: function(userid) {
            getLux('&a=getstats&userid=' + userid,
            function(responseDetails) {
                var i;
                var container = $("#luxstats_info");
                $(container).find(".statsrow").remove();
                if (responseDetails.responseText == '403') {
                    container.append('<td colspan="2" style="font-weight:bold;text-align:center;">Access denied</td>');
                } else if (responseDetails.responseText == 'N/A') {
                    container.append('<td colspan="2" style="font-weight:bold;text-align:center;">No data available</td>');

                } else {
                    var userInfo = responseDetails.responseText.split(';');

                    for (i = 0; i < 10; i+=2) {
                        if (userInfo[i]== '???') {
                            // alert(i);
                            container.append("<tr class='statsrow'><td>"+Constants.statsdesc[i/2]+"</td><td colspan=2>"+userInfo[i]+"</td></tr>");
                            // i++;
                        }
                        else
                            container.append("<tr class='statsrow'><td>"+Constants.statsdesc[i/2]+"</td><td>"+userInfo[i]+"</td><td class='_luxbotago'>"+userInfo[i+1]+"</td></tr>");
                    }
                    if (userInfo.length > 10)
                        container.append("<tr><td>"+userInfo[11]+"</td></tr>");
                }
            });
    }

    , collapseAllianceInfoS: function() {
        var nameRE = /User Stats<\/th>/ig;
        var q = document.getElementsByTagName('table');
        var statstable;
        var i;
        
        for(i = 0; i < q.length; i++){
            if(q[i].innerHTML.match(nameRE) && !q[i].innerHTML.match(/<table/)) {
                statstable = q[i];
                break;
            }
        }
        
        if (statstable === undefined) {
            return;
        }
       
        var allianceindex;
        for (i = 0; i < statstable.rows.length; i++) {
            if (statstable.rows[i].cells[0].innerHTML.indexOf('Alliances') > -1) {
                allianceindex = i;
                break;
            }
        }

        // alliance splitted
        var alliances = statstable.rows[allianceindex].cells[1].innerHTML.split(',');
        var pri_alliance = 'None';
        var sec_alliances = [];
        for (i = 0; i < alliances.length; i++) {
            if (alliances[i].indexOf('(Primary)') > -1) {
                pri_alliance = alliances[i];
            } else {
                sec_alliances[sec_alliances.length] = alliances[i];
            }
            continue;
        }
        statstable.rows[allianceindex].cells[0].innerHTML = '<b>Alliances (' + alliances.length + '):</b>';
        statstable.rows[allianceindex].cells[1].innerHTML = pri_alliance + '<br><div id="_luxbot_alliances">' + sec_alliances.join(', ') + '</div><a href="javascript:LuXBotShowAlliances();"> + Show Secondary</a>';
        addCSS('#_luxbot_alliances{display:none;visibility:hidden;}');
        addJS('function LuXBotShowAlliances(){var q = document.getElementById(\'_luxbot_alliances\');q.style.display = \'block\';q.style.visibility = \'visible\';q.nextSibling.href = \'javascript:LuXBotHideAlliances();\';q.nextSibling.innerHTML = \' - Hide Secondary\'}');
        addJS('function LuXBotHideAlliances(){var q = document.getElementById(\'_luxbot_alliances\');q.style.display = \'none\';q.style.visibility = \'hidden\';q.nextSibling.href = \'javascript:LuXBotShowAlliances();\';q.nextSibling.innerHTML = \' + Show Secondary\'}');
    }
    
    , addRequestRecon: function() {
        var getopponent = document.getElementsByName('defender_id');
        var data = getopponent[0].value;
        document.getElementById("_luxbot_requestRecon").disabled = true;
        document.getElementById("_luxbot_requestRecon").style.color = "gray";
        postLux('&a=reconrequest','kocid=' +data, function(r,debug) {
                if(r.responseText == 'OWK') {
                    alert('A request has already been sent.');
                } else if(r.responseText == 'OK') {
                    alert('Your request has been sent.');
                } else {
                    alert('Your request could not be sent, try again later!'+r.responseText);
                }
        });
    }
    
    , addIncomeCalc: function(race, tff) {
    
        var bonus = 1;        
        if(race == 'Humans') {
            bonus = 1.30;
        }
        if(race == 'Dwarves') {
            bonus = 1.15;
        }
        
        // var calBonus = Math.floor(tff*bonus);
        // var CalBonusInt = parseInt(calBonus);
        // var tffInt = parseInt(tff);
        // var calTbgMin = Math.floor(CalBonusInt + tffInt);
        // var CalHourTbg = Math.floor(calTbgMin * 60);
        var formattedTbg = addCommas(Math.floor(60* tff *bonus));
        
        var nameIC = /<td><b>Name:<\/b>/;
        var z = document.getElementsByTagName('table');
        var table;
        
         for(var i = 0; i < z.length; i++){
            if(z[i].innerHTML.match(nameIC) && !z[i].innerHTML.match(/<table/)) {
                table = z[i];
                break;
            }
        }
         
         var x = table.insertRow(10);
         x.insertCell(0).innerHTML = '<b>Estimated gold per Hour:<b>';
         x.insertCell(1).innerHTML = '(' + formattedTbg + ')';
    
    }

    , addStatsPageButtons: function() {
        // updated to avoid impact of end-of-age counter - tx Cinch for the assitance -- rolled back
        $("td.content>table>tbody>tr>td").children("table").eq(1).children("tbody").append('<tr><td align=center colspan=2><input style="width:100%;" type="button" name="_luxbot_requestRecon" id="_luxbot_requestRecon" value="Request Recon on User"></td><td align=center colspan=2><input style="width:100%;"  type="button" name="_luxbot_viewHistory" id="_luxbot_viewHistory" value="View Player History"></td></tr>');
        //$("td.content>p>table>tbody>tr>td").children("table").eq(1).children("tbody").append('<tr><td align=center colspan=2><input style="width:100%;" type="submit" name="_luxbot_requestRecon" id="_luxbot_requestRecon" value="Request Recon on User"></td><td align=center colspan=2><input style="width:100%;"  type="submit" name="_luxbot_viewHistory" id="_luxbot_viewHistory" value="View Player History"></td></tr>'); 
    
        $("#_luxbot_requestRecon").click(this.addRequestRecon);
        $("#_luxbot_viewHistory").click(function() {
            // updated to avoid impact of end-of-age counter - tx Cinch for the assitance
            var name = $("td.content > table > tbody> tr>td>table.table_lines>tbody>tr").eq(1).children("td").eq(1).text();
            //var name = $("td.content > p> table > tbody> tr>td>table.table_lines>tbody>tr").eq(1).children("td").eq(1).text(); 
            openTab("stats.luxbot.net/history.php?playerSearch="+name);
        });
    }

    , nav: function() {
        $("table.officers tr.nav a").click(function() {
            setTimeout(function() {
                statsPage();
            },100);
            nav();
        });
    }
    
    , stats_getOfficers: function(tolog) {
        var officers = "";
        var rows = $("table.officers>tbody>tr>td>a").parent().parent();
        $(rows).each(function(i,row) {
            if ( ! $(row).hasClass('nav')) {
                var offieInfo = $(row).find("td:eq(0)").html();
                officers += textBetween(offieInfo,"id=",'"') +";";
            }
        });
        
        //cut off trailing semicolon
        officers = officers.slice(0, -1);
        //alert(officers);
        // if (tolog==true)
            // sendLogDetails(username, name, userid, '', gold + ';' + rank + ';' + tff + ';' + chain + ';' + comid + '&morale='  + morale , '',officers, -1);

        return officers;            
    }

    , stats_getAlliances: function(stable) {
        var name, a
        var row = $(stable).find("tr:contains('Alliances:')>td:last").html();
        var allys = row.split('alliances.php?');
        
        var primary = ''
        var secondary = [];
        for (a in allys) {
            name = textBetween(allys[a],'id=','">');
            if (allys[a].indexOf('(Primary)') == -1) {
                if (name !== '') 
                    secondary[secondary.length] = name;
            }
            else 
                primary = name;
        }    
        return new Array(primary,secondary);
    }

    , statsOnlineCheck: function() {

        var userid = document.URL.split(/[=&?]/)[2];
        addCSS(" ._lux_online {position:absolute;}");

        //response in form of 
        //key=val\n
        //key=val\n
        getLux('&a=stats_online&u=' + userid,
            function(r) {
                var stable = $("table:contains('User Stats')").last();
                var tx = r.responseText;
            //alert("hello");
                if (parseResponse(tx, "online") !== '') {
                    $(stable).find("tr:contains('Name')").first().find("td:eq(1)").append('&nbsp;<img title="Player is online"  class="_lux_online" src="http://www.luxbot.net/bot/img/online2.gif" />');
                }
                
                var msg = parseResponse(tx, "message");
                if (User.kocid == userid) {
                    //if it is the users stats page, allow them to update
                    $(stable).find("tr:contains('Fortifications')").after("<tr><td colspan=2><center><textarea id='aaa' style='width:360px;height:100px;'>"+msg+"</textarea><br /><input type='button' value='Update' id='lux_updateMessage' /></center></td></tr>");
                    $("#lux_updateMessage").click(function() {
                        postLux('&a=set_message', '&msg=' + $("#aaa").val());                    
                    });
                }
                else {
                    if (msg !== '') {
                        $(stable).find("tr:contains('Fortifications')").after("<tr><td colspan=2><center><textarea style='width:50%'>"+msg+"</textarea></center></td></tr>");
                    }
                }
            });
    }
}

    //
    // Train Page Functions
    //
Page.train = {

    run: function() {
        this.trainPage();
        
        //next two lines sets up the clickable buttons
        rows = $("form").eq(0).find("table>tbody>tr");
        Buttons.btn_init(rows, 3, 1);
    }
    
    , trainPage: function() {
        var stable = $("table.personnel").last();
        
        var spies = $(stable).find("tr:contains('Spies'):first>td:last").html().trim();
        var sentries = $(stable).find("tr:contains('Sentries'):first>td:last").html().trim();
        var attackers = $(stable).find("tr:contains('Trained Attack Soldiers'):first>td:last").html().trim();
        var attackMercs = $(stable).find("tr:contains('Trained Attack Mercenaries'):first>td:last").html().trim();
        var defenders = $(stable).find("tr:contains('Trained Defense Soldiers'):first>td:last").html().trim();
        var defenseMercs = $(stable).find("tr:contains('Trained Defense Mercenaries'):first>td:last").html().trim();
        

        $(stable).after("<table width='100%' cellspacing='0' cellpadding='6' border='0' id='holding' class='table_lines'><tbody><tr><th colspan=3>Troops/Weapons</th></tr><tr><th class='subh'>Troops</th><th  class='subh'>Weapons</th><th align='right' class='subh'>Unhelds</th></tr></tbody></table>");
        
        var unheldSpy = User.spyWeaps - spies.int();
        var unheldSentry = User.sentryWeaps - sentries.int();
        var unheldStrike = User.saWeaps - attackers.int() - attackMercs.int();
        var unheldDefense = User.daWeaps - defenders.int() - defenseMercs.int();
        
        function describe(unheld) {
            if (unheld < 0)
                unheld = '<span style="color:white">None ('+unheld+')</span>';
            else
                unheld = '<span style="color:red">'+unheld+'</span>';
            return unheld;
        }
        unheldSpy = describe(unheldSpy); 
        unheldSentry = describe(unheldSentry);
        unheldStrike = describe(unheldStrike);
        unheldDefense = describe(unheldDefense);

            
        $("#holding").append("<tr><td><b>Strike Weapons&nbsp;</b></td><td>"+User.saWeaps+"&nbsp;&nbsp;</td><td align='right'> "+ unheldStrike+" </td></tr>");
        $("#holding").append("<tr><td><b>Defense Weapons&nbsp;</b></td><td>"+User.daWeaps+"&nbsp;&nbsp;</td><td align='right'> "+ unheldDefense+" </td></tr>");
        $("#holding").append("<tr><td><b>Spy Weapons&nbsp;</b></td><td>"+User.spyWeaps+"&nbsp;&nbsp;</td><td align='right'> "+ unheldSpy +"</td></tr>");
        $("#holding").append("<tr><td><b>Sentry Weapons&nbsp;</b></td><td>"+User.sentryWeaps+"&nbsp;&nbsp;</td><td align='right'> "+ unheldSentry+" </td></tr>");

        
        stable = $("table:contains('Train Your Troops')").last();
        $(stable).after("<table width='100%' cellspacing='0' cellpadding='6' border='0' id='growth' class='table_lines'><tbody><tr><th colspan=3>Growth Stats</th></tr></tbody></table>");
        $("#growth").append("<tr><td><div id='container' style='height:250px'></div></td></tr>");

        
        getLux('&a=trainStats',function(a) {
            
                var chart = new Highcharts.StockChart({
                    chart : {
                        renderTo : 'container',
                        zoom : 'none'
                    },
                    navigator : {
                        enabled : true
                    },
                    scrollbar : {
                        enabled : false
                    },
                    yAxis: {
                        min: 0
                        // startOnTick: false,
                        // endOnTick: false    
                    },
                    rangeSelector: {
                        enabled: false
                    },
                    title : {
                        text : 'Total Fighting Force'
                    },
                    
                    series : [{
                        name : 'Army Size',
                        data : $.parseJSON(a.responseText),
                        tooltip: {
                            valueDecimals: 0
                        }
                    }]
                });        
            });

        var notech = document.body.innerHTML.split('You have no technology');
        if (notech[1]) {
            db.put("Tech",1);
        }
        else {
            var tech = document.body.innerHTML.split('(x ');
            tech = tech[1].split(' ');
            tech = parseFloat(tech[0]);
            tech = Math.floor(tech*100);
            db.put("Tech",tech);
        }
    }

}
	//
    // lux_main.js
	//
	
    // Get kocid, before loading user.
    var action = Page.getCurrentPage();
	var kocid = undefined;
    if (action == 'base') {
        var html = document.body.innerHTML.split("stats.php?id=");
        html = html[1];
        kocid = html.slice(0,html.indexOf('"'));
    }
    
    // TODO: what happens if first user does not have kocid?
	Init.init();
    var User = Init.loadUser(kocid);
	if (!User) {
		alert ("Please go to your Command Center for initialization");
		return false;
	}
	
    Init.checkForUpdate(1);
   
    if( Init.checkUser() === 0) {
         return;
    }

	
	// Every page has its own init.
	Page[action].run();
	
	_.each(Plugins, function(plugin) {
		plugin();
	});

//Close of program
}(window.jQuery, document);
