define({
  description : "Show whether players are online",
 
  defaultEnabled : false,
  
  enabledPages: ['stats', 'battlefield'],

  run: function(page) {
    // I think this feature has been banned. May try to appeal the ruling.      
    // if (page == 'stats') {
    //   this.stats();
    // } else if (page == 'battlefield') {
    //   this.battlefield();
    // }
  },

  stats: function(uiSlots) {
    var userid = document.URL.split(/[=&?]/)[2];
    getLux('&a=stats_info&u=' + userid,
      function(r) {
        var stable = $("table:contains('User Stats')").last();
        var tx = r.responseText;
        if (parseResponse(tx, "online") !== '') {
          $(stable).find("tr:contains('Name')").first().find("td:eq(1)").append('&nbsp;<img title="Player is online"  class="_lux_online" src="http://www.luxbot.net/bot/img/online2.gif" />');
        }
      });
  },

  battlefield: function(kocids) {
    getLux('&a=bf_online&u=' + kocids,
        function (r) {
          var players = r.responseText.split(';');
          var i;
          for (i = 0; i < players.length; i++) {
              if (players[i] === '') {
                  continue;
              }
              var s = players[i].split(':');
              var id = s[0];
              var $row = kocidToRowMap[id];
              var $user_td = $row.children('td').eq(2);
              $user_td.append('<sup style="color:0066CC">Online</sup>');
            }
        });
  },
});
