
Page.stats = {   

    run: function() {
        this.enemyid = document.URL.split(/[=&?]/)[2];

        this.statsPage();
        this.collapseAllianceInfoS();
        this.showUserInfoS();
        this.addStatsPageButtons();
        this.statsOnlineCheck();
    }
    
    , statsPage: function() {
        if (document.body.innerHTML.indexOf('Invalid User ID') != -1) {
            logStats('', this.enemyid, '', '','', 'invalid', '');
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
            logStats(name, this.enemyid, chain, alliances[0],alliances[1], comid + ";"+race+";"+rank+";"+highest_rank+";"+tff+";"+morale+";"+fort+";"+treasury, officers);
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
        
        if (statstable === undefined) { return; }
       
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
        statstable.rows[allianceindex].cells[1].innerHTML = pri_alliance + '<br><div id="_luxbot_alliances">' + sec_alliances.join(', ') + '</div><a id="expandAlliances"> + Show Secondary</a>';

		$("body").on('click', '#expandAlliances', function(){
			var q = document.getElementById('_luxbot_alliances');
			q.style.display = 'none';
			q.style.visibility = 'hidden';
			q.nextSibling.id = 'collapseAlliances';
			q.nextSibling.innerHTML = ' + Show Secondary';
		});
		$("body").on('click', '#expandAlliances', function(){
			var q = document.getElementById('_luxbot_alliances');
			q.style.display = 'block';
			q.style.visibility = 'visible';
			q.nextSibling.id = 'expandAlliances';
			q.nextSibling.innerHTML = ' - Hide Secondary'
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
        var $table = getTableByHeading("User Stats");
        
        var $nameTd = $table.find('tr:contains("Name:")').first().find("td").last();
        $nameTd.append(' <a href="http://www.stats.luxbot.net/history.php?playerSearch='+ this.enemyid +'" target="_blank" class="tofu viewHistory">View history</a>');
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