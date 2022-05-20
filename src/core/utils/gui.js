import $ from 'jquery';

export default {

    init: function () {
        this.$popup = $('<div>', {'id': 'tofu_popup_box'});
        $('body').append(this.$popup);

        var self = this;
        this.$popup.click(function (event) {
            if ($(event.target).is("#tofu_popup_box")) {
                self.hide();
            }
        });

        $(document).keyup(function (e) {
            if (e.keyCode === 27) {
                self.hide();
            }
        });

    },
    
    displayText: function (tx) {
        this.displayHtml("<div>" + tx + "</div>");
    },

    displayHtml: function (html) {
        this.hide();
        var $div = $('<div>');
        $div.append(html);

        this.$popup.append($div);
        this.$popup.show();
        return $div;
    }

    , hide: function () {
        this.$popup.hide();
        this.$popup.children().remove();
    }

};
