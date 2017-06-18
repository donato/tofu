define([
    './pages/armory.php',
    './pages/stats.php',
    './pages/train.php',
    './pages/battlefield.php'
], function(Armory, Stats, Train, Battlefield) {
    return {
        battlefield: Battlefield,
        armory: Armory,
        train : Train,
        stats : Stats
    };
});
