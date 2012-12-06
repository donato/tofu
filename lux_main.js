	//
    // lux_main.js
	//
	
    // Get kocid, before loading user.
    var action = Page.getCurrentPage();
    if (action == 'base') {
        var html = document.body.innerHTML.split("stats.php?id=");
        html = html[1];
        kocid = html.slice(0,html.indexOf('"'));
    }
    
    // TODO: what happens if first user does not have kocid?
	Init.init();
    var User = Init.loadUser(kocid);
	if (!User) {
		alert ("Please go to your Command Center for initialization");
		return false;
	}
	
    Init.checkForUpdate(1);
    //GUI.createGUIContainer();
   
    if( Init.checkUser(User) === 0) {
         return;
    }

	
	// Every page has its own init.
	Page[action].run();
	
	_.each(Plugins, function(plugin) {
		plugin();
	});
