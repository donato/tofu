
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

