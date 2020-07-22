define([
  'utils/koc_utils',
  'handlebars-loader!templates/stats-personal-message.html'
], function (Koc, MessageTemplate) {

  const db = Koc.db;
  
  return {
    name: "Base TBG Investment Forecast",
    description: "Show how much your stats would grow if you invest your TBG in one stat.",

    defaultEnabled: true,

    enabledPages: ['base'],

    run: function (page, $uiSlots) {
      this.tbgStats($uiSlots.eq(4));
    },

    tbgStats: function (slot) {
      function percentFormat(value) {
        value *= 100;
        var decimalPlaces = Math.min(2, Math.floor(Math.log10(value)));

        return (Math.round(value * 1000) / 1000).toFixed(2 - decimalPlaces);
      }

      var income = db.getInt('income');
      var tech = parseFloat(db.get('technology'));
      var offieBonus = parseFloat(db.getFloat('bonus'));

      var Label = ["Strike Action", "Defensive Action", "Spy", "Sentry"];
      var costs = [450000, 200000, 1000000, 1000000];
      var strengths = [600, 256, 1000, 1000]
      var rows = "";
      _.each(['sa', 'da', 'spy', 'sentry'], function (stat, i) {
        var multiplier = Koc.upgradeBonus(stat) * Koc.raceBonus(stat) * tech * offieBonus;

        if (stat == 'sa' || stat == 'da') { multiplier *= 5; }

        var hourlyValue = (income * 60 / costs[i]) * strengths[i] * multiplier;

        var currentStat = db.getInt(stat);
        rows += '  <tr>'
          + '    <td> ' + Label[i] + '&nbsp;</td><td>' + addCommas(Math.floor(hourlyValue)) + ' <span class="supplemental">(' + percentFormat(hourlyValue / currentStat) + '%)</span> &nbsp;</td>'
          + '    <td>' + addCommas(Math.floor(24 * hourlyValue)) + ' <span class="supplemental">(' + percentFormat((24 * hourlyValue) / currentStat) + '%)</span> </td>'
          + '  </tr>';
      });
      const html = '<table class="table_lines" width="100%" cellpadding="6">'
        + '  <tbody>'
        + '    <tr><th colspan=3>Investment Profile </th></tr>'
        + '    <tr><th class="subh">&nbsp;&nbsp;&nbsp;</th><th class="subh">1 Hour&nbsp;</th><th class="subh">1 Day</th></tr>'
        + rows
        + '  </tbody>'
        + '</table>';
      slot.append(html);
    }
  };
});
