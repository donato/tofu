define([
    './attack.php',
    './armory.php',
    './base.php',
    './detail.php',
    './mercs.php',
    './stats.php',
    './train.php',
    './inteldetail.php',
    './battlefield.php'
], function(Attack, Armory, Base, Detail, Mercs, Stats, Train, IntelDetail, Battlefield) {
    return {
        attack: Attack,
        armory: Armory,
        //attacklog: AttackLog,
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
