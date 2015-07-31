ControlPanel['plugins'] = {
	displayname: 'Activate Plugins',
	
	run : function() {
	
	}
	
}
/*
    init: function () {
        this.$popup = $('<div>', { 'id': 'tofu_popup_box' });

        this.$controlbox = $("<div>", {
			'id': 'tofu_control_box',
			'html' : 'TOFUTOFU'
		});

		$('body')
			.append( this.$controlbox )
			.append( this.$popup );
			
		var self = this;	
		this.$popup.click(function (event) {
			if ($(event.target).is("#tofu_popup_box")) {
				self.hide();
			}
		});

		$(document).keyup(function(e){
			if (e.keyCode === 27) { self.hide(); }
		});
		
		this.$controlbox.click(function() { 
			alert("Trying to open box");
		});
    }

    , displayText: function(tx) {
        this.displayHtml("<div>"+tx+"</div>");
    }

    , displayHtml: function(html) {
		this.hide();
        this.$popup.append($("<div>").append(html));
        this.$popup.show();  
    }

	, hide: function() {
		this.$popup.hide();
		this.$popup.children().remove();
	}
	*/

