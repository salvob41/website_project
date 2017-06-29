/**
 * Created by salvob on 29/06/2017.
 */
var decadi = d3.range(1950, 2011, 10);

var select = d3.select('#bubblechart_selectYear')
    .selectAll("option")
    .data(decadi)
    .enter()
    .append('option')
    .attr('value', function (d) {
        return d
    })
    .text(function (d) {
        return d
    });
d3.select('#bubblechart_selectYear')
    .on('change', function () {
        var selectValue = d3.select('select').property('value');
        console.log(selectValue);
        loadDecade(selectValue);
    });

var svg_bubblechart = d3.select("#svg_bubblechart"),
    width = +svg_bubblechart.attr("width"),
    height = +svg_bubblechart.attr("height");
var bubble = BubblePack();

loadDecade(1950);

function loadDecade(decade) {
    var url = "data/most_common" + decade + ".csv";
    d3.csv(url, function (d) {
            d.value = +d.value;
            d.emotion = d.emotion;

            if (d.value) return d;
        }, function (error, classes) {
            if (error) throw error;

            var tree = {
                    name: "root",
                    children: d3.nest()
                        .key(function (d) {
                            return d.emotion
                        })
                        .entries(classes)
                        .map(function (d) {
                            return {
                                name: d.key,
                                children: d.values
                            }
                        })

                }
            ;
            console.log("tree", tree);
            svg_bubblechart.datum(tree).call(bubble);

        }
    );
}


// an Object to handle visualization of csv data
function BubblePack() {
    var format = d3.format(",d");;

    //var color = d3.scaleOrdinal(d3.schemeCategory20);
    var color = d3.scaleOrdinal(d3.schemeCategory20);

    var pack = d3.pack()
        .size([width, height])
        .padding(1.5);


    function me(svg) {
        var root = d3.hierarchy(svg.datum())
            .sum(function (d) {
                return d.value;
            })
        ;

        console.log("root", root);
        console.log("leaves", pack(root).leaves());
        pack(root);
        svg.selectAll("g").remove();

        var g = svg.append("g");
        var node = g
            .selectAll("g")
            .data(pack(root).leaves())
            .enter().append("g")
            .attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")";
            })
            .attr("class", function (d) {
                return "node" + (!d.children ? " node--leaf" : d.depth ? "" : " node--root");
            })
            .each(function (d) {
                d.node = this;
            })
        ;

        node.append("circle")
            .attr("id", function (d) {
                return "node-" + d.data.id;
            })
            .attr("r", function (d) {
                return d.r;
            })
            .style("fill", function (d) {
                return color(d.data.emotion);
            });

        var leaf = node.filter(function (d) {
            return !d.children;
        });

        leaf.append("clipPath")
            .attr("id", function (d) {
                return "clip-" + d.data.id;
            })
            .append("use")
            .attr("xlink:href", function (d) {
                return "#node-" + d.data.id + "";
            });

        leaf.append("text")
            .attr("class", "bubblechart_text")
            .text(function (d) {
                return d.data.id;
            });

        node.append("title")
            .text(function (d) {
                return d.data.id + "\n" + format(d.value);
            });

    }

    return me;
}
