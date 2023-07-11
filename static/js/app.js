
// Function to update the dashboard when a new sample is selected
function updateDashboard(sample) {

// Read the samples.json file
    d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json")
    .then((data) => {

      // Get the sample data for the selected ID
      var sampleData = data.samples.find((sampleObj) => sampleObj.id === sample);
      var metadata = data.metadata.find((metaObj) => metaObj.id === parseInt(sample));

      // Update the demographic info
      var demographicInfo = d3.select("#sample-metadata");
      demographicInfo.html("");
      Object.entries(metadata).forEach(([key, value]) => {
        demographicInfo.append("p").text(`${key}: ${value}`);
      });

      // Update the horizontal bar chart
      var barChartTrace = {
        x: sampleData.sample_values.slice(0, 10).reverse(),
        y: sampleData.otu_ids.slice(0, 10).map((id) => `OTU ${id}`).reverse(),
        text: sampleData.otu_labels.slice(0, 10).reverse(),
        type: "bar",
        orientation: "h"
      };

      var barChartData = [barChartTrace];

      var barChartLayout = {
        title: "Top 10 OTUs",
        margin: { t: 30, l: 150 }
      };

      Plotly.newPlot("bar", barChartData, barChartLayout);

      // Update the bubble chart
      var bubbleChartTrace = {
        x: sampleData.otu_ids,
        y: sampleData.sample_values,
        text: sampleData.otu_labels,
        mode: "markers",
        marker: {
          size: sampleData.sample_values,
          color: sampleData.otu_ids,
          colorscale: "Earth"
        }
      };

      var bubbleChartData = [bubbleChartTrace];

      var bubbleChartLayout = {
        title: "OTU Distribution",
        xaxis: { title: "OTU ID" },
        yaxis: { title: "Sample Value" },
        showlegend: false,
        height: 600,
        width: 1000
      };

      Plotly.newPlot("bubble", bubbleChartData, bubbleChartLayout);
    });


}


// Function to initialize the dashboard
function init() {
    d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json")
    .then((data) => {
    // Get the dropdown select element
    var dropdown = d3.select("#selDataset");

    // Populate the dropdown with sample IDs
    data.names.forEach((name) => {
        dropdown.append("option").text(name).property("value", name);
    });

    // Display the first sample in the dashboard
    var initialSample = data.names[0];
    updateDashboard(initialSample);
    })
};
  
  
// Initialize the dashboard
init();

// Function to handle the change event of the dropdown
function optionChanged(newSample) { 
updateDashboard(newSample);
}