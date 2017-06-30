define([
    '../buttons',
    '../koc_utils',
    'jquery',
    'underscore',
    'handlebars-loader!../../templates/armory-buy-button.html',
    'handlebars-loader!../../templates/armory-diff.html'
], function (Buttons, KoC, $, _, BuyButton, ArmoryDiffTemplate) {

    var setTableId = KoC.setTableId;
    var parseTableColumn = KoC.parseTableColumn;
    var getTableByHeading = KoC.getTableByHeading;
    var getWeaponType = KoC.getWeaponType;
    var db = KoC.db;

    return {

        run: function () {
            this.$militaryEffectiveness = setTableId(2, 'military_effectiveness');

            //next two lines adds the clickable buttons
            Buttons.init(User.gold, getTableByHeading("Buy Weapons"), 2);

            var stats = parseTableColumn(this.$militaryEffectiveness, 1);
            this.armoryDiff(stats);
            this.formatPage();

            // if (checkOption('option_armory_diff')) {
            // }
            // if (checkOption('option_armory_graph')) {
            // this.showStats();
            // }
            // this.armory_aat();
            this.addBuyButton();
        },

        formatPage: function () {

            var weapons = [];
            var weaponQuantity = {
                sa: 0,
                da: 0,
                spy: 0,
                sentry: 0
            };

            var $weaponRows = $("input[name='doscrapsell']").parent().parent().parent().parent().parent().parent();

            $weaponRows.each(function () {
                var $row = $(this);
                var $cols = $row.find('td');
                var w = {
                    name: $cols[0].innerHTML,
                    type: getWeaponType($cols[0].innerHTML),
                    quantity: parseInt($cols[1].innerHTML),
                    strength: $cols[2].innerHTML
                };

                weaponQuantity[w.type] += w.quantity;
                weapons.push(w);
            });

            var stats = parseTableColumn(this.$militaryEffectiveness, 1);
            db.put('sa', stats[0]);
            db.put('da', stats[1]);
            db.put('spy', stats[2]);
            db.put('sentry', stats[3]);
            db.put('saWeaps', weaponQuantity.sa);
            db.put('daWeaps', weaponQuantity.da);
            db.put('spyWeaps', weaponQuantity.spy);
            db.put('sentryWeaps', weaponQuantity.sentry);
            db.putObject('weaponList', weapons);

            //postLuxJson('&a=armory', weapons);
        },

        showStats: function () {
            $(".personnel").before('<table class="table_lines" width="100%" cellspacing="0" cellpadding="6" border="0"><tbody><tr><th>Armory Value Stats</th></tr><tr><td><div id="container"></div></td></tr></tbody></table><br />');

            getLux('&a=armoryStats', function (a) {

                window.chart = new Highcharts.StockChart({
                    chart: {
                        renderTo: 'container',
                        zoom: 'none'
                        // width: '100%'
                    },
                    rangeSelector: {
                        enabled: false
                    },
                    scrollbar: {
                        enabled: false
                    },
                    yAxis: {
                        min: 0
                        // startOnTick: false,
                        // endOnTick: false
                    },

                    title: {
                        text: 'Armory Value'
                    },

                    series: [
                        {
                            name: 'Weapon Value',
                            data: $.parseJSON(a.responseText),
                            tooltip: {
                                valueDecimals: 0
                            }
                        }
                    ]
                });
            });
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
                log(obj[stat] + stat);
                log(User[stat] + stat);
                var diff = obj[stat] - User[stat];
                o[stat] = diff;
                o[stat + 'Percentage'] = (100* diff / User[stat]).toFixed(2);
                return o;
            }

            var statsDiffObj = _.extend.apply(null, _.map(['sa', 'da', 'spy', 'sentry'], helper));
            log(JSON.stringify(statsDiffObj));
            var html =  ArmoryDiffTemplate(statsDiffObj);
            $("#military_effectiveness").after(html);
        },

        addBuyButton: function () {
            $("#buy_weapons_form>tbody>tr").eq(1).before(BuyButton());
        },
        armory_aat: function () {
            var sellVal = 0;
            $("input[name='doscrapsell']").each(function (i, e) {
                var row = $(e).parents("tr").eq(1);
                var qty = to_int($(row).children("td").eq(1).text());
                var cost = to_int($(e).val());

                sellVal += qty * cost;
            });
            var retailValue = sellVal * 10 / 7;


            $("input[name='doscrapsell']").each(function (i, e) {
                var row = $(e).parents("tr").eq(1);
                var cost = to_int($(e).val());
                $(row).children("td:eq(0)").append(" (" + Math.floor(retailValue / 400 / (cost * 10 / 7)) + " aat)");
            });

            $("table.table_lines:eq(0)>tbody>tr:eq(0)>th").append(" (Total Sell Off Value: " + addCommas(sellVal) + " Gold)");
        }

    }
});