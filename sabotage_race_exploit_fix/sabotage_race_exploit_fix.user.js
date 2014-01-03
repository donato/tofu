// ==UserScript==
// @name           Ultimate Sabber
// @namespace      http://www.kingsofchaos.com
// @description    adds all possible weapons
// @include        http://www.kingsofchaos.com/attack.php?*
// @include        http://www.kingsofchaos.com/attack.php
// ==/UserScript==


dw='<option label="Hammer of Thor" value="25">Hammer of Thor</option><option label="Battle Axe" value="29">Battle Axe</option><option label="Mace" value="17">Mace</option><option label="Warhammer" value="21">Warhammer</option><option label="Hatchet" value="9">Hatchet</option><option label="Gauntlets" value="48">Gauntlets</option><option label="Pike" value="13">Pike</option>';
el='<option label="Elven Cloak" value="47">Elven Cloak</option><option label="Steel Bow" value="20">Steel Bow</option><option label="Short Bow" value="8">Short Bow</option><option label="Crossbow" value="12">Crossbow</option><option label="Longbow" value="16">Longbow</option><option label="Flaming Arrow" value="28">Flaming Arrow</option><option label="Steed" value="24">Steed</option>';
or='<option label="Club" value="14">Club</option><option label="Heavy Shield" value="49">Heavy Shield</option><option label="Warg" value="26">Warg</option><option label="Dragon" value="30">Dragon</option><option label="Warblade" value="22">Warblade</option><option label="Sling" value="10">Sling</option><option label="Spear" value="18">Spear</option>';
hu='<option label="Staff" value="7">Staff</option><option label="Broadsword" value="19">Broadsword</option><option label="Long Sword" value="11">Long Sword</option><option label="Excalibur" value="27">Excalibur</option><option label="Steed"value="23">Steed</option><option label="Lance" value="15">Lance</option><option label="Mithril" value="46">Mithril</option>';
un='<option label="Scimitar" value="5">Scimitar</option><option label="Mist Veil" value="50">Mist Veil</option><option label="Dragon Claw" value="6">Dragon Claw</option>';

var alltables = document.getElementsByTagName('table');
race = "";
for (i=0;i<alltables.length;i++) {
	if(alltables[i].rows[0].cells.length==1){
		if(alltables[i].rows[0].cells[0].innerHTML.match("Sabotage Mission")){
			value = alltables[i].rows[1].cells[1].innerHTML;
			if( value.match("Pike"))
				race = "Dwarves";
			else if(value.match("Crossbow") )
				race ="Elves";
			else if(value.match("Spear"))
				race ="Orcs";
			else if(value.match("Lance"))
				race ="Humans";
			else if(value.match("Scimitar"))
				race ="Undead";
		}
	}
}
toAdd = "";
if (race == "Dwarves") toAdd=el+or+hu+un;
if (race == "Orcs") toAdd=dw+el+hu+un;
if (race == "Humans") toAdd=dw+el+or+un;
if (race == "Elves") toAdd=dw+or+hu+un;
if (race == "Undead") toAdd=dw+or+hu+el;

for (i=0;i<alltables.length;i++) {
	if(alltables[i].rows[0].cells.length==1){
		if(alltables[i].rows[0].cells[0].innerHTML.match("Sabotage Mission")){
			value = alltables[i].rows[1].cells[1].innerHTML;
			value =  	 value.replace("</select>","");
			value = value + toAdd+"</select>";
			alltables[i].rows[1].cells[1].innerHTML= value;
		}
	}
}