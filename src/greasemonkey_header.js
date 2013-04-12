// ==UserScript==
// @name            ToFu Script
// @description     The next generation of Kingsofchaos enhancement
// @version         0.20121110
// @include         http://*kingsofchaos.com/*
// @exclude         http://*kingsofchaos.com/chat/*
// @require         https://raw.github.com/DonatoB/tofu/master/server/libs/jquery-1.8.3.min.js
// @require         https://raw.github.com/DonatoB/tofu/master/server/libs/underscore-1.4.2.min.js
// @require         https://raw.github.com/DonatoB/tofu/master/server/libs/hex_md5.js
// @require         https://raw.github.com/DonatoB/tofu/master/server/libs/highstock-1.1.5.js
// @resource    sidebar_targets      https://raw.github.com/DonatoB/tofu/master/server/img/sidebar_targets.gif
// @resource    sidebar_sabtargets   https://raw.github.com/DonatoB/tofu/master/server/img/sidebar_sabtargets.gif
// @resource    styles				 https://raw.github.com/DonatoB/tofu/master/server/css/styles.css
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @grant       GM_xmlhttpRequest
// @grant       GM_openInTab
// @grant       GM_log
// @grant       GM_addStyle
// @grant       GM_getResourceText
// @grant       GM_getResourceURL
// ==/UserScript==

// Info on GM resources : http://stackoverflow.com/questions/5250187/greasemonkey-image-not-showing

// For information on the development of this through the ages please visit: http://stats.luxbot.net/about.php

var Plugins = {};