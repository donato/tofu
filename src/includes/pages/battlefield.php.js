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