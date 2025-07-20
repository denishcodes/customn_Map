const map = L.map('map').setView([26.65, 87.9], 11);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Add geocoder search control (visible top-left)
L.Control.geocoder({
  defaultMarkGeocode: true,
  collapsed: false,
  placeholder: 'Search locations...'
}).addTo(map);

// Icons for various location types
const specialCollegeIcon = L.icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/190/190411.png',
  iconSize: [45, 45],
  iconAnchor: [22, 45],
  popupAnchor: [0, -40]
});
const collegeIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/3175/3175197.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30]
});
const cityIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30]
});
const supermarketIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/891/891462.png", // shopping cart icon
  iconSize: [32, 32],
  iconAnchor: [16, 32]
});
const storeIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/2331/2331905.png", // store front icon
  iconSize: [32, 32],
  iconAnchor: [16, 32]
});
const otherIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/854/854878.png", // hospital/plus icon
  iconSize: [32, 32],
  iconAnchor: [16, 32]
});

// City locations
const locations = [
  { name: "Birtamode", lat: 26.6527, lng: 87.9075 },
  { name: "Charpane", lat: 26.6319, lng: 87.9302 },
  { name: "Damak", lat: 26.6713, lng: 87.6999 },
  { name: "Kakarvitta", lat: 26.6542, lng: 88.1436 },
  { name: "Bhadrapur", lat: 26.5452, lng: 88.0907 }
];

// Colleges
const colleges = [
  { name: "Balmiki Lincoln College, Birtamode - 01", lat: 26.6530, lng: 87.9040, special: true },
  { name: "Balmiki Lincoln College", lat: 26.634872, lng: 87.928953 },
  { name: "NIDI College", lat: 26.667308, lng: 87.690926 },
  { name: "Mechi Multiple Campus", lat: 26.645754, lng: 87.834082 },
  { name: "Birtamode Lincoln College", lat: 26.6527, lng: 87.9000 }
];

// Supermarkets
const supermarkets = [
  { name: "Birtamode Supermarket", lat: 26.6520, lng: 87.9050 },
  { name: "Mega Mart Jhapa", lat: 26.6535, lng: 87.9120 },
  { name: "Fresh Mart", lat: 26.6470, lng: 87.9080 }
];

// Stores
const stores = [
  { name: "Fashion Store", lat: 26.6550, lng: 87.9090 },
  { name: "Mobile Store Jhapa", lat: 26.6500, lng: 87.9010 },
  { name: "Book Store", lat: 26.6510, lng: 87.9045 }
];

// Others (e.g., hospital, bank)
const others = [
  { name: "Jhapa Hospital", lat: 26.6480, lng: 87.9025 },
  { name: "National Bank Branch", lat: 26.6540, lng: 87.9070 },
  { name: "Post Office Jhapa", lat: 26.6495, lng: 87.9090 }
];

// Add city markers + popup + route on click
locations.forEach(loc => {
  const marker = L.marker([loc.lat, loc.lng], { icon: cityIcon }).addTo(map);
  marker.bindPopup(`<b>${loc.name}</b><br>Click to draw route from Charpane.`);
  marker.on('click', () => {
    if (loc.name !== "Charpane") drawRoute("Charpane", loc.name);
  });
});

// College markers, hidden initially
let collegeMarkers = colleges.map(col => {
  const icon = col.special ? specialCollegeIcon : collegeIcon;
  const marker = L.marker([col.lat, col.lng], { icon });
  marker.bindPopup(`🎓 <b>${col.name}</b>`);
  return marker;
});
let collegesVisible = false;

// Supermarket markers
let supermarketMarkers = supermarkets.map(sup => {
  const marker = L.marker([sup.lat, sup.lng], { icon: supermarketIcon });
  marker.bindPopup(`🛒 <b>${sup.name}</b>`);
  return marker;
});
let supermarketsVisible = false;

// Store markers
let storeMarkers = stores.map(st => {
  const marker = L.marker([st.lat, st.lng], { icon: storeIcon });
  marker.bindPopup(`🏪 <b>${st.name}</b>`);
  return marker;
});
let storesVisible = false;

// Others markers
let otherMarkers = others.map(o => {
  const marker = L.marker([o.lat, o.lng], { icon: otherIcon });
  marker.bindPopup(`🏥 <b>${o.name}</b>`);
  return marker;
});
let othersVisible = false;

// Toggle buttons event listeners
document.getElementById("toggleColleges").addEventListener("click", () => {
  collegesVisible = !collegesVisible;
  collegeMarkers.forEach(m => collegesVisible ? m.addTo(map) : map.removeLayer(m));
});
document.getElementById("toggleSupermarkets").addEventListener("click", () => {
  supermarketsVisible = !supermarketsVisible;
  supermarketMarkers.forEach(m => supermarketsVisible ? m.addTo(map) : map.removeLayer(m));
});
document.getElementById("toggleStores").addEventListener("click", () => {
  storesVisible = !storesVisible;
  storeMarkers.forEach(m => storesVisible ? m.addTo(map) : map.removeLayer(m));
});
document.getElementById("toggleOthers").addEventListener("click", () => {
  othersVisible = !othersVisible;
  otherMarkers.forEach(m => othersVisible ? m.addTo(map) : map.removeLayer(m));
});

// User location marker and accuracy circle
let userMarker = null;
let userCircle = null;
let locationVisible = true; // Show location by default

function updateUserLocation(e) {
  if (userMarker) {
    userMarker.setLatLng(e.latlng);
    userCircle.setLatLng(e.latlng).setRadius(e.accuracy);
  } else {
    userMarker = L.marker(e.latlng).bindPopup("📍 You are here").addTo(map).openPopup();
    userCircle = L.circle(e.latlng, e.accuracy).addTo(map);
  }
}

function hideUserLocation() {
  if (userMarker) {
    map.removeLayer(userMarker);
    userMarker = null;
  }
  if (userCircle) {
    map.removeLayer(userCircle);
    userCircle = null;
  }
}

map.on('locationfound', e => {
  if (locationVisible) updateUserLocation(e);
});
map.on('locationerror', () => alert("Could not get your location. Please allow location access."));

// Watch user location live and update marker if visible
if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    pos => {
      const latlng = L.latLng(pos.coords.latitude, pos.coords.longitude);
      const accuracy = pos.coords.accuracy;
      const event = { latlng, accuracy };
      if (locationVisible) updateUserLocation(event);
    },
    err => console.error("Error watching position: ", err),
    { enableHighAccuracy: true, maximumAge: 3000, timeout: 10000 }
  );
} else alert("Geolocation is not supported by your browser.");

document.getElementById("toggleLocation").addEventListener("click", () => {
  locationVisible = !locationVisible;
  if (!locationVisible) {
    hideUserLocation();
  } else {
    map.locate({ setView: false, maxZoom: 13 });
  }
});

// Draw route from Charpane to selected city
function drawRoute(fromName, toName) {
  const from = locations.find(loc => loc.name === fromName);
  const to = locations.find(loc => loc.name === toName);
  if (from && to) {
    if (window.routeLine) map.removeLayer(window.routeLine);
    window.routeLine = L.polyline([[from.lat, from.lng], [to.lat, to.lng]], {
      color: 'red',
      weight: 4,
      dashArray: '6, 8'
    }).addTo(map);
    map.fitBounds(window.routeLine.getBounds());
  }
}

// Dark mode toggle
const darkModeCheckbox = document.getElementById("toggleDark");
darkModeCheckbox.addEventListener("change", () => {
  const mapEl = document.getElementById("map");
  if (darkModeCheckbox.checked) mapEl.classList.add("dark-mode");
  else mapEl.classList.remove("dark-mode");
});
