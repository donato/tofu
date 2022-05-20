import sabTargetsImg from 'assets/img/sabtargets.gif';
import GUI from 'utils/gui';

function getSabTargets() {
  getLux('&a=getsabtargets',
     (r) => {
      $("#_sab_content").html(r.responseText);

      var q = document.getElementsByName('_luxbot_targets_t');
      for (i = 0; i < q.length; i++) {
        q[i].addEventListener('click', function (e) {
          GM_openInTab('https://www.kingsofchaos.com/attack.php?id=' + String(e.target.id).replace(/__/, '')) }, true);
      }

      document.getElementById('getTodaysSabs').value = "View Your Sabs";
      document.getElementById('getTodaysSabs').addEventListener('click', getTodaysSabs, true);
      document.getElementById('getTodaysSabs').removeEventListener('click', getSabTargets, false);

    });  
}

function getTodaysSabs() {
  getLux('&a=getTodaysSabs',
    function (r) {
      document.getElementById('_sab_content').innerHTML = r.responseText;
      document.getElementById('getTodaysSabs').value = "View Sab List";
      document.getElementById('getTodaysSabs').addEventListener('click', getSabTargets, true);
      document.getElementById('getTodaysSabs').removeEventListener('click', getTodaysSabs, false);
    });
}

export default {
  name: 'Sablist',
  description: "Sab targets button added to sidebar",
  defaultEnabled: false,

  run: function () {
    this.addSabTargetsButton();
  },
  
  addSabTargetsButton: function () {
    var $sabButton = $('<a>', { 'href': '#' }).append(
      $("<img>", {
        'onclick': 'return false;',
        'class': 'tofu',
        'id': 'sidebar_sabtargets',
        // 'src': gmGetResourceURL("sidebar_sabtargets")
        'src': sabTargetsImg
      }));

    $sabButton.click(() => this.sabTargetsButton());

    var $leftBarRows = $("td.menu_cell> table> tbody > tr");
    $leftBarRows.eq(2).after($("<tr>").append($sabButton));
  },
  
  sabTargetsButton: function () {
    var $html = $("<table>", {
      'class': 'table_lines tofu',
      'id': '_luxbot_targets_table',
      'width': '100%',
      'cellspacing': 0,
      'cellpadding': 0,
      'border': 0
    })
      .append('<tr><td id="getTodaysSabs" ><input type="button" value="View Your Sabs" /></td></tr>'
        + '<tr><td id="_sab_content">Loading... Please wait...</td></tr>');

      
    GUI.displayHtml($html);
    getSabTargets();
  },
};