define([
  'utils/koc_utils',
  'utils/constants',
  'handlebars-loader!templates/stats-show-stats.html'
], function (Koc, Constants, StatsTemplate) {
  return {
    name: "Stats Lux stats",

    description: "Adds a table with luxbot info for latest stats",

    defaultEnabled: true,

    enabledPages: ['stats'],

    run: function (page) {
      this.showLoggedStats();
    },

    showLoggedStats: function () {
      var self = this;
      var userid = document.URL.split(/[=&?]/)[2];
      var $insertLocation = $('.lux_table_slot').eq(6);

      const html = StatsTemplate({
        rows: [
          ['loading', '', ''],
          ['loading', '', ''],
          ['loading', '', ''],
          ['loading', '', ''],
          ['loading', '', ''],
        ]
      });
      const $infoContainer = $insertLocation.append(html);

      $('body').on('click', '#luxstats_reload', () => {
        this.updateUserInfo($infoContainer, userid);
      });
      this.updateUserInfo($infoContainer, userid);
    },

    updateUserInfo: function ($infoContainer, userid) {
      getLux('&a=getstats&userid=' + userid, (responseDetails) => {
        let html;
        if (responseDetails.responseText == '403') {
          html = StatsTemplate({
            message: ['Access Denied']
          });
        } else if (responseDetails.responseText == 'N/A') {
          html = StatsTemplate({
            message: ['No Data Available']
          });
       } else {
         // The response is a semi-colon delimited alternating set of value and time.
         // For example "10; 20min; 30; 10min;", ordered by convention as SA/DA/Spy/Sentry/Gold
         // There is an optional final, 11th value during Wartimes for extra messages.
          var values = responseDetails.responseText.split(';');
          // TODO(): Fix getstats to not be so confusing.

          let messages = (values.length > 10) ? [values[11]] : [];
          html = StatsTemplate({
            messages: messages,
            rows: [
              [Constants.statsdesc[0], values[0], values[1]],
              [Constants.statsdesc[1], values[2], values[3]],
              [Constants.statsdesc[2], values[4], values[5]],
              [Constants.statsdesc[3], values[6], values[7]],
              [Constants.statsdesc[4], values[8], values[9]],
            ]
          });
        }
        $infoContainer.html(html);
      });
    },
  };
});
