define([
  'utils/koc_utils',
  'handlebars-loader!templates/stats-personal-message.html'
], function(Koc, MessageTemplate) {
  return {
    name : "Stats - Trophy Shelf",
    description : "Shows the honors and awards this player has earned.",
  
    defaultEnabled : true,
    
    enabledPages: ['stats'],

    run: function(page, $uiSlots) {
      this.statsPage($uiSlots.eq(4));
    },

    statsPage: function($insertLocation) {
      
      var userid = document.URL.split(/[=&?]/)[2];
      getLux('&a=stats_online&u=' + userid, (r) => {
        if (!r.responseText) {
          return;
        }
        // semi-colon delimited honors, with comma-delimited honor
        const honorsText = Koc.parseResponse(r.responseText, "honors");
        if (honorsText) {
          const honors = honorsText.split(';');
          let rows = '';
          for (const h of honors) {
            let [name, era, note, dateGranted] = h.split(',');
            if (note != "") {
              note = " - " + note;
            }
            rows += "<tr><td title=\""+dateGranted + note + "\">🏆 " + name + " (Era "+era+")</td></tr>";
          }
          const honorsTable = '<table class="table_lines" width="100%" cellpadding="6">' +
          '<tr><th>Honors</th></tr>' +
          rows+'</table>';
          $('table.officers').before(honorsTable);
        }
      });
    }
  };
});
