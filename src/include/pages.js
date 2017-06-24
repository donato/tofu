define([
    './pages/armory.php',
    './pages/detail.php',
    './pages/mercs.php',
    './pages/stats.php',
    './pages/train.php',
    './pages/inteldetail.php',
    './pages/battlefield.php'
], function(Armory, Detail, Mercs, Stats, Train, IntelDetail, Battlefield) {
    return {
        battlefield: Battlefield,
        detail: Detail,
        mercs: Mercs,
        inteldetail: IntelDetail,
        armory: Armory,
        train : Train,
        stats : Stats
    };
});
