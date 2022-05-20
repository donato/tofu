import Koc from 'utils/koc_utils';
import MessageTemplate from 'handlebars-loader!templates/stats-personal-message.html';

const str1 = "<table class='table_lines' cellpadding=6 width='100%'><tbody><tr><th colspan='2' align='center'>Luxbot Statistics</th></tr><tr><td class='alliance-banner'></td></tr></tbody></table>";

export default {
  name : "Alliance Banner",
  description : "Shows player & alliance stats.",

  defaultEnabled : true,
  
  enabledPages: ['base'],

  run: function(page, $uiSlots) {
    this.banner($uiSlots.eq(5));
  },

  banner: function($slot) {
    $slot.append(str1); 
    getLux("&a=sabstats", function (r) {
      $(".alliance-banner").html("" + r.responseText);
    });
  }
};
