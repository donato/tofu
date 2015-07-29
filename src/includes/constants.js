define([], function() {

	var baseUrl = "http://luxbot.net/bot/";
	
	return {

		baseUrl     : baseUrl + 'luxbot.php?',
		downloadUrl : baseUrl + 'luxbot.user.js',
		versionUrl  : baseUrl + 'luxbot.version.php',
		
		gitHtml  : 'https://raw.github.com/DonatoB/tofu/master/server/html/',
		
		statsdesc : {0:'Strike Action',1:'Defensive Action',2:'Spy Rating',3:'Sentry Rating',4:'Gold'},

		storedStrings : ['race', 'kocnick','forumName','forumPass','auth','logself'],

		storedNumbers :['kocid','tff','income','sa','da','spy','sentry','spyWeaps','sentryWeaps','daWeaps','saWeaps'],
		
		spyWeaps : ['Rope','Dirk','Cloak','Grappling Hook','Skeleton Key','Nunchaku'],
		
		sentryWeaps : ['Big Candle','Horn','Tripwire','Guard Dog','Lookout Tower'],
		
		daWeaps : ['Helmet','Shield','Chainmail','Plate Armor','Mithril','Elven Cloak','Gauntlets','Heavy Shield','Dragonskin','Invisibility Shield' ],
		
		options : [ 'logself','scrollbattlelog','turnclock','commandCenterStats','targets','fakesabtargets','goldprojection','armorygraph','armorydiff'],
		
		fortifications : {
			'Camp' : 0,
			'Stockade' : 1,
			'Rabid' : 2,
			'Walled' : 3,
			'Towers' : 4,
			'Battlements' : 5,
			'Portcullis' : 6,
			'Boiling Oil' : 7,
			'Trenches' : 8,
			'Moat' : 9,
			'Drawbridge' : 10,
			'Fortress' : 11,
			'Stronghold' : 12,
			'Palace' : 13,
			'Keep' : 14,
			'Citadel' : 15,
			'Hand of God' : 16,
		},
		
		sieges : {
			'None' : 0,
			'Flaming Arrows' : 1,
			'Ballistas' : 2,
			'Battering Rams' : 3,
			'Ladders' : 4,
			'Trojan' : 5,
			'Catapults' : 6,
			'War Elephants' : 7,
			'Siege Towers' : 8,
			'Trebuchets' : 9,
			'Black Powder' : 10,
			'Sappers' : 11,
			'Dynamite' : 12,
			'Greek Fire' : 13,
			'Cannons' : 14
		}
	}
});