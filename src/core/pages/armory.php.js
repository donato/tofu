define([
    'utils/koc_utils',
    'jquery',
    'underscore'
], function (Koc, $, _) {

    var setTableId = Koc.setTableId;
    var parseTableColumn = Koc.parseTableColumn;
    var getWeaponType = Koc.getWeaponType;
    var db = Koc.db;

    return {

        run: function () {
            this.$militaryEffectiveness = setTableId(2, 'military_effectiveness');

            this.parseMilitaryEffectiveness();
            this.parseInventory();
        },

        parseMilitaryEffectiveness: function() {
            var stats = parseTableColumn(this.$militaryEffectiveness, 1);
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
                
                var w = {
                    name: $cols[0].innerHTML,
                    type: getWeaponType($cols[0].innerHTML),
                    quantity: parseInt($cols[1].innerHTML),
                    strength: $cols[2].innerHTML,
                    sellValue: sellValue
                };

                weapons[w.name] = w;
            });
            
            this.updateWeaponsTracker(weapons);
        },
        
        updateWeaponsTracker: function(currentWeapons) {
            var previousWeapons = db.getObject('weaponsDict', {});
            var time_difference = Date.now() - db.getTime('armoryWeaponsLastUpdate');
            var allKeys = _.union(_.keys(currentWeapons), _.keys(previousWeapons));
            var differences = _.reduce(allKeys, function(memo, weapon) {
                var oldCount = previousWeapons[weapon] && previousWeapons[weapon].quantity || 0;
                var newCount = currentWeapons[weapon] && currentWeapons[weapon].quantity || 0;
                if (oldCount != newCount)
                    memo.push({
                        weapon: weapon,
                        delta: newCount - oldCount,
                        time: Date.now(),
                        interval: time_difference});
                return memo;
            }, []);
            
            var changeLog = db.getObject('weaponsTrackerChangelog', []);
            db.putObject('weaponsTrackerChangelog', differences.concat(changeLog));
            
            db.putTime('armoryWeaponsLastUpdate', Date.now());
            db.putObject('weaponsDict', currentWeapons);
        }
    }
});