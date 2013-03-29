
	
    //
    // Auto-fill buttons
    //
var Buttons = {
    btn_update: function(rows, num_rows, cost_col, max_col) {
        function btn_cost(rows) {
            var total_cost = 0;
            $(".btn_go").each(function(i,e) {
                var amount = $(e).parent().parent().find("input").eq(0).val();    
                if (amount === '')
                    amount=0;
                var price = $(e).attr('cost');
                
                total_cost += amount*price;
            }); 
            return total_cost;
        }
        
        var g = String(User.gold).replace(/[^0-9]/g,'');    
        var cur_cost = btn_cost(rows);
        var money_left = Math.max(0, g - cur_cost);
        
        var sum_trained=0;
        rows.each(function(index,element) {
            var cols = $(element).children("td");
            //alert($(cols).size()+" "+num_rows);
            if ($(cols).size() == (1+num_rows)) {
                var cost = $(element).find("td>input:eq(1)").attr("cost");

                var amount = Math.floor(money_left/cost);
                if(max_col) {
                    var max = $(cols).eq(max_col).text().replace(/[^0-9]/g,'');
                    amount = Math.min(amount, max);
                }
                if (document.URL.match('train.php')) {
                    sum_trained += parseInt($(cols).eq(2).children("input").val(), 10);
                }
                $(element).find(".btn_go").val(amount);
            }
        });
        
        if (document.URL.match('train.php')) {        
            var untrained = $("table.personnel>tbody>tr").eq(5).find("td").eq(1).text().replace(/[^0-9]/g,'');
            
            untrained = untrained - sum_trained;
            rows.each(function(i,e) {
                var a = $(e).find(".btn_go").val();    
                
                a = Math.min(a,untrained);
                $(e).find(".btn_go").val(a);
            });
        }
    }

    , init: function(rows, num_rows, cost_col, max_col) {
		var self = this;
        $(rows).find("input").keyup(function() {
            self.btn_update(rows, num_rows, cost_col, max_col); 
        });
        rows.each(function(index,element) {
            var cols = $(element).children("td");
            if ($(cols).size() == num_rows) {
                var cost = $(cols).eq(cost_col).text().replace(/[^0-9]/g,'');
                if (cost > 0)
                    $(element).append("<td><input type='button' cost="+cost+" value=0 class='btn_go' /></td>");
            }
        });
        
        this.btn_update(rows, num_rows, cost_col, max_col);
        
        $(".btn_go").click(function(element) {
            var amount = $(element.target).val();
            $(this).parent().parent().find("input").eq(0).val(amount);
            self.btn_update(rows, num_rows, cost_col, max_col); 
        });
    }

}

