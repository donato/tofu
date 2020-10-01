define(['jquery', 'underscore'], function ($, _) {
  return {

    addRecruitId: function () {
      var kocid = textBetween(document.body.innerHTML, "stats.php?id=", '"');
      var recruitid = document.URL.substring(document.URL.indexOf("=") + 1);

      getLux('&a=addRecruitid&kocid=' + kocid + '&recruitid=' + recruitid);
    },

    run: function () {
      this.addRecruitId();
    }
  }
});