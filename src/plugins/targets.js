import targetsImg from 'assets/img/targets.gif';
import GUI from 'utils/gui';
import Koc from 'utils/koc_utils';
import SlaylistTemplate from 'handlebars-loader!templates/slaylist.html';
var db = Koc.db;

class Targets {
  showFarmList(targets = []) {
    const maxDa = db.get("maxDa", 1000);
    const maxSentry = db.get("maxSentry", 1000);
    const minTff = db.get("minTff", 10);
    const maxSeconds = db.get("maxSeconds", 120);
    const saMultiplier = db.get("saMultiplier", 0.80);
    const spyMultiplier = db.get("spyMultiplier", 5);
    const tffAdder = db.get("tffAdder", 2000);
    const limitTargets = db.get("limitTargets", 10);

    const html = SlaylistTemplate({
      targets,
      maxDa,
      maxSentry,
      minTff,
      maxSeconds,
      saMultiplier,
      spyMultiplier,
      tffAdder,
      limitTargets
    });

    GUI.displayText(html);

    $("#targets_refresh").click(() => {
      this.getTargets();
    });
    $("#targets_autofill").click(() => {
      var tffAdd = $("input[name='tffAdder']").val();
      var saMult = $("input[name='saMultiplier']").val();
      var spyMult = $("input[name='spyMultiplier']").val();
      $("input[name='minTff']").val(Math.floor(User.tff.int()+tffAdd.int()));
      $("input[name='maxDa']").val(Math.floor(User.sa.int() * saMult ));
      $("input[name='maxSentry']").val(Math.floor(User.spy.int() * spyMult ));
    });
    $("#targets_reset").click(() => {
      $("input[name='minTff']").val(10);
      $("input[name='maxDa']").val(1000);
      $("input[name='maxSentry']").val(1000); 
      $("input[name='limitTargets']").val(10);
      $("input[name='maxSeconds']").val(120);
      $("input[name='saMultiplier']").val(0.80);
      $("input[name='spyMultiplier']").val(5);
      $("input[name='tffAdder']").val(50);
    });
    $("#targets_save").click(() => {
      db.put("maxDa", $("input[name='maxDa']").val().int().toString());
      db.put("maxSentry", $("input[name='maxSentry']").val().int().toString());
      db.put("minTff", $("input[name='minTff']").val().int());
      db.put("limitTargets", $("input[name='limitTargets']").val().int());
      db.put("maxSeconds", $("input[name='maxSeconds']").val().int());
      db.put("saMultiplier", $("input[name='saMultiplier']").val().float().toString());
      db.put("spyMultiplier", $("input[name='spyMultiplier']").val().float().toString());
      db.put("tffAdder", $("input[name='tffAdder']").val().int());
      this.getTargets();
    });
  }

  getTargets() {
    GUI.displayText("Loading...");
    getLux('&a=gettargets' +
        '&t=' + db.get('minTff', 0) + 
        '&d=' + db.get('maxDa', 0) + 
        '&q=' + db.get('maxSeconds', 0) + 
        '&limit=' + db.get('limitTargets', 0) + 
        '&s=' + db.get('maxSentry', 0), 
      (r) => {
        let i;
        if (!r.responseText) {
          this.showFarmList();
          return;
        }
        const rows = r.responseText.split(';');
        const targets = [];
        for (i = 0; i < rows.length - 1; i++) {
          const [
            rank,
            nick,
            kocid,
            // race,
            defense,
            defenseTime,
            sentry,
            sentryTime,
            tff,
            race,
            goldTime,
            ] = rows[i].split(':');
          targets.push({
            rank, nick, kocid, defense, defenseTime, sentry, sentryTime, tff, race, goldTime
          });
        }
        this.showFarmList(targets);
      });
  }
}

const t = new Targets();

export default {
  name: "Farming Targets",
  description: "Targets button added to sidebar",

  defaultEnabled: false,

  run: function () {
    this.addTargetsButton();
  },

  addTargetsButton: function () {
    var $button = $('<a>', {'href': '#'}).append(
      $("<img>", {
        'onclick': 'return false;',
        'class': 'tofu',
        'id': 'sidebar_sabtargets',
        'src': targetsImg
      }));

    $button.click(() => t.getTargets());

    var $leftBarRows = $("td.menu_cell > table> tbody > tr");
    $leftBarRows.eq(2).after($("<tr>").append($button));
  },

};