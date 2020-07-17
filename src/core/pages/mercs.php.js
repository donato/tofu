define([
  'utils/buttons',
  'utils/koc_utils',
  'jquery',
  'underscore'
], function (Buttons, Koc, $, _) {
  return {
    run: function () {
      var buttonsConstraint = function (val, $row) {
        var quantityAvailable = $row.find("td").eq(2).text().int();
        return Math.min(val, quantityAvailable);
      };

      Buttons.init(User.gold, Koc.getTableByHeading("Buy Mercenaries"), 1, buttonsConstraint);
    }
  }
});