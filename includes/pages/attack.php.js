
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
