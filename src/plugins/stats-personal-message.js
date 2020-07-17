define([
  'utils/koc_utils',
  'handlebars-loader!templates/stats-personal-message.html'
], function(Koc, MessageTemplate) {
  return {
    name : "Stats Wall",
    description : "Shows a personal message for lux users",
  
    defaultEnabled : true,
    
    enabledPages: ['stats'],

    run: function(page) {
      this.statsPage();
    },

    statsPage: function() {
      var userid = document.URL.split(/[=&?]/)[2];
      var $insertLocation = $('.lux_table_slot').eq(3);
      getLux('&a=stats_online&u=' + userid, (r) => {
        var message = '';
        if (r.responseText) {
          message = Koc.parseResponse(r.responseText, "message");
        }
        const isSelf = (User.kocid == userid);
        if (message || isSelf) {
          const html = MessageTemplate({
            message,
            isSelf
          });
          $insertLocation.append(html);
          $("#lux_update_message").click(function() {
            postLux('&a=set_message', '&msg=' + $("#lux_personal_message").val());                    
          });
        }
      });
    }
  };
});
