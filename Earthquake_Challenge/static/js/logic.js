let streets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/{z}/{x}/{y}?access_token={accessToken}', {
	attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
		maxZoom: 18,
		accessToken: API_KEY
	});

let satellite_Streets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 18,
	accessToken: API_KEY
});

let light = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/{z}/{x}/{y}?access_token={accessToken}', {
attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 18,
	accessToken: API_KEY
});

function styleInfo(feature) {
	return {
	  opacity: 1,
	  fillOpacity: 1,
	  fillColor: getColor(feature.properties.mag),
	  color: "#000000",
	  radius: getRadius(feature.properties.mag),
	  stroke: true,
	  weight: 0.5
	};
  }

  function styleLine(feature) {
	return {
		color: "#ff7800",
		weight: 3,
		opacity: 0.65
	};
  }

  function getColor(magnitude) {
	if (magnitude > 5) {
	  return "#ea2c2c";
	}
	if (magnitude > 4) {
	  return "#ea822c";
	}
	if (magnitude > 3) {
	  return "#ee9c00";
	}
	if (magnitude > 2) {
	  return "#eecc00";
	}
	if (magnitude > 1) {
	  return "#d4ee00";
	}
	return "#98ee00";
  }
  
function getRadius(magnitude) {
	if (magnitude === 0) {
	  return 1;
	}
	return magnitude * 4;
  }
  let earthquakes = new L.LayerGroup();
  let tectonicplate = new L.LayerGroup();
  let overlays = {
	  "Tectonic Plate": tectonicplate,
	  "Earthquakes": earthquakes	
	};

  let map = L.map('mapid', {
	center: [39.5, -98.5],
	zoom: 5,
	layers: [streets,earthquakes,tectonicplate]
})

let baseMaps = {
	Street: streets,
	Satellite: satellite_Streets,
	Light: light
  };
L.control.layers(baseMaps, overlays).addTo(map);

d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function(data) {
L.geoJson(data, {
    pointToLayer: function(feature, latlng) {
       return L.circleMarker(latlng);
      },
  style: styleInfo,
    onEachFeature: function(feature, layer) {
    layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
  }
}).addTo(earthquakes);

d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json").then(function(data) {
L.geoJson(data, {
    pointToLayer: function(feature, latlng) {      
        return L.lineString(latlng);
      },
  style: styleLine
}).addTo(tectonicplate);
 })});

CreateLegend();

function CreateLegend(){
    var legend = L.control({position: "bottomright"});
    legend.onAdd = function(){
        var div = L.DomUtil.create("div","info legend");
        var labels = ["0-1","1-2","2-3","3-4","4-5","5+"];
		var legends = [];		
        for(var i=0;i<labels.length;i++){			
            legends.push("<li style=\"list-style-type:none;\"><div style=\"background-color: " + getColor(i) + "\">&nbsp;</div> " + 
            "<div>" + labels[i] + "</div></li>");}
            div.innerHTML += "<ul class='legend'>" + legends.join("") + "</ul>";
            return div;
        };
        legend.addTo(map);    
}