define(['jquery', 'underscore'], function($, _) {
	return {
		
    run: function() {
	
		var buttonsConstraint = function(val, $row) {
			var quantityAvailable = $row.find("td").eq(2).text().int();
			return Math.min(val, quantityAvailable);
		}
		
        Buttons.init(User.gold, getTableByHeading("Buy Mercenaries"), 1, buttonsConstraint);
    }
	
    
}});