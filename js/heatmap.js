/**
 * Created by salvob on 28/06/2017.
 */
function AppHeatmap() {
    function me(selection) {
        var margin = {top: 50, right: 0, bottom: 100, left: 50},
            width = 960 - margin.left - margin.right,
            height = 430 - margin.top - margin.bottom,
            gridSize = Math.floor(width / 24),
            legendElementWidth = gridSize * 2,
            buckets = 5,
            colors = ["#ffffd9", "#edf8b1", "#c7e9b4", "#7fcdbb", "#41b6c4", "#1d91c0", "#225ea8", "#253494"], // alternatively
            days = ["1950", "1960", "1970", "1980", "1990", "2000", "2010"],
            times = ["1950", "1960", "1970", "1980", "1990", "2000", "2010"];
        var datasets = ["data/heatmap.tsv"];

        var svg_heatmap = d3.select("#chart_heatmap").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var dayLabels = svg_heatmap.selectAll(".dayLabel")
            .data(days)
            .enter().append("text")
            .text(function (d) {
                return d;
            })
            .attr("x", 0)
            .attr("y", function (d, i) {
                return i * gridSize;
            })
            .style("text-anchor", "end")
            .attr("transform", "translate(-6," + gridSize / 1.5 + ")")
            .attr("class", function (d, i) {
                return ((i >= 0 && i <= 4) ? "dayLabel mono axis axis-workweek" : "dayLabel mono axis");
            });

        var timeLabels = svg_heatmap.selectAll(".timeLabel")
            .data(times)
            .enter().append("text")
            .text(function (d) {
                return d;
            })
            .attr("x", function (d, i) {
                return i * gridSize;
            })
            .attr("y", 0)
            .style("text-anchor", "middle")
            .attr("transform", "translate(" + gridSize / 2 + ", -6)")
            .attr("class", function (d, i) {
                return ((i >= 7 && i <= 16) ? "timeLabel mono axis axis-worktime" : "timeLabel mono axis");
            });

        var heatmapChart = function (tsvFile) {
            d3.tsv(tsvFile,
                function (d) {
                    return {
                        day: +d.day,
                        hour: +d.hour,
                        value: +d.value
                    };
                },
                function (error, data) {
                    var colorScale = d3.scaleQuantile()
                        .domain([0.6, d3.max(data, function (d) {
                            return d.value;
                        })])
                        .range(colors);

                    var cards = svg_heatmap.selectAll(".hour")
                        .data(data, function (d) {
                            return d.day + ':' + d.hour;
                        });

                    cards.append("title");

                    cards.enter().append("rect")
                        .attr("x", function (d) {
                            return (d.hour - 1) * gridSize;
                        })
                        .attr("y", function (d) {
                            return (d.day - 1) * gridSize;
                        })
                        .attr("rx", 4)
                        .attr("ry", 4)
                        .attr("class", "hour bordered")
                        .attr("width", gridSize)
                        .attr("height", gridSize)
                        .style("fill", colors[0]);

                    cards.transition().duration(1000)
                        .style("fill", function (d) {
                            return colorScale(d.value);
                        });

                    cards.select("title").text(function (d) {
                        return d.value;
                    });

                    cards.exit().remove();

                    var legend = svg_heatmap.selectAll(".legend")
                        .data([0].concat(colorScale.quantiles()), function (d) {
                            return d;
                        });

                    legend.enter().append("g")
                        .attr("class", "legend");

                    legend.append("rect")
                        .attr("x", function (d, i) {
                            return legendElementWidth * i;
                        })
                        .attr("y", height)
                        .attr("width", legendElementWidth)
                        .attr("height", gridSize / 2)
                        .style("fill", function (d, i) {
                            return colors[i];
                        });
                    legend.append("text")
                        .attr("class", "mono")
                        .text(function (d) {
                            return "≥ " + parseFloat(d).toFixed(2);
                        })
                        .attr("x", function (d, i) {
                            return legendElementWidth * i;
                        })
                        .attr("y", height + gridSize);

                    legend.exit().remove();

                });
        };

        heatmapChart(datasets[0]);

        var datasetpicker = d3.select("#dataset-picker").selectAll(".dataset-button")
            .data(datasets);

        datasetpicker.enter()
            .append("input")
            .attr("value", function (d) {
                return "Clicca Qui"
            })
            .attr("type", "button")
            .attr("class", "dataset-button")
            .on("click", function (d) {
                heatmapChart(d);
            });
    }

    return me;
}

var heatmap = AppHeatmap();
d3.select("#chart_heatmap")
    .call(heatmap);
