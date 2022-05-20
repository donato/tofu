import Koc from 'utils/koc_utils';
import MessageTemplate from 'handlebars-loader!templates/stats-personal-message.html';

const db = Koc.db;

export default {
  name: "Base TBG Investment Forecast",
  description: "Show how much your stats would grow if you invest your TBG in one stat.",

  defaultEnabled: false,

  enabledPages: ['base'],

  run: function (page, $uiSlots) {
    this.tbgStats($uiSlots.eq(5));
  },

  tbgStats: function (slot) {

    var income = db.getInt('income');
    var tech = parseFloat(db.get('technology'));
    var offieBonus = parseFloat(db.getFloat('bonus'));

    var Label = ["Strike Action", "Defensive Action", "Spy", "Sentry"];
    var costs = [450000, 450000, 1000000, 1000000];
    var strengths = [600, 600, 1000, 1000]
    var rows = "";
    ['sa', 'da', 'spy', 'sentry'].forEach(function (stat, i) {
      var multiplier = Koc.upgradeBonus(stat) * Koc.raceBonus(stat) * tech * offieBonus;
      var hourlyValue = (income * 60 / costs[i]) * strengths[i] * multiplier;

      var currentStat = db.getInt(stat);
      rows += '  <tr>'
        + '    <td> ' + Label[i] + '&nbsp;</td><td>' + addCommas(Math.floor(hourlyValue)) + ' <span class="supplemental">(' + Koc.formatPercentChange(hourlyValue / currentStat) + ')</span> &nbsp;</td>'
        + '    <td>' + addCommas(Math.floor(24 * hourlyValue)) + ' <span class="supplemental">(' + Koc.formatPercentChange((24 * hourlyValue) / currentStat) + ')</span> </td>'
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
