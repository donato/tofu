// ==UserScript==
// @name            Sabotage Race Exploit Fix
// @namespace       http://www.kingsofchaos.com
// @description     Adds all possible weapons
// @version         1.1
// @include         http://*kingsofchaos.com/attack.php*
// @require         //cdnjs.cloudflare.com/ajax/libs/jquery/1.10.2/jquery.min.js
// @require         //cdnjs.cloudflare.com/ajax/libs/underscore.js/1.5.2/underscore-min.js
// ==/UserScript==

var raceSpecific = {
    Dwarves : '<option label="Hammer of Thor" value="25">Hammer of Thor</option><option label="Battle Axe" value="29">Battle Axe</option><option label="Mace" value="17">Mace</option><option label="Warhammer" value="21">Warhammer</option><option label="Hatchet" value="9">Hatchet</option><option label="Gauntlets" value="48">Gauntlets</option><option label="Pike" value="13">Pike</option>',
    Elves   : '<option label="Elven Cloak" value="47">Elven Cloak</option><option label="Steel Bow" value="20">Steel Bow</option><option label="Short Bow" value="8">Short Bow</option><option label="Crossbow" value="12">Crossbow</option><option label="Longbow" value="16">Longbow</option><option label="Flaming Arrow" value="28">Flaming Arrow</option><option label="Steed" value="24">Steed</option>',
    Orcs    : '<option label="Club" value="14">Club</option><option label="Heavy Shield" value="49">Heavy Shield</option><option label="Warg" value="26">Warg</option><option label="Dragon" value="30">Dragon</option><option label="Warblade" value="22">Warblade</option><option label="Sling" value="10">Sling</option><option label="Spear" value="18">Spear</option>',
    Humans  : '<option label="Staff" value="7">Staff</option><option label="Broadsword" value="19">Broadsword</option><option label="Long Sword" value="11">Long Sword</option><option label="Excalibur" value="27">Excalibur</option><option label="Steed"value="23">Steed</option><option label="Lance" value="15">Lance</option><option label="Mithril" value="46">Mithril</option>',
    Undead  : '<option label="Scimitar" value="5">Scimitar</option><option label="Mist Veil" value="50">Mist Veil</option><option label="Dragon Claw" value="6">Dragon Claw</option>'
}

var raceStylesheet = $('head > link:eq(3)').attr('href');
var race = raceStylesheet.split('/').pop().split('.')[0];

// We don't need to add the ones which are already there
delete raceSpecific[race];

$('select[name="enemy_weapon"]').append(_.values(raceSpecific));