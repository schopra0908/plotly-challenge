// create the initial function that will be default
function init() {
    // select dropdown menu
    var dropdown = d3.select("#selDataset");

    // read the data
    d3.json("samples.json").then(function(data) {
        console.log(data);
        var names = data.names;
        // put a dropdown option for each name id
        names.forEach(function(name) {
            dropdown.append("option").text(name).property("value");
    });
        var initId = names[0];

        // plot the initial bar chart, bubble chart, demographics table, and gauge for the first ID
        Plot(initId);
        demographics(initId);
        gauge(initId);
})
}

// the function that runs on a changed selection
function optionChanged(id) {
    Plot(id);
    demographics(id);
    gauge(id);
}

// create a function that plots the bar chart and the bubble chart 
function Plot(id) {
    //read the data
    d3.json("samples.json").then(function(data) {
        console.log(data);
        var samples = data.samples
        // filter samples by the id 
        var samples = samples.filter(sampleID => sampleID.id === id)[0];
        console.log(samples)
        // get only first 10 sample values
        var sampleValues = samples.sample_values.slice(0, 10).reverse();
        // get only first 10 otu id's
        var otuIds = samples.otu_ids.slice(0, 10).reverse();
        // format "OTU" before each otu ID
        var otuIdslabels = otuIds.map(id_label => "OTU" + id_label);
        // get only the first 10 otu labels 
        var sampleLabels = samples.otu_labels.slice(0, 10);

        // create the trace for the bar plot 
        var trace = {
            x: sampleValues,
            y: otuIdslabels,
            text: sampleLabels,
            type: "bar",
            orientation: "h"
        };

        var data = [trace]

        // create layout
        var layout = {
            title: "Top 10 OTUs",
            xaxis: {title: "Sample Values"},
            yaxis: {title: "OTU"}
        }

        // create the bar plot 
        Plotly.newPlot("bar", data, layout);

        // create the trace for the bubble chart 
        var trace1 = {
            x: samples.otu_ids,
            y: samples.sample_values,
            mode: "markers",
            marker: {
                size: samples.sample_values,
                color: samples.otu_ids
            },
            text: samples.otu_labels
        };
        
        // create layout
        var layout = {
            xaxis:{title: "OTU IDs"},
            yaxis:{title: "Sample Values"}
        };
        
        var data = [trace1];

        // create the bubble chart 
        Plotly.newPlot("bubble", data, layout); 
        
    });
}

// create a function for the gauge
function gauge (id) {
    // read the data
    d3.json("samples.json").then(function(data) {
        var samples = data.metadata
        // filter samples by the id 
        var samples = samples.filter(sampleID => sampleID.id == id)[0];
        // grab the wfreq
        var washing_freq = samples.wfreq;

        // create the trace for the gauge
        var trace = [
            {
              domain: { x: [0, 1], y: [0, 1] },
              value: washing_freq,
              title: { text: "Belly Button Washing Frequency"},
              annotations: [{
                  text: "Scrubs per Week",
                  font: {size: 13}
              }],
              type: "indicator",
              mode: "gauge+number",
              gauge: {
                axis: { range: [null, 9] },
                steps: [
                  { range: [2, 5], color: "lightgray" },
                  { range: [0, 2], color: "gray" }
                ],
              }
            }
          ];
          
          // create layout
          var layout = { width: 600, height: 450, margin: { t: 0, b: 0 } };

          // create the gauge chart 
          Plotly.newPlot('gauge', trace, layout);
});
}

// create a function for the demographics info table
function demographics(id) {
    // read the data
    d3.json("samples.json").then(function(data) {
        console.log(data);
        var metadata = data.metadata;
        console.log(metadata);
        // filter samples by the id 
        var result  = metadata.filter(metadatum => metadatum.id.toString() === id)[0];
        console.log(result);
        
        // select the demographic table
        var getDemographic = d3.select("#sample-metadata");
        
        // clear the demographic table
        getDemographic.html("");

        // loop through the info in the metadata and append results to table
        Object.entries(result).forEach((key) => {   
                console.log(key)
                getDemographic.append("h6").text(key[0] + ": " + key[1] + "\n");    
        });
    });
}

init();
