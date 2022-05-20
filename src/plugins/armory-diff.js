import GUI from 'utils/gui';
import Koc from 'utils/koc_utils';
import ArmoryDiffTemplate from 'handlebars-loader!templates/armory-diff.html';

var db = Koc.db;

export default {
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
};
