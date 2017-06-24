define([
    './pages/armory.php',
    './pages/stats.php',
    './pages/train.php',
    './pages/inteldetail.php',
    './pages/battlefield.php'
], function(Armory, Stats, Train, IntelDetail, Battlefield) {
    return {
        battlefield: Battlefield,
        inteldetail: IntelDetail,
        armory: Armory,
        train : Train,
        stats : Stats
    };
});
