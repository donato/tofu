define([
    'underscore',
    'utils/gui',
    'utils/koc_utils'
], function(_, GUI, Koc) {

    var db = Koc.db;

    return {
        name: "AAT Calculator",
        description: "Include total armory value and AAT for your tools",

        defaultEnabled: true,

        enabledPages: ['armory'],

        run: function() {
            this.armory_aat();
        },
        
        armory_aat: function () {
            var previousWeapons = db.getObject('weaponsDict', {});
            var sellValue = _.reduce(previousWeapons, function(memo, w) {
                return memo + (w.sellValue * w.quantity);
            }, 0);
            var retailValue = Math.floor(sellValue * 10 / 7);

            $("input[name='doscrapsell']").each(function (i, e) {
                var row = $(e).parents("tr").eq(1);
                var cost = to_int($(e).val());
                $(row).children("td:eq(0)").append(" (" + Math.floor(retailValue / 400 / (cost * 10 / 7)) + " aat)");
            });

            $("table.table_lines:eq(0)>tbody>tr:eq(0)>th").append(" (Total Sell Off Value: " + addCommas(sellValue) + " Gold)");
        }
    }
});
