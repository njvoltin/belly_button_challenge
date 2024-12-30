// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    let metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    let resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    let result = resultArray[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    let panel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    panel.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    Object.entries(result).forEach(([key, value]) => {
      panel.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
  });
}

// function to build both charts
function buildCharts(sample, data) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let samples = data.samples;

    // Filter the samples for the object with the desired sample number
    let resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    let result = resultArray[0];


    // Get the otu_ids, otu_labels, and sample_values
    let { otu_ids, otu_labels, sample_values } = result;


    // Build a Bubble Chart
    let bubbleTrace = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: "markers",
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: "Earth"
      }
    };

    // Render the Bubble Chart
    let bubbleLayout = {
      title: "OTU ID vs Sample Values",
      xaxis: { title: "OTU ID" },
      yaxis: { title: "Sample Values" },
      hovermode: "closest"
    };
  
    Plotly.newPlot("bubble", [bubbleTrace], bubbleLayout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks


    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    let barTrace = {
      x: sample_values.slice(0, 10).reverse(),
      y: otu_ids.slice(0, 10).map(otu => `OTU ${otu}`).reverse(),
      text: otu_labels.slice(0, 10).reverse(),
      type: "bar",
      orientation: "h"
    };

    // Render the Bar Chart
    let barLayout = {
      title: "Top 10 OTUs Found",
      xaxis: { title: "Sample Values" },
      yaxis: { title: "OTU ID" }
    };
  
    Plotly.newPlot("bar", [barTrace], barLayout);
  })
}
  
  


// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let sampleNames = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdown = d3.select("#selDataset");


    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    sampleNames.forEach((sample) => {
      dropdown.append("option").text(sample).property("value", sample);
    });

    // Get the first sample from the list
    let firstSample = sampleNames[0];

    // Build charts and metadata panel with the first sample
    buildCharts(firstSample, data);
    buildMetadata(firstSample, data);
  

// Function for event listener
    dropdown.on("change", function() {
      let newSample = d3.select(this).property("value");
      buildCharts(newSample, data);
      buildMetadata(newSample, data);
    });
  });
}

// Initialize the dashboard
init();
