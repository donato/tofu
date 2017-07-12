define([
    'utils/buttons',
    'utils/gui',
    'utils/koc_utils',
    'handlebars-loader!templates/armory-buy-button.html'
], function(Buttons, GUI, Koc, BuyButton) {

    var db = Koc.db;
    var getTableByHeading = Koc.getTableByHeading;

    return {
        name: "BetterButtons",
        description: "Add buttons to auto-fill text boxes with maximum affordable items",

        defaultEnabled: true,

        enabledPages: ['armory'],

        run: function(page) {
            //next two lines adds the clickable buttons
            Buttons.init(User.gold, getTableByHeading("Buy Weapons"), 2);

            if (page==='armory') {
                $("#buy_weapons_form>tbody>tr").eq(1).before(BuyButton());
            }
        }
    }
});
