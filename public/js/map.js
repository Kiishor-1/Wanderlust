// // let mapToken = mapToken;
// mapboxgl.accessToken = mapToken;
// const map = new mapboxgl.Map({
//   container: 'map', // container ID
//   // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
//   style: 'mapbox://styles/mapbox/streets-v12', // style URL
//   center: listing.geometry.coordinates, // starting position [lng, lat]
//   zoom: 9 // starting zoom
// });


// const marker = new mapboxgl.Marker({color:"red"})
//   .setLngLat(listing.geometry.coordinates)
//   .setPopup(
//     new mapboxgl.Popup({offset:25}).setHTML(
//       `<h5>${listing.title}</h5><p>Exact location will be provided after booking</p>`
//     )
//   )
//   .addTo(map);

// Define your Mapbox access token
mapboxgl.accessToken = mapToken;

// Function to determine if it's nighttime in India (between 7 PM and 4 AM)
function isNightTimeInIndia() {
    const now = new Date();
    const hours = (now.getUTCHours() + 5.5) % 24;  // Adjust for Indian Standard Time (UTC+5:30)
    return hours >= 18 || hours < 4;
}

// Define the initial map style based on the current time
let initialStyle = isNightTimeInIndia() ? 'mapbox://styles/mapbox/navigation-night-v1' : 'mapbox://styles/mapbox/streets-v12';

// Create the map with the initial style
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: initialStyle, // initial style URL
    center: listing.geometry.coordinates, // starting position [lng, lat]
    zoom: 9 // starting zoom
});

// Add a marker to the map
const marker = new mapboxgl.Marker({ color: "red" })
    .setLngLat(listing.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 }).setHTML(
            `<h5>${listing.title}</h5><p>Exact location will be provided after booking</p>`
        )
    )
    .addTo(map);

// Update the map style based on the current time every 1 minute
setInterval(function () {
    const newStyle = isNightTimeInIndia() ? 'mapbox://styles/mapbox/dark-v11' : 'mapbox://styles/mapbox/streets-v12';
    if (map.getStyle().name !== newStyle) {
        map.setStyle(newStyle);
    }
}, 60000); // Check every minute for style update
