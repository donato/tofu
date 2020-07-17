define([
    './armory.php',
    './attack.php',
    './attacklog.php',
    './base.php',
    './detail.php',
    './mercs.php',
    './stats.php',
    './train.php',
    './inteldetail.php',
    './battlefield.php'
], function(Armory, Attack, AttackLog, Base, Detail, Mercs, Stats, Train, IntelDetail, Battlefield) {
    return {
        armory: Armory,
        attack: Attack,
        attacklog: AttackLog,
        base: Base,
        battlefield: Battlefield,
        //conquest: Conquest,
        detail: Detail,
        inteldetail: IntelDetail,
        //intelfile: IntelFile,
        mercs: Mercs,
        //recruit: Recruit,
        train : Train,
        stats : Stats
    };
});
