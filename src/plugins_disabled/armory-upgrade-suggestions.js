import GUI from 'utils/gui';
import Koc from 'utils/koc_utils';

var db = Koc.db;

export default {
    name: "Upgrade Suggestions",
    description: "Offer upgrade suggestions from the armory",

    defaultEnabled: false,

    enabledPages: ['armory'],

    run: function(page, $uiSlots) {
        var x = this.buildHtml();
        $uiSlots.eq(5).after(x);
    },
    buildHtml: function () {
        var bpms, chars, skins, ivs, da_bonus, sa_bonus, da_bonus_new, sa_bonus_new, sa_cost, da_cost, da_sellRow, sa_sellRow;
        var gold = User.gold;

        var race = User.race;
        var da_race_factor = 1;
        var sa_race_factor = 1;
        if (race == "Dwarfs") da_race_factor = 1.4;
        if (race == "Orcs") {
            da_race_factor = 1.2;
            sa_race_factor = 1.35;
        }

        var fort = $("form:nth-child(4) td:nth-child(1)").text();
        fort = fort.substr(0, fort.indexOf("("));
        var siege = $("form:nth-child(5) td:nth-child(1)").text();
        siege = siege.substr(0, siege.indexOf("("));

        var daIndex = Koc.getFort($.trim(fort));
        var saIndex = Koc.getSiege($.trim(siege));


        var t = $("#military_effectiveness");
        var sa = to_int($(t).find("tbody>tr:eq(1)>td:eq(1)").text());
        var da = to_int($(t).find("tbody>tr:eq(2)>td:eq(1)").text());

        //sure this can be optimized but cba right now
        var saCost = new Array(40000, 80000, 160000, 320000, 640000, 1280000, 2560000, 5120000, 10240000, 20480000, 40960000, 81920000, 163840000, 327680000);
        var daCost = new Array(40000, 80000, 160000, 320000, 640000, 1280000, 2560000, 5120000, 10240000, 20480000, 40960000, 81920000, 163840000, 327680000, 655360000, 1310720000);

        sa_cost = saCost[saIndex];
        da_cost = daCost[daIndex];

        sa_bonus = Koc.siegeBonus(saIndex);
        sa_bonus_new = Koc.siegeBonus(saIndex + 1);
        da_bonus = Koc.fortBonus(daIndex);
        da_bonus_new = Koc.fortBonus(daIndex + 1);

        var sell_ivs = Math.ceil((da_cost - gold) / 700000);
        var sell_bpms = Math.ceil((sa_cost - gold) / 700000);
        var sell_chars = Math.ceil((sa_cost - gold) / 315000);
        var sell_skins = Math.ceil((da_cost - gold) / 140000);

        var valPerBPM = sa_race_factor * 1000 * 5 * ((db.get("Tech", 100) + 1) / 100) * (db.get("Offiebonus", 100) / 100);
        var valPerCHA = sa_race_factor * 600 * 5 * (db.get("Tech", 100) / 100) * (db.get("Offiebonus", 100) / 100);
        var valPerIS = da_race_factor * 1000 * 5 * (db.get("Tech", 100) / 100) * (db.get("Offiebonus", 100) / 100);
        var valPerDS = da_race_factor * 256 * 5 * (db.get("Tech", 100) / 100) * (db.get("Offiebonus", 100) / 100);

        var weaps = db.getObject('weaponsDict', {});
        function getWeapCount(name) {
            if (weaps[name]) {
                return weaps[name].quantity
            }
            return 0;
        }
        ivs = getWeapCount("Invisibility Shield");
        bpms = getWeapCount("Blackpowder Missile");
        chars = getWeapCount("Chariot");
        skins = getWeapCount("Dragonskin");

        var oldDa = Math.floor((valPerDS * skins + valPerIS * ivs) * da_bonus);
        var oldSa = Math.floor((valPerCHA * chars + valPerBPM * bpms) * sa_bonus);

        var newDa_skins = 0;
        var newDa_ivs = 0;
        var newSa_chars = 0;
        var newSa_bpms = 0;
        if (skins >= sell_skins) {
            newDa_skins = valPerDS * (skins - sell_skins) + valPerIS * ivs;
            newDa_skins *= da_bonus_new;
            newDa_skins = Math.floor(newDa_skins);
        }
        if (ivs >= sell_ivs) {
            newDa_ivs = valPerDS * skins + valPerIS * (ivs - sell_ivs);
            newDa_ivs *= da_bonus_new;
            newDa_ivs = Math.floor(newDa_ivs);

        }

        if (chars >= sell_chars) {
            newSa_chars = valPerCHA * (chars - sell_chars) + valPerBPM * bpms;
            newSa_chars *= sa_bonus_new;
            newSa_chars = Math.floor(newSa_chars);

        }
        if (bpms >= sell_bpms) {
            newSa_bpms = valPerCHA * (chars) + valPerBPM * (bpms - sell_bpms);
            newSa_bpms *= sa_bonus_new;
            newSa_bpms = Math.floor(newSa_bpms);

        }

        var da_factor = Koc.getFort();
        var sa_factor = Koc.getSiege();
        //DA first
        //Create thing with id ="_lux_armory_suggestions"
        var da_html = '<span style="color:red"> Not enough tools</span>';
        if (da_factor < 16) {
            da_sellRow = addCommas(da_cost);

            if (ivs >= sell_ivs) {
                if (sell_ivs > 0) da_sellRow = addCommas(da_cost) + ' (Sell ' + addCommas(sell_ivs) + ' Invisibility Shields)';

                if (oldDa < newDa_ivs) da_html = addCommas(Math.floor(newDa_ivs)) + ' (<a style="color:green"><b>+</b></a>' + addCommas(Math.floor(Math.abs(newDa_ivs - oldDa))) + ')';
                else da_html = addCommas(Math.floor(newDa_ivs)) + ' (<a style="color:red"><b>-</b></a>' + addCommas(Math.floor(Math.abs(newDa_ivs - oldDa))) + ')';
            }
            if (skins >= sell_skins) {
                if (sell_skins > 0) da_sellRow = addCommas(da_cost) + ' (Sell ' + addCommas(sell_skins) + ' Dragonskins)';

                if (oldDa < newDa_skins) da_html = addCommas(Math.floor(newDa_skins)) + ' (<a style="color:green"><b>+</b></a>' + addCommas(Math.floor(Math.abs(newDa_skins - oldDa))) + ')';
                else da_html = addCommas(Math.floor(newDa_skins)) + ' (<a style="color:red"><b>-</b></a>' + addCommas(Math.floor(Math.abs(newDa_skins - oldDa))) + ')';
            }
        }

        //SA second
        var sa_html = '<span style="color:red"> Not enough tools</span>';
        if (sa_factor < 14) {
            sa_sellRow = addCommas(sa_cost);

            if (bpms >= sell_bpms) {
                if (sell_bpms > 0) sa_sellRow = addCommas(sa_cost) + ' (Sell ' + addCommas(sell_bpms) + ' Blackpowder Missles)';

                if (newSa_bpms > oldSa) sa_html = addCommas(newSa_bpms) + ' (<a style="color:green"><b>+</b></a>' + addCommas(Math.floor(Math.abs(oldSa - newSa_bpms))) + ')';
                else sa_html = addCommas(newSa_bpms) + ' (<a style="color:red"><b>-</b></a>' + addCommas(Math.floor(Math.abs(oldSa - newSa_bpms))) + ')';
            }
            if (chars >= sell_chars) {
                if (sell_chars > 0) sa_sellRow = addCommas(sa_cost) + ' (Sell ' + addCommas(sell_chars) + ' Chariots)';

                if (newSa_chars > oldSa) sa_html = addCommas(newSa_chars) + ' (<a style="color:green"><b>+</b></a>' + addCommas(Math.floor(Math.abs(oldSa - newSa_chars))) + ')';
                else sa_html = addCommas(newSa_chars) + ' (<a style="color:red"><b>-</b></a>' + addCommas(Math.floor(Math.abs(oldSa - newSa_chars))) + ')';
            }
        }

        var $luxgrades = $("<div id='_lux_upgrades'>").html('<table class="table_lines" width="100%" cellspacing="0" cellpadding="6" border="0"><tbody><tr><th colspan="2">Upgrade Suggestions</th></tr></tbody></table>');
        var temp = $luxgrades.find("tbody");
        temp.append("<tr><td><b>Current Fortifications:</b></td><td align='right'>" + fort + " (" + da_factor + ")</td></tr>");
        if (da_factor < 16) {
            temp.append("<tr><td>Upgrade Cost:</td><td align='right'>" + da_sellRow + "</td></tr>");
            temp.append("<tr><td>Estimated new DA</td><td align='right'>" + da_html + "</td></tr>");
        } else temp.append("<tr><td colspan=2>There are no more upgrades</td></tr>");

        temp.append("<tr><td><b>Current Siege:</b></td><td align='right'>" + siege + " (" + sa_factor + ")</td></tr>");
        if (sa_factor < 14) {
            temp.append("<tr><td>Upgrade Cost:</td><td align='right'>" + sa_sellRow + "</td></tr>");
            temp.append("<tr><td>Estimated new SA</td><td align='right'>" + sa_html + "</td></tr>");
        } else temp.append("<tr><td colspan=2>There are no more upgrades</td></tr>");

        return $luxgrades;
    }
};
