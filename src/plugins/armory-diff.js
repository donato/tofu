define([
  'utils/gui',
  'utils/koc_utils',
  'handlebars-loader!templates/armory-diff.html'
], function (GUI, Koc, ArmoryDiffTemplate) {

  var db = Koc.db;

  return {
    name: "Armory Diff",
    description: "See your stats changes since the last visit to armory",

    defaultEnabled: true,

    enabledPages: ['armory'],

    run: function (page, $slots) {
      this.armoryDiff($slots.eq(3));
    },

    armoryDiff: function ($insertLocation) {
      var obj = {
        sa: db.get('sa'),
        da: db.get('da'),
        spy: db.get('spy'),
        sentry: db.get('sentry')
      };

      function helper(stat) {
        var o = {};
        var diff = obj[stat] - User[stat];
        o[stat] = diff;
        o[stat + 'Percentage'] = (100 * diff / User[stat]).toFixed(2);
        return o;
      }
      const statsDiffObj = {};
      ['sa', 'da', 'spy', 'sentry'].forEach(value => {
        statsDiffObj[value] = helper(value);
      });
      var html = ArmoryDiffTemplate(statsDiffObj);
      $insertLocation.append(html);
    },
  }
});
