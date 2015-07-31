define(['jquery', 'underscore'], function($, _) {
	return {
		
    init: function () {
        this.$popup = $('<div>', { 'id': 'tofu_popup_box' });
		$('body').append( this.$popup );

		var self = this;
		this.$popup.click(function (event) {
			if ($(event.target).is("#tofu_popup_box")) {
				self.hide();
			}
		});

		$(document).keyup(function(e){
			if (e.keyCode === 27) { self.hide(); }
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

}
});
