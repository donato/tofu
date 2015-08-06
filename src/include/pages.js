define([
    './pages/stats.php',
    './pages/train.php'
], function(Stats, Train) {
    return {
        train : Train,
        stats : Stats
    };
})
