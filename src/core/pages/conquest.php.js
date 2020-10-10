define(['jquery'], function ($) {
  return {
    run: function () {
      function doConquest() {
        $("tr:contains('Wizards')").last().find("input[type='submit']").click();
      }

      if ($("table.table_lines>tbody>tr").length > 10) {
        $("table.table_lines>tbody>tr:eq(2)").before("<tr><td id='wCount'>Wizards (x0)</td><td align='right'>1,000,000,000</td><td align='center'><button style='width:90%' id='doCon'>Go on a conquest against Wizards!</button></td></tr>");
        $("#doCon").click(doConquest);
      }
    }
  }
});