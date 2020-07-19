define([
    './armory.php',
    './attack.php',
    './attacklog.php',
    './base.php',
    './conquest.php',
    './detail.php',
    './intelfile.php',
    './mercs.php',
    './stats.php',
    './recruit.php',
    './training.php',
    './inteldetail.php',
    './battlefield.php'
], function(Armory, Attack, AttackLog, Base, Conquest, Detail, IntelFile, Mercs, Stats, Recruit, Training, IntelDetail, Battlefield) {
    return {
      // Verified
      armory: Armory,
      attacklog: AttackLog,
      base: Base,
      battlefield: Battlefield,
      conquest: Conquest,
      inteldetail: IntelDetail,
      intelfile: IntelFile,
      mercs: Mercs,
      recruit: Recruit,
      stats : Stats,

      // Working, not updated
      attack: Attack,
      detail: Detail,

      // // Not verified
      // training : Training,

      // // Not implemented
      // upgrades: Upgrades,
      // safe: Safe,
      // statistics: Statistics,
      // trade: Trade,
    };
});
