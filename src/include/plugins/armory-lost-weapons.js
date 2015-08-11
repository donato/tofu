 module.exports = {
     sabLogs_update: function (weapList) {
         weapList = ';' + weapList; //this is hack is important because of "shield" vs "invis shield"
         var d = new Date()
         var time = "" + d.getTime() + "";

         var old_weapList = db.get('lux_weaponList', '');
         old_weapList = old_weapList.split(';');
         var losses = '';
         $(old_weapList).each(function (i, e) {
             if (e) {
                 var weapName = e.split(':')[0];
                 var old_weapCount = parseInt(e.split(':')[1].replace(/[^0-9]/g, ''), 10);

                 //notice we search for weapName after a semi-colon, explaining prev hack.
                 var new_weapCount = parseInt(textBetween(weapList, ';' + weapName + ':', ':').replace(/[^0-9]/g, ''), 10);

                 if (old_weapCount > new_weapCount) {
                     losses += (old_weapCount - new_weapCount) + ":" + weapName + ":" + time + ";";
                 }
                 //handle if it is no longer in the list
                 if (weapList.indexOf(';' + weapName + ':') == -1) {
                     losses += (old_weapCount) + ":" + weapName + ":" + time + ";";
                 }
             }
         });

         if (losses !== '') {

             var arr = losses.split(';');
             var i = 0;
             var h = "";
             for (i = 0; i <= arr.length; i++) {
                 if (arr[i]) {
                     var cols = arr[i].split(":");
                     h += "You have lost " + cols[0] + " " + cols[1] + "s<br />";
                 }
             }


             $("body").append("<table id='_lux_sabbed_popup'><tbody><tr><th>Attention!</th></tr></tbody></table>");
             $('#_lux_sabbed_popup>tbody').append("<tr><td>" + h + "</td></tr>");


             var old_losses = db.get('lux_lostWeapons', '');
             db.put('lux_lostWeapons', losses + old_losses);
         }
         db.put('lux_weaponList', weapList);
     },

     sabLogs_init: function () {
         $("#military_effectiveness").before('<table id="_lux_sabbed" class="table_lines" width="100%" cellspacing="0" cellpadding="6" border="0"></table>');
         $("#buy_weapons_form").before('<table id="_lux_upgrades" class="table_lines" width="100%" cellspacing="0" cellpadding="6" border="0"></table>');
         this.sabLogs_display();
     },

     sabLogs_display: function () {
         var losses = db.get('lux_lostWeapons', '').split(';');
         var i;
         $("#_lux_sabbed").html('<table class="table_lines" width="100%" cellspacing="0" cellpadding="6" border="0"><tbody><tr><th colspan=2>Lost Weapons Log </th></tr><tr><td colspan=2 style="border-bottom:none"><div id="lux_sablogs_2"></div></td></tr></tbody></table>');
         $("#lux_sablogs_2").html('<table width="100%" cellspacing="0" cellpadding="6" border="0"><tbody></tbody></table>');

         for (i = 0; i < 5; i++) {
             if (losses[i]) {
                 var cols = losses[i].split(':');
                 $("#lux_sablogs_2>table>tbody").append("<tr><td>" + cols[0] + " " + cols[1] + "s</td><td align=right>" + timeElapsed(cols[2]) + "</td></tr>");
             }
         }
         $("#lux_sablogs_2>table>tbody").append("<tr><td>(<a id='viewSablog'>View All</a>)</td><td>(<a id='clearSablog'>Clear</a>)</td></tr>");
         $("#clearSablog").click(function () {
             sabLogs_clear();
         });
         $("#viewSablog").click(function () {
             sabLogs_viewAll();
         });
     },

     sabLogs_clear: function () {
         db.put("lux_lostWeapons", '');
         $("#lux_sablogs_2>table>tbody>tr>td").parent().remove();
     },

     sabLogs_viewAll: function () {
         $("#lux_sablogs_2").css("overflow-y", "scroll");
         $("#lux_sablogs_2").css("height", "180px");
         var losses = db.get('lux_lostWeapons', '').split(';');
         $("#lux_sablogs_2>table>tbody>tr>td").parent().remove();

         var i;
         for (i = 0; i < losses.length; i++) {
             if (losses[i]) {
                 var cols = losses[i].split(':');
                 $("#lux_sablogs_2>table>tbody").append("<tr><td>" + cols[0] + " " + cols[1] + "s</td><td align=right>" + timeElapsed(cols[2]) + "</td></tr>");
             }
         }
         $("#_lux_sabbed>table>tbody").append("<tr><td>(<a id='viewSablogLess'>View Less</a>)</td><td>(<a id='clearSablog'>Clear</a>)</td></tr>");
         $("#clearSablog").click(function () {
             sabLogs_clear();
         });
         $("#viewSablogLess").click(function () {
             sabLogs_display();
         });
     }
 }
