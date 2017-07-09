/*
// ==UserScript==
// @name           Koc Addon Recruit Helper
// @namespace      http://*kingsofchaos.com/*
// @description    Help in recruiting : Remember messages sent to users and when they were sent etc.
// @include        http://*kingsofchaos.com/*
// @exclude		   http://www.kingsofchaos.com/confirm.login.php*
// @exclude		   http://*.kingsofchaos.com/index.php*
// @exclude		   http://*.kingsofchaos.com/error.php*
// ==/UserScript==

var CurrentURL = document.URL;
PageURL = CurrentURL.split(".com/");
PageURL = PageURL[1].split(".php");

if (PageURL[0] == "writemail") {

    var stuff = document.body.innerHTML;
    nick = stuff.split("<b>To:</b> ");
    nick = nick[1].split("</th>"); 
    nick = nick[0];
    nick = nick.replace(/\n/g,"").replace(/&nbsp;.* /g,"");
    statid = document.getElementsByName("to")[0].value;

    var d = new Date()
    var ds = "" + d.getTime() + "";
    if (GM_getValue('KoC_Message_Time_' + statid)) {
        timespan = Math.floor((ds - Math.floor(GM_getValue('KoC_Message_Time_' + statid))) / 1000);
        var time = duration(timespan);
        var th = document.getElementsByTagName('th');
        for(i=0;i< th.length;i++) {
          if((th[i].innerHTML.match('To:')) && (!(th[i].innerHTML.match('Subject:')))) {
            th[i].innerHTML += '&nbsp;&nbsp;&nbsp;<span title="Subject: '+ GM_getValue('KoC_Message_Subj_'+statid) + "\nMessage:\n" + GM_getValue('KoC_Message_Msg_'+statid).replace(/<br>/g,"\n") + '">[Last Msg: '+ time + ']</span>';
             break;
           }
         }
    }


  var sendbut = document.getElementsByName("send")[0];
  sendbut.addEventListener('click', function(event) {
      var message = document.getElementsByTagName('textarea')[0].value.replace(/\n/g,'<br>'); 
      var q = document.getElementsByTagName('input'); 
      for (var j=0; j < q.length; j++) {
         if (q[j].type == 'text') {
           if(q[j].name == 'subject')
             subject = q[j].value;
         }
       }
      GM_setValue('KoC_Message_Nick_' + statid, nick);
      GM_setValue('KoC_Message_Subj_' + statid, subject);
      GM_setValue('KoC_Message_Msg_' + statid, message);
      GM_setValue('KoC_Message_Time_' + statid, ds);

  },true);
}

if (PageURL[0] == "inbox") {
 var delbut = document.getElementsByName("delete_all_to_messages")[0];
 var detailsbut = document.createElement('input');
 detailsbut.setAttribute("type","button");
 detailsbut.setAttribute("name","outgoing_message_details");
 detailsbut.setAttribute("id","ogm_details");
 detailsbut.setAttribute("value","Details");
 detailsbut.addEventListener('click', function(event) {
 var valarr = GM_listValues();
 var idstime = new Array();
  for each (var val in GM_listValues()) {
   if (val.match("KoC_Message_Time_")) {
    var temprow = new Array(val.replace(/KoC_Message_Time_/g,""),GM_getValue(val));
    idstime.push(temprow);
   }
  }
  idstime.sort(function(a,b){return b[1]-a[1]}); 

  var tds = document.getElementsByTagName('td'); 
  for(i=0;i<tds.length;i++) { 
    if (tds[i].getAttribute("class") == "content") { 
      var content = tds[i]; 
      break 
    }
  }

  var detailsHTML = "<table width=\"100%\" bgcolor=\"#000000\" border=\"0\" cellspacing=\"6\" cellpadding=\"6\">\n\t<tr>\n\t\t<th>To</th>\n\t\t<th>Subject</th>\n\t\t<th>Sent</th>\n\t\t<th>Message</th></tr>"

 for each (var pair in idstime) {
    statid = pair[0];
    var d = new Date()
    var ds = "" + d.getTime() + "";
    timespan = Math.floor((ds - Math.floor(GM_getValue('KoC_Message_Time_' + statid))) / 1000);
    toname = GM_getValue("KoC_Message_Nick_"+statid);
    tosubj = GM_getValue('KoC_Message_Subj_'+statid);
    if (toname == null) { toname = statid; }
    if (tosubj == "") { tosubj = "None"; }
    rowHTML = '<tr id="msg_row_'+statid+'"><td><a href="stats.php?id='+statid+'">'+ toname +'</a></td><td>'+ tosubj +'</td><td>'+duration(timespan)+'</td><td align="center"><input type="button" id="og_msg_'+statid+'" value="Show"></td></tr>';
    detailsHTML += rowHTML; 
  }
 content.innerHTML = detailsHTML;

 for each (var pair in idstime) {
  statid = pair[0];
  document.getElementById("og_msg_"+statid).addEventListener('click',(function(statid){ return function() { displaymsg(GM_getValue("KoC_Message_Msg_"+statid),statid,this.value); this.value = ((this.value == "Show") ? "Hide" : "Show"); } })(statid),false);
 }
 

 },true);
 delbut.parentNode.insertBefore(detailsbut,delbut);
}

function displaymsg ( msg, statid, toggle ) {
 if (toggle == "Show") {

 var therow = document.getElementById("msg_row_"+statid);
 var msgrow = document.createElement('tr');
 msgrow.setAttribute('id','the_msg_'+statid);
 msgrow.innerHTML = "<td style=\"padding-left: 30px; padding-right: 30px;\" colspan=\"4\" width=\"100%\">\n\t\t<table width=\"100%\" bgcolor=\"#888888\" cellpadding=\"6\" cellspacing=\"0\">\n\t\t<tbody><tr>\n\t\t\t<td style=\"border: 1px solid rgb(136, 136, 136);\" colspan=\"3\" bgcolor=\"#111111\"><p style=\"padding-left: 15px;\">"+ msg +"</p></td>\n\t\t</tr>\n\t\t</tbody></table>\n\t\t</td>"
 therow.parentNode.insertBefore(msgrow,therow.nextSibling);
 } else {
  var msgrow = document.getElementById('the_msg_'+statid);
  msgrow.parentNode.removeChild(msgrow);
 }
}

function duration ( timespan ) {
  time = "";
  if ((timespan > 1209600) && (time === "")) time += Math.floor(timespan / 604800) + ' weeks ago';
  if ((timespan > 604800) && (time === "")) time += '1 week ago';
  if ((timespan > 172800) && (time === "")) time += Math.floor(timespan / 86400) + ' days ago';
  if ((timespan > 86400) && (time === "")) time += '1 day ago';
  if ((timespan > 7200) && (time === "")) time += Math.floor(timespan / 3600) + ' hours ago';
  if ((timespan > 3600) && (time === "")) time += '1 hour ago';
  if ((timespan > 120) && (time === "")) time += Math.floor(timespan / 60) + ' minutes ago';
  if ((timespan > 60) && (time === "")) time += '1 minute ago';
  if ((timespan > 1) && (time === "")) time += timespan + ' seconds ago';
  if (time === "") time += '1 second ago';
  return time;
}
*/
