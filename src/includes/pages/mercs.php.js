
Page.mercs = {

    run: function() {
	
		var buttonsConstraint = function(val, $row) {
			log($row);
			var quantityAvailable = $row.find("td").eq(2).int();
			return Math.min(val, quantityAvailable);
		}
		
        Buttons.init(User.gold, getTableByHeading("Buy Mercenaries"), 1, buttonsConstraint);
    }
	
    
}