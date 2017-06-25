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
        battlefield: Battlefield,
        base: Base,
        detail: Detail,
        mercs: Mercs,
        inteldetail: IntelDetail,
        armory: Armory,
        train : Train,
        stats : Stats
    };
});
