define([
    './pages/attack.php',
    './pages/armory.php',
    './pages/base.php',
    './pages/detail.php',
    './pages/mercs.php',
    './pages/stats.php',
    './pages/train.php',
    './pages/inteldetail.php',
    './pages/battlefield.php'
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
