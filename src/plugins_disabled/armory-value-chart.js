import GUI from 'utils/gui';
import Koc from 'utils/koc_utils';

var db = Koc.db;

export default {
  description: "",

  defaultEnabled: true,

  enabledPages: ['armory'],

  run: function() {
    this.showStats();
  },
  
  showStats: function () {
    $(".personnel").before('<table class="table_lines" width="100%" cellspacing="0" cellpadding="6" border="0"><tbody><tr><th>Armory Value Stats</th></tr><tr><td><div id="container"></div></td></tr></tbody></table><br />');

    getLux('&a=armoryStats', (a) => {
    //     window.chart = new Highcharts.StockChart({
    //         chart: {
    //             renderTo: 'container',
    //             zoom: 'none'
    //             // width: '100%'
    //         },
    //         rangeSelector: {
    //             enabled: false
    //         },
    //         scrollbar: {
    //             enabled: false
    //         },
    //         yAxis: {
    //             min: 0
    //             // startOnTick: false,
    //             // endOnTick: false
    //         },

    //         title: {
    //             text: 'Armory Value'
    //         },

    //         series: [
    //             {
    //                 name: 'Weapon Value',
    //                 data: JSON.parse(a.responseText),
    //                 tooltip: {
    //                     valueDecimals: 0
    //                 }
    //             }
    //         ]
    //     });
    });
  },
};
