<script setup>
import { computed } from 'vue'
import { ref, onMounted } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useStopStore } from '@/stores/useStopStore';
import draggable from 'vuedraggable';
import axios from 'axios';
import { useRoute } from 'vue-router';



const sourceCoords = ref(null);
const destCoords = ref(null);
const searchQuery = ref('');
const sourceSuggestions = ref([]);
const destinationSuggestions = ref([]);
const searchSuggestions = ref([]);
const stopMarkers = [];
const routeLine = ref(null);
const totalDistance = ref(0);
const stopDistances = ref([]);
const route = useRoute();

const store = useStopStore();
if(route.params.routeTitle){
  console.log("inside route "+route.params.routeTitle);
  store.$reset();
}
const source = computed({
  get: () => route.params.routeTitle?route.params.routeTitle:store.source,
  set: (val) => store.source = val
})

const destination = computed({
  get: () => store.destination,
  set: (val) => store.destination = val
})

let map;
let markers = [];

const customIcon = L.icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30]
});

/* onMounted(() => {
  map = L.map('map').setView([20, 78], 5);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);
  
}); */


onMounted(async () => {
  const savedData = localStorage.getItem('stopStore');

  if (savedData) {
    
    const parsed = JSON.parse(savedData);

    if (parsed.source && parsed.destination && Array.isArray(parsed.stops)) {
      store.source = parsed.source;
      store.destination = parsed.destination;
      store.stops = parsed.stops;
      source.value = parsed.source;
      destination.value = parsed.destination;
      if (!map) {
        map = L.map('map').setView([20, 78], 5);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(map);
      }

      await setRoute();
      return;
    }
  }
  map = L.map('map').setView([20, 78], 5);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);
});


const suggest = async (type) => {
  let query = '';
  if (type === 'source') query = source.value;
  else if (type === 'destination') query = destination.value;
  else if (type === 'search') query = searchQuery.value;

  if (!query.trim()) return;

  const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`);
  const data = await res.json();

  if (type === 'source') sourceSuggestions.value = data;
  else if (type === 'destination') destinationSuggestions.value = data;
  else if (type === 'search') searchSuggestions.value = data;
};

const getCoords = async (place) => {
  const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(place)}`);
  const data = await res.json();
  return data[0] ? [parseFloat(data[0].lat), parseFloat(data[0].lon)] : null;
};

const fetchWeather = async (lat, lon) => {
  const apiKey = '3e5731c0e204f4579581cc285733d0cf'
  const baseUrl = 'https://api.openweathermap.org/data/2.5/weather'

  try {
    const response = await axios.get(baseUrl, {
      params: {
        lat: lat,
        lon: lon,
        appid: apiKey,
        units: 'metric'
      }
    })
    return response.data
  } catch (error) {
    console.error('Weather fetch error:', error)
    return null
  }
}

const setRoute = async () => {
  console.log("inside set route");
  
  sourceCoords.value = await getCoords(source.value);
  destCoords.value = await getCoords(destination.value);

  if (!sourceCoords.value || !destCoords.value) {
    alert('Invalid source or destination');
    return;
  }

  const coords = [
    [sourceCoords.value[1], sourceCoords.value[0]],
    ...store.stops.map(s => [parseFloat(s.lon), parseFloat(s.lat)]),
    [destCoords.value[1], destCoords.value[0]]
  ];

  const response = await fetch('https://api.openrouteservice.org/v2/directions/driving-car/geojson', {
    method: 'POST',
    headers: {
      'Authorization': '5b3ce3597851110001cf6248c9f6e0b88f4d4b41b571825d187fea11',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ coordinates: coords })
  });

  const data = await response.json();
  const segments = data.features[0]?.properties?.segments || [];
  totalDistance.value = data.features[0]?.properties?.summary?.distance || 0;


  stopDistances.value = [];
  let cumulative = 0;
  for (let i = 0; i < segments.length; i++) {
    cumulative += segments[i].distance;

    if (i < store.stops.length) {
      stopDistances.value.push(cumulative);
    }
  }

  clearMarkers();
  if (routeLine.value) map.removeLayer(routeLine.value);

  markers.push(L.marker(sourceCoords.value).addTo(map).bindPopup('Source'));
  store.stops.forEach((s, i) => {
    const latlng = [parseFloat(s.lat), parseFloat(s.lon)];
    markers.push(L.marker(latlng, { icon: customIcon }).addTo(map).bindPopup(`Stop ${i + 1}`));
  });
  markers.push(L.marker(destCoords.value).addTo(map).bindPopup('Destination'));

  routeLine.value = L.geoJSON(data, {
    style: { color: 'blue', weight: 4 }
  }).addTo(map);

  map.fitBounds(routeLine.value.getBounds());
};

const searchPlaces = async () => {
  const data = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(searchQuery.value)}`).then(r => r.json());
  const place = data[0];
  if (!place) return alert('Stop not found');

  const alreadyExists = store.stops.some(s => s.lat === place.lat && s.lon === place.lon);
  if (!alreadyExists) {

    const weatherData = await fetchWeather(place.lat, place.lon)

    store.addStop({
      name: place.display_name,
      lat: place.lat,
      lon: place.lon,
      weatherData: weatherData
    });

    const marker = L.marker([parseFloat(place.lat), parseFloat(place.lon)], { icon: customIcon })
      .addTo(map)
      .bindPopup(`${place.display_name}<br>Weather: ${weatherData ? weatherData.weather[0].description : 'No data available'}`);
    stopMarkers.push({ marker, lat: place.lat, lon: place.lon });
     setRoute();
  }
  searchQuery.value = "";
};

const removeStop = (index) => {
  const stop = store.stops[index];
  store.removeStop(index);

  const markerIndex = stopMarkers.findIndex(m => m.lat === stop.lat && m.lon === stop.lon);
  if (markerIndex !== -1) {
    map.removeLayer(stopMarkers[markerIndex].marker);
    stopMarkers.splice(markerIndex, 1);
  }

  setRoute(); // Recalculate route after removing
};

const clearMarkers = () => {
  markers.forEach(m => map.removeLayer(m));
  markers = [];
};
</script>


<template>
   <header class="header">
      <h1>Trip<span style="color: black;">M</span>ate</h1>
      <nav>
        <router-link to="/trips">Your Trips</router-link>
        <router-link to="/favorites">Favorites</router-link>
        <button @click="logout" class="logout-button">Logout</button>
       
      </nav>
    </header>
  <div class="d-flex" style="height: 100vh;">
    <div class="p-3 w-25 bg-light overflow-auto">
      <h4 class="mb-3">Route Planner</h4>


      <input v-model="source" @input="suggest('source')" list="source-suggestions" placeholder="abcd" class="form-control mb-2" />
      <datalist id="source-suggestions">
        <option v-for="(s, i) in sourceSuggestions" :key="i" :value="s.display_name" />
      </datalist>


      <input v-model="destination" @input="suggest('destination')" list="destination-suggestions"
        placeholder="Destination" class="form-control mb-2" />
      <datalist id="destination-suggestions">
        <option v-for="(d, i) in destinationSuggestions" :key="i" :value="d.display_name" />
      </datalist>

      <button @click="setRoute" class="btn btn-primary mb-3">Set Route</button>

      <hr />

      <input v-model="searchQuery" @input="suggest('search')" list="search-suggestions" placeholder="Add Stop"
        class="form-control mb-2" />
      <datalist id="search-suggestions">
        <option v-for="(s, i) in searchSuggestions" :key="i" :value="s.display_name" />
      </datalist>

      <button @click="searchPlaces" class="btn btn-success mb-3">Add Stop</button>
      <br />
      <strong>Total Distance:</strong> {{ (totalDistance / 1000).toFixed(2) }} km

      <draggable v-model="store.stops" @end="setRoute" tag="ul" class="list-group mb-3" item-key="name">
        <template #item="{ element, index }">
          <li class="list-group-item d-flex justify-content-between align-items-center">
            <div>
              {{ element.name }}
              <br />
              <small v-if="stopDistances[index]">
                From source: {{ (stopDistances[index] / 1000).toFixed(2) }} km
              </small>
              <br/>
              <div v-if="element.weatherData">
              <small>Temperature: {{ element.weatherData.main.temp }}°C</small>
              <br/>
              <small>Weather: {{ element.weatherData.weather[0].description }}</small>
              <img :src="'http://openweathermap.org/img/wn/' + element.weatherData.weather[0].icon + '.png'"
                alt="Weather Icon" width="30" height="30" />
            </div>
            <button class="btn btn-sm btn-outline-danger" @click.stop="removeStop(index)">×</button>
          </div>
          </li>
        </template>
      </draggable>
      <hr />
      
    </div>

    <div id="map" class="w-75" style="height: 100%;"></div>
  </div>
</template>


<style scoped>
#map {
  width: 100%;
}
</style>
