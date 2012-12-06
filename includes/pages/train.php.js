
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