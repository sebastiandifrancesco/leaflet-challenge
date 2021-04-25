// Set map to center on the middle of US
var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 4
});

// Leaflet street map as background
var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
}).addTo(myMap);

// Call the URL for earthquakes in the past seven days
var URL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Get data
d3.json(URL, function (data) {
    let earthquakes = data.features;

    // Setup color scheme
    let color = {
        level1: "#3c0",
        level2: "#9f6",
        level3: "#fc3",
        level4: "#f93",
        level5: "#c60",
        level6: "#c00"
    }

    // Find lat and long and set severity color
    for (var i = 0; i < earthquakes.length; i++) {
        let latitude = earthquakes[i].geometry.coordinates[1];
        let longitude = earthquakes[i].geometry.coordinates[0];
        let magnitude = earthquakes[i].properties.mag;
        var fillColor;
        if (magnitude > 5) {
            fillColor = color.level6;
        } else if (magnitude > 4) {
            fillColor = color.level5;
        } else if (magnitude > 3) {
            fillColor = color.level4;
        } else if (magnitude > 2) {
            fillColor = color.level3;
        } else if (magnitude > 1) {
            fillColor = color.level2;
        } else {
            fillColor = color.level1;
        }

    // Radius determined on exponential scale based on size of magnitude.
    var epicenter = L.circleMarker([latitude, longitude], {
        radius: magnitude ** 2,
        color: "black",
        fillColor: fillColor,
        fillOpacity: 1,
        weight: 1
    });
    epicenter.addTo(myMap);

    // Set labels as pop-up
    epicenter.bindPopup("<h3> " + new Date(earthquakes[i].properties.time) + "</h3><h4>Magnitude: " + magnitude +
            "<br>Location: " + earthquakes[i].properties.place + "</h4><br>");
    }
    // Set legend to appear in the bottom right
    var legend = L.control({
        position: 'bottomright'
    });

    // Add legend based off the color scheme
    legend.onAdd = function (color) {
        var div = L.DomUtil.create('div', 'info legend');
        var levels = ['>1', '1-2', '2-3', '3-4', '4-5', '5+'];
        var colors = ['#3c0', '#9f6', '#fc3', '#f93', '#c60', '#c00']
        for (var i = 0; i < levels.length; i++) {
            div.innerHTML += '<i style="background:' + colors[i] + '"></i>' + levels[i] + '<br>';
        }
        return div;
    }
    legend.addTo(myMap);
})