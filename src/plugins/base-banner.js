define([
  'utils/koc_utils',
  'handlebars-loader!templates/stats-personal-message.html'
], function(Koc, MessageTemplate) {

  const str1 = "<table class='table_lines' cellpadding=6 width='100%'><tbody><tr><th colspan='2' align='center'>Luxbot Statistics</th></tr><tr><td class='alliance-banner'></td></tr></tbody></table>";

  return {
    name : "Alliance Banner",
    description : "Shows player & alliance stats.",
  
    defaultEnabled : true,
    
    enabledPages: ['base'],

    run: function(page, $uiSlots) {
      this.banner($uiSlots.eq(2));
    },

    banner: function($slot) {
      $slot.append(str1); 
      getLux("&a=sabstats", function (r) {
        $(".alliance-banner").html("" + r.responseText);
      });
    }
  };
});
