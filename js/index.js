/**
 * Created by salvob on 28/06/2017.
 */


function App() {

    function me(selection) {
        d3.json("assets/data/most_common20.json", function (error, data) {
            if (error) console.log(error);

            console.log(data);
            // cleaning and organizing data as a hierarchy

            var root = {
                name: "root",
                children: d3.keys(data).map(function (year) { // for each year
                    return {
                        name: year,
                        children: d3.entries(data[year]).map(function (cat) {
                            // for each category
                            return {
                                name: cat.key.substr(4),
                                children: cat.value
                            }
                        })
                    }
                })
            }
            // check the final results on the console
            console.log("root", root);
            var treemap = Treemap();  // create a new istance of our component
            var circlePack = CirclePack();
            // attach data to selection and draw the tree
            d3.select("#viz")
                .datum(root)
                .call(circlePack);


        })
    }

    return me;
}

var app = App();
d3.select("#viz")
    .call(app);