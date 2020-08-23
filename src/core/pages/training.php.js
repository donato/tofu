define([
  'utils/buttons',
  'utils/koc_utils',
  'jquery',
  'underscore'
], function (Buttons, KoC, $, _) {

  var getRowValues = KoC.getRowValues;
  var db = KoC.db;

  return {

    run: function () {
      this.unheldWeapons();
      this.tffChart();

      //Set up the clickable buttons
      var buttonsConstraint = function (val, $row) {
        var selected = 0;
        $("input[type='text']").each(function () {
          selected += $(this).val().int();
        });
        var maxCanTrain = to_int(getRowValues("Untrained Soldiers")[0]);
        return Math.min(val, maxCanTrain - selected);
      };

      Buttons.init(User.gold, KoC.getTableByHeading("Train Your Troops"), 1, buttonsConstraint);
    },

    unheldWeapons: function () {
      function describe(unheld) {
        if (unheld < 0) {
          return '<span style="color:white">None (' + unheld + ')</span>';
        }
        return '<span style="color:red">' + unheld + '</span>';
      }
      function getTroopCount($table, str) {
        return $table
          .find("tr:contains('" + str + "'):first>td:last")
          .html().int();
      }
      var $stable = $("table.personnel").last();

      var spies = getTroopCount($stable, "Spies");
      var sentries = getTroopCount($stable, "Sentries");
      var attackers = getTroopCount($stable, "Trained Attack Soldiers");
      var attackMercs = getTroopCount($stable, "Trained Attack Mercenaries");
      var defenders = getTroopCount($stable, "Trained Defense Soldiers");
      var defenseMercs = getTroopCount($stable, "Trained Defense Mercenaries");

      $stable.after("<table width='100%' cellspacing='0' cellpadding='6' border='0' id='holding' class='table_lines'><tbody><tr><th colspan=3>Troops/Weapons</th></tr><tr><th class='subh'>Troops</th><th  class='subh'>Weapons</th><th align='right' class='subh'>Unhelds</th></tr></tbody></table>");

      var weapons = db.getObject('weaponsDict', {});
      var weaponQuantity = _.reduce(weapons, function (memo, obj) {
        memo[obj.type] += obj.quantity;
        return memo;
      }, { sa: 0, da: 0, spy: 0, sentry: 0 });

      var unheldSpy = describe(weaponQuantity.spy - spies);
      var unheldSentry = describe(weaponQuantity.sentry - sentries);
      var unheldStrike = describe(weaponQuantity.sa - attackers - attackMercs);
      var unheldDefense = describe(weaponQuantity.da - defenders - defenseMercs);

      $("#holding")
        .append("<tr><td><b>Strike Weapons&nbsp;</b></td><td>" + weaponQuantity.sa + "&nbsp;&nbsp;</td><td align='right'> " + unheldStrike + " </td></tr>")
        .append("<tr><td><b>Defense Weapons&nbsp;</b></td><td>" + weaponQuantity.da + "&nbsp;&nbsp;</td><td align='right'> " + unheldDefense + " </td></tr>")
        .append("<tr><td><b>Spy Weapons&nbsp;</b></td><td>" + weaponQuantity.spy + "&nbsp;&nbsp;</td><td align='right'> " + unheldSpy + "</td></tr>")
        .append("<tr><td><b>Sentry Weapons&nbsp;</b></td><td>" + weaponQuantity.sentry + "&nbsp;&nbsp;</td><td align='right'> " + unheldSentry + " </td></tr>");
    },

    tffChart: function () {
      var $stable = $("table:contains('Train Your Troops')").last();
      $stable.after($("<table>", { 'id': 'growth', 'class': 'table_lines' })
        .append("<tbody><tr><th colspan=3>Growth Stats</th></tr></tbody>")
      );
      $("#growth").append("<tr><td><div id='container' style='height:250px'></div></td></tr>");

      getLux('&a=trainStats', (a) => {
        // var chart = new Highcharts.StockChart({
        //   chart : {
        //     renderTo : 'container',
        //     zoom : 'none'
        //   },
        //   navigator : {
        //     enabled : true
        //   },
        //   scrollbar : {
        //     enabled : false
        //   },
        //   yAxis: {
        //     min: 0
        //     // startOnTick: false,
        //     // endOnTick: false    
        //   },
        //   rangeSelector: {
        //     enabled: false
        //   },
        //   title : {
        //     text : 'Total Fighting Force'
        //   },

        //   series : [{
        //     name : 'Army Size',
        //     data : $.parseJSON(a.responseText),
        //     tooltip: {
        //       valueDecimals: 0
        //     }
        //   }]
        // });        
      });

      var html = document.body.innerHTML;
      if (html.indexOf('You have no technology') >= 0) {
        db.put('Tech', 1);
      } else {
        var table = KoC.getTableByHeading('Technological Development');
        var tech = table.find('tr').eq(2).text().split('(x ');
        tech = tech[1].split(' ');
        tech = parseFloat(tech[0]);
        tech = Math.floor(tech * 100);
        db.put('Tech', tech);
      }
    }
  }
});