define([
    'utils/gui',
    'utils/koc_utils'
], function(GUI, Koc) {

    var db = Koc.db;

    return {
        description: "",

        defaultEnabled: true,

        enabledPages: ['armory'],

        run: function() {
            this.showStats();
        },
        
        showStats: function () {
            $(".personnel").before('<table class="table_lines" width="100%" cellspacing="0" cellpadding="6" border="0"><tbody><tr><th>Armory Value Stats</th></tr><tr><td><div id="container"></div></td></tr></tbody></table><br />');

            getLux('&a=armoryStats', function (a) {

                window.chart = new Highcharts.StockChart({
                    chart: {
                        renderTo: 'container',
                        zoom: 'none'
                        // width: '100%'
                    },
                    rangeSelector: {
                        enabled: false
                    },
                    scrollbar: {
                        enabled: false
                    },
                    yAxis: {
                        min: 0
                        // startOnTick: false,
                        // endOnTick: false
                    },

                    title: {
                        text: 'Armory Value'
                    },

                    series: [
                        {
                            name: 'Weapon Value',
                            data: $.parseJSON(a.responseText),
                            tooltip: {
                                valueDecimals: 0
                            }
                        }
                    ]
                });
            });
        },
    }
});
