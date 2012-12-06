// ==UserScript==
// @name            ToFu Script
// @description     The next generation of Kingsofchaos enhancement
// @version         0.20121110
// @include         http://*kingsofchaos.com/*
// @exclude         http://*kingsofchaos.com/chat/*
// @require            http://cdnjs.cloudflare.com/ajax/libs/jquery/1.8.2/jquery.min.js
// @require            http://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.4.2/underscore-min.js
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @grant       GM_xmlhttpRequest
// @grant       GM_openInTab
// @grant       GM_log
// @grant       GM_addStyle
// @grant       GM_getResourceText
// @grant       GM_getResourceURL
// @resource    sidebar_targets      http://www.luxbot.net/download/img/sidebar_targets.gif
// @resource    sidebar_sabargets    http://www.luxbot.net/download/img/sidebar_sabtargets.gif
// @resource    styles    http://www.luxbot.net/download/css/styles.css
// ==/UserScript==

// Info on GM resources : http://stackoverflow.com/questions/5250187/greasemonkey-image-not-showing

//
// For information on the development of this through the ages please visit: http://stats.luxbot.net/about.php
// 


!function($, document) {

    "use strict";
    
    //version is year, month, day OR yymmdd
    var version = '0.4.121103';
    var serverURL = 'luxbot.net/bot/';
    var baseURL = 'http://' + serverURL + 'luxbot.php?';

	
 
    // GLOBALS - Remove ASAP
	var Plugins = {}
    var widget        // For lux popups
      , previd         // For battlefield, which user is displaying stats of
      , guicontent
      , messages
      , stats
      , rows
      , kocid
