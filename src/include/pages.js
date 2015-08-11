define([
    './pages/armory.php',
    './pages/stats.php',
    './pages/train.php'
], function(Armory, Stats, Train) {
    return {
        armory: Armory,
        train : Train,
        stats : Stats
    };
})
