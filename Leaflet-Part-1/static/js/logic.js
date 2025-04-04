// static/js/logic.js

// Initialize the map with a starting view and zoom level
let map = L.map("map").setView([20, 0], 2);  // Centered globally with zoom level 2

// Add a tile layer (background map from OpenStreetMap)
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors"
}).addTo(map);

// URL for fetching earthquake data in GeoJSON format from USGS
const earthquakeDataUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

// Fetch the earthquake data
fetch(earthquakeDataUrl)
  .then(response => response.json())  // Parse response as JSON
  .then(data => {
    // Loop through each earthquake in the data
    data.features.forEach(earthquake => {
      const [longitude, latitude, depth] = earthquake.geometry.coordinates;

      // Get earthquake properties (magnitude and place)
      const magnitude = earthquake.properties.mag;
      const place = earthquake.properties.place;

      // Set marker color based on depth
      const color = depth > 700 ? "#FF0000" : depth > 300 ? "#FF6600" : "#FFFF00";  // Red for deep, yellow for shallow

      // Create a circle marker for each earthquake
      L.circleMarker([latitude, longitude], {
        radius: magnitude * 3,  // Larger radius for higher magnitude
        fillColor: color,       // Color based on depth
        fillOpacity: 0.6,
        color: "#000",
        weight: 1
      })
      .addTo(map)
      .bindPopup(`<b>Magnitude:</b> ${magnitude}<br><b>Location:</b> ${place}<br><b>Depth:</b> ${depth} km`);
    });
  })
  .catch(error => console.error("Error fetching earthquake data:", error));
