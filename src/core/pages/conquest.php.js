define(['jquery', 'underscore'], function($, _) {
	return {
		
    run: function() {
    
        function doConquest() {
          // Need approval from Ta- for this.
            // var count = 1 + to_int($("#wCount").text());
            // $("#wCount").text('Wizards (x'+count+')');
            // post("http://www.kingsofchaos.com/conquest.php",
                // "conquest_target=Wizards&conquest=Go+on+a+conquest+against+Wizards%21&hash=",false);

            $("tr:contains('Wizards')").last().find("input[type='submit']").click();//last().submit();
        }
        
        if ($("table.table_lines>tbody>tr").size() > 10) {
            $("table.table_lines>tbody>tr:eq(2)").before("<tr><td id='wCount'>Wizards (x0)</td><td align='right'>1,000,000,000</td><td align='center'><button style='width:90%' id='doCon'>Go on a conquest against Wizards!</button></td></tr>");
            $("#doCon").click(doConquest);
        }
    }
    
}
});