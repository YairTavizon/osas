// This will let you use the .remove() function later on
if (!('remove' in Element.prototype)) {
  Element.prototype.remove = function() {
    if (this.parentNode) {
      this.parentNode.removeChild(this);
    }
  };
}

mapboxgl.accessToken = 'pk.eyJ1IjoieWFpcnRhdiIsImEiOiJjanhndjFkZG8wMGM2M3psNmc1ZHZsemExIn0.5WBvKTFulqDvf_Qkp1MR4A';

// This adds the map to the page
var map = new mapboxgl.Map({
  // container id specified in the HTML
  container: 'map',
  // style URL
  style: 'mapbox://styles/yairtav/cjxh9g4qj39g11cuu041tfx3i',
  // initial position in [lon, lat] format
  center: [-103.341208, 20.675187],
  // initial zoom
  zoom: 15
});

var stores =
  {
    "features": [
      {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "coordinates": [
            -103.347984,
            20.674764
          ],
          "type": "Point"
        },
        "id": "0b3f7b280e9c8f2f7ed79876a2c7374f"
      },
      {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "coordinates": [
            -103.350761,
            20.677309
          ],
          "type": "Point"
        },
        "id": "3082b3d818d86dc6bf561094f111b16d"
      },
      {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "coordinates": [
            -103.343984,
            20.677652
          ],
          "type": "Point"
        },
        "id": "c6a300b6d9ba10b170dfe8615eec345a"
      },
      {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "coordinates": [
            -103.351151,
            20.674622
          ],
          "type": "Point"
        },
        "id": "cfb08d461af0d88bb4c6d4ea277dff58"
      },
      {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "coordinates": [
            -103.347814,
            20.678325
          ],
          "type": "Point"
        },
        "id": "eadb12af798d78a5b90669c5149a4bd5"
      }
    ],
    "type": "FeatureCollection"
};

map.on('load', function(e) {
  // Add the data to your map as a layer
  map.addSource('places', {
   type: 'geojson',
   data: stores
 });

  buildLocationList(stores);
});

function buildLocationList(data) {
  // Iterate through the list of stores
  for(i=0; i < data.features.length; i++) {
    var currentFeature = data.features[i];

    // Shorten data.feature.properties to just `prop` so we're not
    // writing this long form over and over again.
    var prop = currentFeature.properties;

    // Select the listing container in the HTML and append a div
    // with the class 'item' for each store
    var listings = document.getElementById('listings');
    var listing = listings.appendChild(document.createElement('div'));
    listing.className = 'item';
    listing.id = 'listing' + i;

    // Create a new link with the class 'title' for each store
    // and fill it with the store address
    var link = listing.appendChild(document.createElement('a'));
   link.href = '#';
   link.className = 'title';
   link.dataPosition = i;
   link.innerHTML = prop.address;
   // Add an event listener for the links in the sidebar listing
link.addEventListener('click', function(e) {
  // Update the currentFeature to the store associated with the clicked link
  var clickedListing = data.features[this.dataPosition];
  // 1. Fly to the point associated with the clicked link
  flyToStore(clickedListing);
  // 2. Close all other popups and display popup for clicked store
  createPopUp(clickedListing);
  // 3. Highlight listing in sidebar (and remove highlight for all other listings)
  var activeItem = document.getElementsByClassName('active');
  if (activeItem[0]) {
    activeItem[0].classList.remove('active');
  }
  this.parentNode.classList.add('active');
});

    // Create a new div with the class 'details' for each store
    // and fill it with the city and phone number
    var details =listing.appendChild(document.createElement('div'));
    details.innerHTML = prop.city;
    if(prop.phone) {
      details.innerHTML += ' &middot; ' + prop.phoneFormatted;
    }
  }
}

//Function to fly to the correct store
function flyToStore(currentFeature) {
  map.flyTo({
    center: currentFeature.geometry.coordinates,
    zoom: 15
  });
}

//Function to display popup features
function createPopUp(currentFeature) {
  var popUps = document.getElementsByClassName ('mapboxgl-popup');
  // Check if there is already a popup on the map and if so, remove it
  if(popUps[0]) popUps[0].remove();

  var popup = new mapboxgl.Popup({closeOnClick: false})
  .setLngLat(currentFeature.geometry.coordinates)
  .setHTML('<h3>Lugar</h3>' + '<h4>' + currentFeature.properties.address +'</h4>')
  .addTo(map);
}

//// Add an event listener for when a user clicks on the map

stores.features.forEach(function(marker) {
  // Create a div element for the marker
  var el = document.createElement('div');
  // Add a class called 'marker' to each div
  el.className = 'marker';
  // By default the image for your custom marker will be anchored
  // by its center. Adjust the position accordingly
  // Create the custom markers, set their position, and add to map
  new mapboxgl.Marker(el, { offset: [0, -23] })
    .setLngLat(marker.geometry.coordinates)
    .addTo(map);
    el.addEventListener('click', function(e) {
    var activeItem = document.getElementsByClassName('active');
    // 1. Fly to the point
    flyToStore(marker);
    // 2. Close all other popups and display popup for clicked store
    createPopUp(marker);
    // 3. Highlight listing in sidebar (and remove highlight for all other listings)
    e.stopPropagation();
    if (activeItem[0]) {
      activeItem[0].classList.remove('active');
    }

    var listing = document.getElementById('listing-' + i);
    console.log(listing);
    listing.classList.add('active');
  });
});
