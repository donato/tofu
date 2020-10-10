define([], function () {
  const statsUrl = 'http://donatoborrello.com/stats/';
  const baseUrl = 'http://donatoborrello.com/bot/';


  const TOFU_VERSION = "0.10";

    // name, cost, strength
    var ALL_WEAPONS = {
        "Knife": {"price": 1000, "str": 1},
        "Sling": {"price": 2000, "str": 2},
        "Short Bow": {"price": 2000, "str": 2},
        "Hatchet": {"price": 2000, "str": 2},
        "Staff": {"price": 2000, "str": 2},
        "Long Sword": {"price": 5000, "str": 5},
        "Crossbow": {"price": 5000, "str": 5},
        "Pike": {"price": 5000, "str": 5},
        "Club": {"price": 5000, "str": 5},
        "Lance": {"price": 10000, "str": 10},
        "Longbow": {"price": 10000, "str": 10},
        "Spear": {"price": 10000, "str": 10},
        "Mace": {"price": 10000, "str": 10},
        "Steel Bow": {"price": 25000, "str": 30},
        "Warhammer": {"price": 25000, "str": 30},
        "Warblade": {"price": 25000, "str": 30},
        "Warg": {"price": 50000, "str": 64},
        "Steed": {"price": 50000, "str": 64},
        "Hammer Of Thor": {"price": 50000, "str": 64},
        "Broadsword": {"price": 25000, "str": 30},
        "Excalibur": {"price": 200000, "str": 256},
        "Flaming Arrow": {"price": 200000, "str": 256},
        "Battle Axe": {"price": 200000, "str": 256},
        "Dragon": {"price": 200000, "str": 256},
        "Chariot": {"price": 450000, "str": 600},
        "Blackpowder Missile": {"price": 1000000, "str": 1000}
    };

    return {
      TOFU_VERSION,
        statsUrl,
        baseUrl: baseUrl + 'luxbot.php?',
        downloadUrl: baseUrl + 'luxbot.user.js',
        versionUrl: baseUrl + 'luxbot.version.php',

        gitHtml: 'https://raw.github.com/DonatoB/tofu/master/server/html/',

        statsdesc: {0: 'Strike Action', 1: 'Defensive Action', 2: 'Spy Rating', 3: 'Sentry Rating', 4: 'Gold'},

        storedStrings: ['race', 'kocnick', 'forumName', 'forumPass', 'auth', 'logself'],

        storedNumbers: ['kocid', 'tff', 'income', 'sa', 'da', 'spy', 'sentry'],

        saWeaps: Object.keys(ALL_WEAPONS),
        
        spyWeaps: ['Rope', 'Dirk', 'Cloak', 'Grappling Hook', 'Skeleton Key', 'Nunchaku'],

        sentryWeaps: ['Big Candle', 'Horn', 'Tripwire', 'Guard Dog', 'Lookout Tower'],

        daWeaps: ['Helmet', 'Shield', 'Chainmail', 'Plate Armor', 'Mithril', 'Elven Cloak', 'Gauntlets', 'Heavy Shield', 'Dragonskin', 'Invisibility Shield'],

        options: ['logself', 'scrollbattlelog', 'turnclock', 'commandCenterStats', 'targets', 'fakesabtargets', 'goldprojection', 'armorygraph', 'armorydiff'],
    }
});