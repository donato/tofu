define([
  'utils/koc_utils',
  'jquery',
  'underscore'
], function (Koc, $, _) {

  function isPlayerMaxed(kocid) {
    if (document.body.innerHTML.indexOf('Your opponent has already suffered heavy losses today') !== -1) {
      postLux('&a=logcap', 'targetID=' + kocid);
    }
    if (document.body.innerHTML.indexOf('this nub has been put on quarantine') != -1) {
      postLux('&a=logcap', 'targetID=' + kocid);
    }
  }

  function addBumpButton() {
    $("input[name='numsab']").after(" <input type='button' id='bumpup' value='+1' />");
    $("#bumpup").click(function () {
      $("input[name='numsab']").val($("input[name='numsab']").val().int() + 1);
    });
  }

  // TODO(): This has not been reviewed, merely ported from luxbot.
  function getSabInfo(kocid) {

    $(".personnel").before("<table id='lux_sabbable' class='table_lines' width='100%' cellpadding='6' cellSpacing='0'><th colspan='3'>LuXBot Info - Sabbable<span style='float:right;'><a href='http://www.kingsofchaos.com/intelfile.php?asset_id=" + kocid + "'>(Logs)</a></span></th></table>");

    getLux('&a=getsab2&userid=' + kocid,
      function (responseDetails) {
        if (responseDetails.responseText == '403') {
          $("#lux_sabbable").append('<td colspan="2" style="font-weight:bold;text-align:center;">Access denied</td>');
          return;
        } else if (responseDetails.responseText == 'N/A') {
          $("#lux_sabbable").append('<td colspan="2" style="font-weight:bold;text-align:center;">No data available</td>');
          return;
        } else if (responseDetails.responseText.indexOf('<') > -1) {
          $("#lux_sabbable").append('<td colspan="2" style="font-weight:bold;text-align:center;">Server Error. Contact Admin.</td>');
          return;
        }

        var rt = responseDetails.responseText;
        var sabInfo = Koc.parseResponse(rt, "sabinfo");
        var hilight = Koc.parseResponse(rt, "hilight");
        userInfo = sabInfo.split(';');

        for (i = 0; i < userInfo.length - 1; i += 2) {
          var builder = '<tr><td class="sabbable">';
          if (!isNaN(userInfo[i].charAt(0)))
            builder += '<span>' + userInfo[i] + '</span>';
          else
            builder += userInfo[i];
          builder += '</td><td class="sabbable"><span>' + userInfo[i + 1] + "</span></td></tr>";

          $("#lux_sabbable").append(builder);
        }

        if (hilight.length > 0)
          $("#lux_sabbable").find("td").eq(hilight).css("border", "1px solid #00FF66");

        $(".sabbable>span").click(function (e) {
          var t = $(e.target).text();
          t = $.trim(t).split(" ");
          var count = t.shift().int();
          var weap = t.join(" ");
          weap = weap.substr(0, weap.length - 1);//take off last "s"
          var weap2 = weap.concat(" ("); // to cope with the weaponname already being used in Last sabbed
          var v_aat = textBetween(document.body.innerHTML, weap2, "\" value"); //add the AAT to the label
          count = textBetween(v_aat, "(AAT:", ")") //use the count of current AAT

          val = $("option[label='" + weap2 + v_aat + "']").val();

          $("select[name='enemy_weapon']").val(val);
          $("input[name='numsab']").val(count);
          $("input[name='numspies']").val('1');
          $("select[name='sabturns']").val('5');
        });
      });
  }

  return {
    run: function () {
      const kocid = Koc.Page.getCurrentPageId();
      addBumpButton();
      getSabInfo(kocid);
      isPlayerMaxed(kocid);
    }
  }
});