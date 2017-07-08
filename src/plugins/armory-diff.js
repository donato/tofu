define([
    'utils/gui',
    'utils/koc_utils',
    'handlebars-loader!templates/armory-diff.html'
], function(GUI, Koc, ArmoryDiffTemplate) {

    var db = Koc.db;

    return {
        description: "",

        defaultEnabled: true,

        enabledPages: ['armory'],

        run: function() {
            this.armoryDiff()
        },

        armoryDiff: function (stats) {
            var obj = {
                sa : stats[0],
                da : stats[1],
                spy : stats[2],
                sentry : stats[3]
            };

            function helper(stat) {
                var o = {};
                var diff = obj[stat] - User[stat];
                o[stat] = diff;
                o[stat + 'Percentage'] = (100* diff / User[stat]).toFixed(2);
                return o;
            }

            var statsDiffObj = _.extend.apply(null, _.map(['sa', 'da', 'spy', 'sentry'], helper));
            var html =  ArmoryDiffTemplate(statsDiffObj);
            $("#military_effectiveness").after(html);
        },
    }
});
