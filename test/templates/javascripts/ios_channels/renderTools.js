/*
 * jquery render chart
 * Rely on: jquery.highcharts
 **/
(function($){
    $.chartCache ={};
    $.fn.extend({
        renderChart : function(opt){
            var defaultOpt = {
                chart: {
                defaultSeriesType: "spline",
                animation: false
            },
            yAxis: {
                title:"",
                min:0
            },
            credits: {
                "enabled":false
            },
            plotOptions: {
                "area":{
                    "stacking":null
                },
                "series":{
                    animation: true,
                    events: {
                      legendItemClick: function(event) {
                        var legendName = this.name+'_<dot>';
                        var tempSeries = this.chart.series;
                        var seriesLength = tempSeries.length;
                        for (var i=0; i < seriesLength; i++){
                          if (tempSeries[i].name == legendName){
                            tempSeries[i].visible ? tempSeries[i].hide() : tempSeries[i].show();
                          }
                        }
                      }
                    }
                }
            },
            tooltip: {
                enabled: true,
                formatter: function() {
                    return ''+
                    this.x + '日'+ this.series.name + ' : '+ this.y;
                }
            },
            legend: {
                margin: 25,
                enabled: true
            },
            subtitle: {}
            };
            var options = $.extend(true,{},defaultOpt,opt||{});
            return this.each(function(){
                try{
                    $.chartCache($(this).attr('id')).destroy();
                }catch(e){
                    $.chartCache[$(this).attr('id')] = new Highcharts.Chart(options);
                }
            });
        }
    });

})(jQuery);
