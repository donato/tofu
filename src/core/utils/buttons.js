define([
    'jquery',
], function($) {

  return {
    gold : 0,
    cost_col : 0,
    
    btn_update: function() {
      function currentExpenditure($rows) {
        var total_cost = 0;
        $rows.each(function(idx) {
          var $this = $(this);
          var amount = $this.find("input").first().val() || 0;    
          var price = $this.find("input.btn_helper").first().attr('cost');
          total_cost += (amount*price || 0);
        }); 
        return total_cost;
      }
      
      var cur_cost = currentExpenditure(this.$rows);
      var money_left = Math.max(0, this.gold - cur_cost);
      
      var self = this;
      this.$rows.each(function() {
        var $this = $(this);
        var $btn = $this.find("input.btn_helper").first();
        
        var newVal = Math.floor( money_left / $btn.attr("cost"));
        if ( typeof(self.constraintFunc) == typeof(Function)) {
          newVal = self.constraintFunc(newVal, $this);
        }
        $btn.val( newVal )
      });
    }
    , init: function(gold, $table, costColumnIndex, constraintFunc) {
      this.gold = gold;
      this.cost_col = costColumnIndex;
      this.$rows = $table.find("tr:has(input[type='text'])");
      this.constraintFunc = constraintFunc;
      
      var self = this;
      
      $table.find("input").keyup(function() {
        self.btn_update(); 
      });
      
      this.$rows.each(function(index,element) {
        var $cols = $(element).children("td");
        var cost = $cols.eq(costColumnIndex).text().int();
        if (cost > 0)
          $(element).append("<td><input type='button' cost="+cost+" value=0 class='btn_helper' /></td>");
      });
      
      this.btn_update();
      
      $(".btn_helper").click(function(element) {
        var amount = $(element.target).val();
        $(this).parent().parent().find("input").eq(0).val(amount);
        self.btn_update(); 
      });
    }
  }
});
