define([
    'jquery',
    'underscore',
    'utils/koc_utils',
    'utils/constants',
    'utils/gui',
    'libs/hex_md5',
    'handlebars-loader!templates/welcome.html'
], function($, _, KoC, Constants, GUI, empty, WelcomeTemplate) {
    var Page = KoC.Page;
    var db = KoC.db;

	var Init = {
        loadUser : function(action) {
            var kocid;
            if (action === 'base') {
                var html = document.body.innerHTML.split("stats.php?id=");
                html = html[1];
                kocid = html.slice(0, html.indexOf('"'));
            }

            db.init(kocid);

            if (db.id === 0) return false;

            var userObject = {};

            _.map(Constants.storedStrings, function(val) {
                userObject[val] = db.get(val, '');
            });

            _.map(Constants.storedNumbers, function (val) {
                log(val + ': '+ db.get(val));
                userObject[val] = db.get(val, 0);
            });

            var d = new Date();
            userObject.time_loaded = d.getTime();
            userObject.gold = Page.getPlayerGold();

            return userObject
        }

        , checkForUpdate: function(startup) {
            if (db.get("luxbot_version",0) != version) {
                db.put("luxbot_version", version);
                db.put("luxbot_needsUpdate",0);
            }
            if (startup === 1 && db.get("luxbot_needsUpdate",0) === 1) {
                setTimeout(function() {
                    $("#_luxbot_gui>ul").append("<li id='getUpdate' style='padding-top:5px;color:yellow'>Get Update!</li>");
                    $("#getUpdate").click(function() {
                        openTab(Constants.downloadUrl);
                    });
                }, 1000);
                return;
            }

            var now = new Date();
            var lastCheck = db.get('luxbot_lastcheck', 0);

            if (startup != 1 || (now - new Date(lastCheck)) > (60*1000)) {
                get( Constants.versionUrl,
                    function(responseDetails) {
                        var latestVersion = Number(responseDetails.responseText.replace(/\./, ''));
                        var thisVersion = Number(version.replace(/\./, ''));
                        if (latestVersion > thisVersion) {
                            db.put("luxbot_needsUpdate",1);
                            db.put("luxbot_version", version);
                            if (startup != 1) {
                                alert("There is an update!");
                                openTab(Constants.downloadUrl);
                            }
                        } else if (startup !== 1) {
                            alert("You are up to date!");
                        }
                    }
                );
                db.put('luxbot_lastcheck', now.toString());
            }
        },
        checkUser: function(User) {
            if (User.forumName === 0 || User.forumPass === 0 || User.forumName === undefined
              || User.forumPass === undefined || !User.auth
              || User.auth.length !== 32) {
                    Init.showInitBox();
                    return 0;
            } else {
                getLux('&a=vb_auth',
                    function(r) {
                        if (r.responseText == '403') {
                            Init.showInitBox();
                            return 0;
                        }

                        var x = r.responseText.split(';');
                        var logself = x.shift();

                        stats = {'tffx':x.shift(), 'dax':x.shift(), 'goldx':x.shift()};

                        var temp = document.getElementById('_luxbot_showMessageBox');
                        if (!temp) return;
                        temp.innerHTML = 'Show Messages (' + (x.length-1) + ')';

                        // messages is a global var
                        // if ((Tofu.messages = x.pop()) === '1') {
                            // GUI.showMessageBox();
                        // }
                    });
                return 1;
            }
            return 1;
        }

        , showInitBox: function () {
            
            if (KoC.Page.getCurrentPage() !== "base") {
                $("body").first().prepend('<p style="position:absolute">Visit Command Center to login</p>')
                return;
            }


            function initLogin() {
                var f_user = $("#_forum_username").val();
                var f_pass = $("#_forum_password").val();

                if (f_pass === '' || f_user === '') {
                    return;
                }

                GUI.displayText("Verifying...<br />");

                var html = $("body").html();
                var user = textBetween(html,'<a href="stats.php?id=', '</a>');
                user = user.split('">' );

                db.put('kocnick', user[1]);
                db.put('kocid', user[0]);

                var password = hex_md5(f_pass);
                db.put('forumPass', password);
                db.put('forumName', f_user);
                initVB();
            }

            function initVB() {

                getLux('&a=dokken_login&kocid=' + db.get('kocid')+'&username=' + db.get('forumName','')+"&password="+db.get('forumPass'),
                    function(r) {
                        var ret = r.responseText;
                        if (ret.length === 0 || ret.indexOf("Error") === -1) {
                            //success
                            db.put('auth', ret);

                            alert("Success");
                            GUI.hide();
                        } else {
                            GUI.displayText("There was an error, try refreshing your command center.");
                        }
                    }
                );
            }

            var welcomeText = WelcomeTemplate({});;
            GUI.displayText( welcomeText );

            $("#_luxbot_login").click(initLogin);
        }
    };
    return Init;
});