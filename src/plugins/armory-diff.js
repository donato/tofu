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
      const previousStats = db.get('previousStats', {});
      db.put('previousStats', User);
      const o = {};
      ['sa', 'da', 'spy', 'sentry'].forEach(stat => {
        var diff = db.get(stat) - previousStats[stat];
        o[stat] = diff;
        o[stat + 'Percentage'] = (100 * diff / db.get(stat)).toFixed(2);
      });
      var html = ArmoryDiffTemplate(o);
      $insertLocation.append(html);
    },
  }
});
