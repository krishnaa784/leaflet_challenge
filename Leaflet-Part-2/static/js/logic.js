// Base map layers
const street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: "© OpenStreetMap"
});
const topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: "© OpenTopoMap"
});

// Create map
const map = L.map('map', {
    center: [20, 0],
    zoom: 2,
    layers: [street]
});

// Create layer groups
const earthquakeLayer = L.layerGroup();
const tectonicLayer = L.layerGroup();

// Add earthquake data
const earthquakeURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

fetch(earthquakeURL)
    .then(res => res.json())
    .then(data => {
        L.geoJSON(data, {
            pointToLayer: function (feature, latlng) {
                return L.circleMarker(latlng, {
                    radius: feature.properties.mag * 3,
                    fillColor: getColor(feature.geometry.coordinates[2]),
                    color: "#000",
                    weight: 0.5,
                    opacity: 1,
                    fillOpacity: 0.8
                });
            },
            onEachFeature: function (feature, layer) {
                layer.bindPopup(`<strong>${feature.properties.place}</strong><br>
                                 Magnitude: ${feature.properties.mag}<br>
                                 Depth: ${feature.geometry.coordinates[2]} km`);
            }
        }).addTo(earthquakeLayer);
    });

// Add tectonic plate data
const tectonicURL = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";

fetch(tectonicURL)
    .then(res => res.json())
    .then(data => {
        L.geoJSON(data, {
            style: {
                color: "orange",
                weight: 2
            }
        }).addTo(tectonicLayer);
    });

// Add layer controls
const baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
};

const overlayMaps = {
    "Earthquakes": earthquakeLayer,
    "Tectonic Plates": tectonicLayer
};

// Add control to map
L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
}).addTo(map);

// Add layers to map
earthquakeLayer.addTo(map);
tectonicLayer.addTo(map);

// Function to color by depth
function getColor(depth) {
    return depth > 90 ? "#d73027" :
           depth > 70 ? "#fc8d59" :
           depth > 50 ? "#fee08b" :
           depth > 30 ? "#d9ef8b" :
           depth > 10 ? "#91cf60" :
                        "#1a9850";
}
const legend = L.control({ position: "bottomright" });

legend.onAdd = function () {
    const div = L.DomUtil.create("div", "legend");
    const grades = [-10, 10, 30, 50, 70, 90];
    const colors = grades.map(d => getColor(d));

    for (let i = 0; i < grades.length; i++) {
        div.innerHTML +=
            `<i style="background:${colors[i]}"></i> ${grades[i]}${grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+'}`;
    }
    return div;
};

legend.addTo(map);

