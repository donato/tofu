    String.prototype.trim = function () {
		return this.replace(/^\s+|\s+$/g, '');
	};
	
    String.prototype.between = function(first,second) {
            var x = this.indexOf(first) + first.length;
            var z = this.substring(x);
            var y = z.indexOf(second);
            return z.substring(z,y);
    };
	
    String.prototype.instr = function(strFind){
		return (this.indexOf(strFind) >= 0);
	};

    String.prototype.int = function() {
        var r = parseInt(this.replace(/,/g,''), 10);
        if (isNaN(r)) r=-1;
        return r;
    };
	
    String.prototype.float = function() {
        var r = parseFloat(this.replace(/[^0-9\.\-]*/g,''), 10);
        if (isNaN(r)) r=-1;
        return r;
    };
	
    Number.prototype.int = function() {
        return this;
    }

    function to_int(str) {
        str = str.replace(/[^0-9\.\-]/g, '');
        if (str === '') {
            return -1;
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

    var addCommas = function () {
        var sRegExp = new RegExp('(-?[0-9]+)([0-9]{3})');

		return function (sValue) {
			sValue = String(sValue);
			
			while(sRegExp.test(sValue)) {
				sValue = sValue.replace(sRegExp, '$1,$2');
			}
			return sValue;
		};
	}();

	Math.log10 = function(val) {
		return Math.log(val)/Math.LN10;
	}