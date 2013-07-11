Plugins['recon_request'] = {
	description : "Recon request system"
	
	, defaultEnabled : true
	
	, run : function() {
		this.initReconRequest();
	}
	
    , initReconRequest : function() {
        var x = $('<div id="_luxbot_ReconRequestPopup" style="display:none; position: absolute; top:0px; margin:15px; padding:20px;background-color: black; border: 1px solid green; font-family: arial; font-size: 10px;  overflow: auto;">');
        $("body").append(x);
        x.css("left",(document.body.clientWidth/2)-100 + "px");
        $("#_luxbot_ReconRequestPopup").click(function () {
            this.toggleReconRequestPopup(! db.get('reconRequest'));
        });

        this.toggleReconRequestPopup(db.get('reconRequest') !== 0);
    }

    , addRequestRecon: function() {
        var getopponent = document.getElementsByName('defender_id');
        var data = getopponent[0].value;
        document.getElementById("_luxbot_requestRecon").disabled = true;
        document.getElementById("_luxbot_requestRecon").style.color = "gray";
        postLux('&a=reconrequest','kocid=' +data, function(r,debug) {
                if(r.responseText == 'OWK') {
                    alert('A request has already been sent.');
                } else if(r.responseText == 'OK') {
                    alert('Your request has been sent.');
                } else {
                    alert('Your request could not be sent, try again later!'+r.responseText);
                }
        });
    }
    
    , toggleReconRequestPopup: function (bool) {
        //if bool == true, then show info
        //if bool == false then hide and show number
        
        getLux('&a=reconrequestlist',
            function(r, debug) {
                var i;
                var q = $('#_luxbot_ReconRequestPopup');
                var incoming = r.responseText.split(';');
                var numberRequests = r.responseText.split('(s)').length - 1;
                
                if (numberRequests > 0) {
                    q.slideDown();
                    var stringBuilder = "<span style=\"color: red;\">("+numberRequests+") Recon Requests</span><br />";
                    if (bool) {
                        for (i = 0; i < incoming.length; i++) {
                            var info = incoming[i].split(':');
                            stringBuilder+= info[0]+" | <a href='stats.php?id="+info[1]+"'>"+info[2]+"</a> by "+info[3]+ "<br />";
                        }
                        db.put('reconRequest', 1);        
                    } else {
                        db.put('reconRequest', 0);
                    }
                    q.html(stringBuilder);
                }
        });
    }
}
