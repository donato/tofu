import Koc from 'utils/koc_utils';
import Log from 'plugins/luxbot-logging';
import $ from 'jquery';

export default {
  run: function () {
    const attackReport = $("td.report:first").text();
    if (attackReport.indexOf('counter-attack') == -1) {
      this.processAttackDefended(attackReport);
      return;
    } else {
      this.processAttack(attackReport);
    }
  },

  processAttackDefended: function(attackReport) {
    //TODO(): Implement attack defended!
  },

  processAttack: function (attackReport) {
    let time = 'now';
    if (document.URL.indexOf('&suspense=') == -1) {
      // This is a hack to try to distinguish between when an attack log is visited immediately
      // versus clicked as a link from the attacklogs page.
      time = 'unknown';
    }

    const your_damage = to_int(textBetween(attackReport, 'Your troops inflict', ' damage on the enemy!'));
    const enemy_damage = to_int(textBetween(attackReport, 'counter-attack and inflict ', ' damage on your army!'));
    const your_losses = to_int(textBetween(attackReport, 'Your army sustains ', ' casualties'));
    const enemy_losses = to_int(textBetween(attackReport, 'The enemy sustains ', ' casualties'));

    const attack_id = Koc.Page.getCurrentPageId('attack_id');
    var enemy_id = $("form > input [name='id']").val();
    enemy_id = textBetween(attackReport, 'name="id" value="', '"');
    enemy_id = $("input[name='id']").val();
    const enemy_name = attackReport.match(/As (.*)'s army runs from the/)[1];
    const gold_stolen = to_int(textBetween(attackReport, 'You stole ', ' gold'));

    Log.sendAttackLogDetails(User.kocnick, "attack", enemy_id, enemy_name, your_damage, enemy_damage, your_losses, enemy_losses, gold_stolen, attack_id, time);
  }
};