define(['jquery', 'underscore'], function($,_) {
return {

   showUserOptions: function() {
   
    function makeToggle( name, value, opt1, opt2 ) {
      opt1 = opt1 || "Enabled";
      opt2 = opt2 || "Disabled";
      
      var current = db.get(value, true);
      var html;
      
      var checked = ' checked="checked" ';

      if (current=== true) {
        return "<tr><td> "+name+"</td><td><input type='radio' name='"+value+"' checked='checked' value='true'>"+opt1+"</input>"
            +"<input type='radio' name='"+value+"' value='false'>"+opt2+"</input></tr>";
      } else {
        html = "<tr><td> "+name+"</td><td><input type='radio' name='"+value+"' value='true'>"+opt1+"</input>"
        +"<input type='radio' name='"+value+"' checked='checked' value='false'>"+opt2+"</input></tr>";
      }
      return html;
    }
    
    var c = (User.logself === 1) ?  ' checked="checked"' : '';
    
    var battlelog = db.get('battlelog', 0);
    
    GUI.showMessage('<h3>LuXBOT User Options</h3> <br />\
    <fieldset><legend>User Options</legend>\
      Log own details and gold from base: <input type="checkbox" id="_luxbot_logself"' + c + ' /><br />\
      Battle Log: <input type="radio" name="_luxbot_battlelog" value="0"' + (battlelog === 0 ? ' checked="checked"' : '') + ' />\
        No Action <input type="radio" name="_luxbot_battlelog" value="1"' + (battlelog === 1 ? ' checked="checked"' : '') + ' /> \
        Show Full Log with Bottom Scroll <input type="radio" name="_luxbot_battlelog" value="2"' + (battlelog === 2 ? ' checked="checked"' : '') + ' /> \
        Show Full Log with Top Scroll <input type="radio" name="_luxbot_battlelog" value="3"' + (battlelog === 3 ? ' checked="checked"' : '') + ' /> \
        Show Full Log with Redirect<br />\
      Always Focus Security Pages: <input type="checkbox" id="_luxbot_securitycheck" ' + (db.get('securityfocus', 0) === 1 ? ' checked="checked"' : '') + '/></fieldset>'
      +'<table>'
      +makeToggle("Turn Clock", "option_clock") 
      +makeToggle("Stats In Command Center", "option_commandCenterStats","Top","Side") 
      +makeToggle("Attack Targets", "option_Targets") 
      // +makeToggle("Show Enemy Sab List", "option_sabTargets") 
      +makeToggle("Show Fake Sab Targets", "option_fakeSabTargets") 
      +makeToggle("Show Personal Gold Projections", "option_goldProjection") 
      +makeToggle("Show Stats Changes in Armory", "option_armory_diff") 
      +makeToggle("Show Armory Value Graph in Armory", "option_armory_graph") 
      +"</table>"
      
      + '<br /><br /><input type="button" value="Save!" id="_luxbot_save" /> <br />');
      
    document.getElementById("_luxbot_save").addEventListener('click', GUI.saveUserOptions, true);
  }
 
  , saveUserOptions: function() {

    _.each(Constants.options, function (option) {
      db.put("option_"+option, $("input[name='option_"+option+"']:checked").val());
    });
    
    GUI.toggleGUI();
  }
}});