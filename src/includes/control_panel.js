var ControlPanel = {

    init: function () {

		this.$controlbox = $("<div>", {
			'id': 'tofu_control_box',
			'html' : 'Open Control Panel<br>Tofu V.' + version
		});

		$('body').append( this.$controlbox );

		this.$controlbox.click( this.showControlPanel );
    }


    , showControlPanel: function() {
		GUI.displayHtml('<div id="tofu_popup_navbar"><ul></ul></div><div id="tofu_popup_content"></div>');
		
		var panelTabs = [
			// 'Tab Text', 'id', callback
			['Show links', 'showlinkbox', ControlPanel.showLinkBox],
			['Farmlist Setup','showfarmlist', ControlPanel.showFarmList],
			['Check for update', 'checkupdate', Init.checkForUpdate]
		];
		
		var $nav = $('#tofu_popup_navbar > ul');
		_.each(panelTabs, function(arr) {
			$nav.append("<li><a href='javascript:void(0);' id='"+arr[1]+"'>"+arr[0]+"</a></li>");
			$('#'+arr[1]).click(arr[2]);
		});
    }

    ,  toggle: function() {
        $("_luxbot_darken").toggle();
    }

    , showLinkBox: function () {
		get(Constants.gitHtml+'links.html', function(r) {
			alert(r.responseText);
			$('#tofu_popup_content').html(r.responseText);
		});
    }

    ,  showMessageBox: function() {
        if (messages === undefined) {
            return;
        }
        var content = '';
        var i;
        for (i = 0; i < messages.length; i++) {
            var y = messages[i].split('|');
            content += '<tr id="_luxbot_message_' + y[3] + '">'
					  +'<td><a href="javascript:void(0);" name="' + y[3] + '">+</a></td>'
					  +'<td>' + y[1] + '</td><td>' + y[0] + '</td>'
					  +'<td>' + y[2] + '</td>'
					  +'</tr>';
        }

        GUI.showMessage('<h3>Messages</h3><table id="_luxbot_messages" width="100%"><tr><th>Show</th><th>Sender</th><th>Subject</th><th>Date</th></tr>' + content + '</table>');
        document.getElementById("_luxbot_guibox").addEventListener('click', GUI.showMessageDetails, true);
    }

    , showMessageDetails: function(event) {
		var name = event.target.name;
        if ( _.isString(name) ) {

            getLux('&a=getmessage&id=' + name,
               function(r) {
                    var q = document.getElementById('_luxbot_message_' + name);
                    GUI.showMessage('<h3>Messages</h3><table id="_luxbot_messages" width="100%"><tr><th>From</th><td>' + q.childNodes[1].innerHTML + '</td></tr><tr><th>Subject</th><td>' + q.childNodes[2].innerHTML + '</td></tr><tr><th>Date</th><td>' + q.childNodes[3].innerHTML + '</td></tr><tr><th>Message</th><td>' + r.responseText + '</td></tr>', GUI.showMessageBox);
            });
        }
    }
    
}

