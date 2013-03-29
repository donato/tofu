    
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
