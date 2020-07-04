define([
    'utils/koc_utils',
    'plugins/luxbot-logging',
    'jquery',
    'underscore'
], function (Koc, Log, $, _) {

    var db = Koc.db;

    return {
      run: function () {
        const weapons = this.parseInventory();
        Log.logArmory(weapons);
        db.put('weapons', weapons);
      },

      parseMilitaryEffectiveness: function() {
        const $militaryTable = Koc.getTableByHeading('Military Effectiveness');
        const stats = Koc.parseTableColumn($militaryTable, 1);
        db.put('sa', stats[0]);
        db.put('da', stats[1]);
        db.put('spy', stats[2]);
        db.put('sentry', stats[3]);
      },
      
      parseInventory: function () {

        var $weaponRows = $("input[name='doscrapsell']").parent().parent().parent().parent().parent().parent();

        var weapons = {};
        $weaponRows.each(function () {
            var $row = $(this);
            var $cols = $row.find('td');
            var $sellBtn = $row.find("input[name='doscrapsell']");
            var sellValue = to_int($sellBtn.val());
            
            var nameColumn = $cols.eq(0).text();
            var [weaponName, weaponSellValue] = nameColumn.split('*');
            var w = {
                name: weaponName,
                type: Koc.getWeaponType(weaponName),
                quantity: $cols.eq(2).text(),
                strength: to_int($cols.eq(3).text().split('/')[0]),
                sellValue: sellValue
            };

            weapons[w.name] = w;
        });
        return weapons;
      },

    }
});