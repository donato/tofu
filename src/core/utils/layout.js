import $ from 'jquery';

function collapseTable(table) {
  var $table = $(table)
  $table.find(".expando").text("+")
  $table.addClass("collapsed_table")
}

function onTableClick(e) {        
  var $table = $(e.target).closest("table")

  if ($table.is(".collapsed_table")) {
    $table.find(".expando").text("-");
  } else {
    $table.find(".expando").text("+");
  }
  $table.toggleClass("collapsed_table");

  saveCollapsed();
}

function saveCollapsed() {
  var store = [];
  $("table").each(function(i,e) {
    if ($(e).is(".collapsed_table"))
      store.push(i)
  });
  db.put('coltables_' + action, store.join(','));
}

function popup(element, txt) {
  const rect = element.getBoundingClientRect();;
  const pop = document.createElement('div');
  pop.style.position = 'absolute';
  pop.style.left = rect.left;
  pop.style.top = rect.top
  pop.innerText = txt;
  document.body.append(pop);
}

function debugNumberTables() {
  const tablesCollection = document.getElementsByTagName('table');
  let idx = 0;
  for (let table of tablesCollection) {
    popup(table, "Table "+idx);
    idx++;
  };
}

function makeTablesCollapsable(action) {
 
      $(document).on('click', "table.table_lines > tbody > tr > th", onTableClick)

      var $tables = $("table").each(function(i,e) {
          // This is the only table that koc handles for us.
          if ($(e).is(".personnel"))
              return;
              
          $(e).find("tbody > tr:eq(0) >th").append("<span class='expando'>-</span>");
      });
      
      var coltables = db.get('coltables_' + action, '').split(',');
      coltables.map(function (i) { collapseTable($tables.eq(i)); });
  };
export default {
  makeTablesCollapsable,
  debugNumberTables,
};