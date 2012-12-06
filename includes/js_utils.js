
    
    //
    // Javascript Shortcuts
    //
    String.prototype.trim = function () {return this.replace(/^\s+|\s+$/g, '');};
    String.prototype.between = function(first,second) {
            var x = this.indexOf(first) + first.length;
            var z = this.substring(x);
            var y = z.indexOf(second);
            return z.substring(z,y);
    };
    String.prototype.instr = function(strFind){return (this.indexOf(strFind) >= 0);};
    String.prototype.int = function() {
        var r = parseInt(this.replace(/,/g,''),10);
        if (isNaN(r)) r=-1;
        return r;
        };
    String.prototype.float = function() {
        var r = parseFloat(this.replace(/[^0-9\.]*/g,''),10);
        if (isNaN(r)) r=-1;
        return r;
        };
    Number.prototype.int = function() {
        return this;
    }

    function to_int(str) {
        str = str.replace(/[^0-9]/g, '');
        if (str === '') {
            return '';
        }
        return parseInt(str, 10);
    }
    
    function remove_delimiters(str) {
        str = str.replace(/[;:&?]/g,'');
        return str;
    }    

    function textBetween (str,first,second) {
        if (str === null) {
            alert("Unexpected page formatting, please reload.");
            return "";
        }
        var x = str.indexOf(first) + first.length;
        var z = str.substr(x);
        var y = z.indexOf(second);
        return z.substr(z,y);
    }
    
    function html_row() {
        // Turn the arguments object into an array
        var arr = [].slice.call(arguments)
        return "<tr><td>"+arr.join("</td><td>")+"</td></tr>";
    }
    
    function addCSS(cssText) {
        $("head").append("<style>"+cssText+"</style>");
    }
    
    function addJS(jsText) {
        //$("head").append('<script>'+jsText+'</script>');
        
        
        var head = document.getElementsByTagName("head")[0];
        if (!head) {
            return;
        }
        var style = document.createElement("script");
        style.type = "text/javascript";
        style.innerHTML = jsText;
        head.appendChild(style);
        
    }
    
    function striptags(html) {
        var re= /<\S[^>]*>/g;
        return html.replace(re, " ").replace(/^\s+|\s+$/g, '');
    }
    
    function addCommas(sValue) {

    sValue = String(sValue);
        var sRegExp = new RegExp('(-?[0-9]+)([0-9]{3})');
        
        while(sRegExp.test(sValue)) {
            sValue = sValue.replace(sRegExp, '$1,$2');
        }
        return sValue;
    }
    