define([
  'utils/gui',
  'utils/koc_utils',
  'handlebars-loader!templates/weapon-changelog.html'
], function (GUI, Koc, WeaponChangelogTemplate) {

  var db = Koc.db;
  return {
    name: "Armory Weapons Logger",
    description: "Track changes to weapons over time",

    defaultEnabled: false,

    enabledPages: ['armory'],

    run: function (page, $uiSlots) {
      this.updateWeaponsTracker();
      this.display($uiSlots);
    },

    updateWeaponsTracker: function () {
      var currentWeapons = db.getObject('weapons', {});
      var previousWeapons = db.getObject('previousWeapons', {});
      var timeDifference = Date.now() - db.getTime('armoryWeaponsLastUpdate');
      var allKeys = Koc.union(Object.keys(currentWeapons), Object.keys(previousWeapons));
      var differences = allKeys.reduce(function (memo, weapon) {
        var oldCount = previousWeapons[weapon] && previousWeapons[weapon].quantity || 0;
        var newCount = currentWeapons[weapon] && currentWeapons[weapon].quantity || 0;
        if (oldCount != newCount)
          memo.push({
            weapon: weapon,
            delta: newCount - oldCount,
            time: Date.now(),
            interval: timeDifference
          });
        return memo;
      }, []);

      var changeLog = db.getObject('weaponsTrackerChangelog', []);
      db.putObject('weaponsTrackerChangelog', differences.concat(changeLog));

      db.putTime('armoryWeaponsLastUpdate', Date.now());
      db.putObject('previousWeapons', currentWeapons);
    },

    display: function ($uiSlots) {
      var changeLog = db.getObject('weaponsTrackerChangelog', []);
      const html = WeaponChangelogTemplate({rows: changeLog.slice(0, 5)});
      this.$table = $(html).insertAfter($uiSlots.eq(3));
   
      var self = this;
      $("#clearSablog").click(function () {
        self.sabLogs_clear();
      });
      $("#viewSablog").click(function () {
        self.sabLogs_viewAll();
      });
    },

    sabLogs_clear: function () {
      db.put('weaponsTrackerChangelog', []);
      this.$table.find('tr').not(':first-child').not('.nav').remove();
    },

    sabLogs_viewAll: function () {
      $("#lux_sablogs_2").css("overflow-y", "scroll");
      $("#lux_sablogs_2").css("height", "180px");
      var losses = db.get('lux_lostWeapons', '').split(';');
      $("#lux_sablogs_2>table>tbody>tr>td").parent().remove();

      var i;
      for (i = 0; i < losses.length; i++) {
        if (losses[i]) {
          var cols = losses[i].split(':');
          $("#lux_sablogs_2>table>tbody").append("<tr><td>" + cols[0] + " " + cols[1] + "s</td><td align=right>" + Koc.timeElapsed(cols[2]) + "</td></tr>");
        }
      }
      $(this.$table).append("<tr><td>(<a id='viewSablogLess'>View Less</a>)</td><td>(<a id='clearSablog'>Clear</a>)</td></tr>");
      var self = this;
      $("#clearSablog").click(function () {
        self.sabLogs_clear();
      });
      $("#viewSablogLess").click(function () {
        self.sabLogs_display();
      });
    }
  }
});
