
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
                armory_diff(sa,da,spy,sentry);
                    
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
            
            sabLogs_update(tempvar);
            sabLogs_init();
            
            armory_upgradeSuggestions(User);
            armory_aat();
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
                showStats();
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
            sabLogs_display();
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