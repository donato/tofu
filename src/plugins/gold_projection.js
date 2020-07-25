define([], function () {
  const ONE_MINUTE = 60 * 1000;

  function nextMinute($obj, income, accumulator) {
    $obj.text("Projection: " + addCommas(User.gold.int() + income * accumulator));

    setTimeout(() => {
      nextMinute($obj, income, accumulator + 1);
    }, ONE_MINUTE);
  }

  return {
    name: 'Gold Projections',

    description: "Show projected gold beneath current gold",

    defaultEnabled: true,

    run: function () {
      var offset = 11; // Seconds after minute until turn arrives.

      // Add the display to the DOM
      $('.menu_cell').find('tr:contains(\'Gold:\')').last()
        .after("<tr><td colspan=2 style='color: BLUE; font-size: 6pt;text-align:center' id='gold_projection'></td></tr>");

      var date = new Date();
      var currentSeconds = date.getSeconds();
      var secsTillTurn = ((60 + offset) - currentSeconds) % 60;
      setTimeout(
        () => {
          nextMinute($("#gold_projection"), User.income.int(), 1);
        }, secsTillTurn * 1000
      );
    }
  };
});