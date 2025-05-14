<script setup>
import { computed, onMounted, ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios';
import { useStopStore } from '@/stores/useStopStore';
const images = import.meta.glob('@/assets/photos/*.png', { eager: true, import: 'default' })

const userStore = useUserStore()
const router = useRouter()
const route = useRoute()
const isUserRegistered = ref(userStore.isRegistered);
const stopStore = useStopStore();
console.log(userStore.userData.username);
const isLoggedIn = computed(() => route.query.isLoggedIn === 'true');

const favorites = ref([])

const handleRegisterClick = () => {
  // Redirect to registration page if the user is not registered
  router.push('/');
};

// Handle login click
const handleLoginClick = () => {
  // Redirect to login page if the user is not logged in
  router.push('/');
};

// Logout function
const logout = () => {
  userStore.logout()
  stopStore.$reset()
  router.push('/')
}

// Start Trip function
const startTrip = (routetitle) => {
  console.log(`Starting trip for route ID: ${routetitle}`)
  //  logic to navigate to a trip details page
  // router.push('/leaflet',{params: { routeTitle: routetitle } })
  
  router.push({ name: 'Leaflet', params: { routeTitle: routetitle } });
  // router.push(`/leaflet/${routeTitle}`)
}

const toggleBookmark = (routeId) => {
  const route = trendingRoutes.value.find((r) => r.id === routeId);
  if (route) {
    route.bookmarked = !route.bookmarked;
    if (route.bookmarked) {
      // Add to favorites using Pinia store
      userStore.addToFavorites(route);
    } else {
      // Remove from favorites using Pinia store
      userStore.removeFromFavorites(routeId);
    }
  }
};

const upcomingTrips = ref([
  {
    id: 1,
    title: 'Denver 2024',
    description: 'Experience the beauty of the Rocky Mountains',
    image: '@/assets/photos/home.png',
    dates: 'Dates TBA',
    duration: '7 days',
    travelers: 4
  }
])

const trendingRoutes = ref([
  {
    id: 1,
    title: 'Manali',
    description: 'Explore snow-capped peaks and dramatic valleys in the Himalayas.',
    image: images['/src/assets/photos/8.png'],
    featured: true,
    distance: '478 km',
    duration: '2–3 days',
    bookmarked: false
  },
  {
    id: 2,
    title: 'Jodhpur',
    description: 'Jodhpur is a famous tourist spot with a palace,Is stark landscape of the Thar Desert.',
    image: images['/src/assets/photos/7.png'],
    featured: false,
    distance: '160 km',
    duration: '3–4 hrs',
    bookmarked: false
  },
  {
    id: 3,
    title: 'Bangalore',
    description: 'A picturesque drive of Winding roads through forests and tea gardens.',
    image: images['/src/assets/photos/11.png'],
    featured: false,
    distance: '270 km',
    duration: '6–7 hrs',
    bookmarked: false
  },
  {
    id: 4,
    title: 'Guwahati',
    description: 'Adventurous route with lush landscapes and mountain passes.',
    image: images['/src/assets/photos/9.png'],
    featured: false,
    distance: '520 km',
    duration: '2–3 days',
    bookmarked: false
  },
  {
    id: 5,
    title: 'Udaipur',
    description: 'Udaipur, nicknamed the City of Lakes,is a romantic destination in Rajasthan.',
    image: images['/src/assets/photos/10.png'],
    featured: false,
    distance: '560 km',
    duration: '9–10 hrs',
    bookmarked: false
  },
  {
    id: 6,
    title: 'Kashmir',
    description: 'Kashmir is a breathtakingly beautiful region, often referred to as Paradise on Earth.',
    image: images['/src/assets/photos/6.png'],
    featured: false,
    distance: '250 km',
    duration: '5–6 hrs',
    bookmarked: false
  }
])

const roadTripTips = ref([
  {
    id: 1,
    icon: 'car',
    title: 'Vehicle Maintenance',
    description: 'Check your car\'s fluids, tires, and brakes before any long journey.'
  },
  {
    id: 2,
    icon: 'map-marker',
    title: 'Plan Your Stops',
    description: 'Research interesting landmarks and attractions along your route.'
  },
  {
    id: 3,
    icon: 'bed',
    title: 'Book Accommodation',
    description: 'Reserve hotels or campsites ahead of time, especially during peak seasons.'
  },
  {
    id: 4,
    icon: 'utensils',
    title: 'Local Cuisine',
    description: 'Try regional specialties and support local restaurants along your journey.'
  },
  {
    id: 5,
    icon: 'first-aid',
    title: 'Pack a First Aid Kit',
    description: 'Be prepared for emergencies by carrying a basic first aid kit.'
  },
  {
    id: 6,
    icon: 'camera',
    title: 'Capture Memories',
    description: 'Bring a camera or smartphone to document your journey and scenic views.'
  },
  {
    id: 7,
    icon: 'gas-pump',
    title: 'Fuel Up',
    description: 'Plan fuel stops in advance, especially in remote areas with limited gas stations.'
  },
  {
    id: 8,
    icon: 'sun',
    title: 'Stay Hydrated',
    description: 'Carry plenty of water to stay hydrated during long drives.'
  },
  {
    id: 9,
    icon: 'music',
    title: 'Create a Playlist',
    description: 'Prepare a road trip playlist to keep the mood lively and enjoyable.'
  }
])
const weatherForecasts = ref([])
 
const apiKey = '3e5731c0e204f4579581cc285733d0cf' 
const cities = ['Jaipur', 'Ahmedabad', 'Goa', 'Kerala'] 
 
const fetchForecasts = async () => {
  const results = []
 
  for (const city of cities) {
    try {
      const response = await axios.get(
        'https://api.openweathermap.org/data/2.5/forecast',
        {
          params: {
            q: city,
            appid: apiKey,
            units: 'metric'
          }
        }
      )
 
      const data = response.data
      const firstForecast = data.list[0]
      
      results.push({
        city: data.city.name,
        dateRange: new Date(firstForecast.dt_txt).toLocaleDateString(),
        icon: firstForecast.weather[0].icon,
        temperature: Math.round(firstForecast.main.temp),
        condition: firstForecast.weather[0].description,
        humidity: firstForecast.main.humidity,
        wind: firstForecast.wind.speed
      })
    } catch (err) {
      console.error(`Error fetching forecast for ${city}:`, err)
    }
  }
 
  weatherForecasts.value = results
}

const popularStops = ref([
  {
    id: 1,
    city: 'Shillong, Meghalaya',
    temperature: '15°C',
    condition: 'Misty',
    icon: '🌫️',
    tags: ['Scenic', 'Waterfalls'],
    rating: 4.8,
    image: images['/src/assets/photos/p1.png']
  },
  {
    id: 2,
    city: 'Tawang, AP',
    temperature: '10°C',
    condition: 'Snowy',
    icon: '❄️',
    tags: ['Monastery', 'Snow'],
    rating: 4.5,
    image: images['/src/assets/photos/p2.png']
  },
  {
    id: 3,
    city: 'Munnar, Kerala',
    temperature: '22°C',
    condition: 'Sunny',
    icon: '☀️',
    tags: ['Tea Gardens', 'Hills'],
    rating: 4.7,
    image: images['/src/assets/photos/p3.png']
  },
  {
    id: 4,
    city: 'Leh-Ladakh, J&K',
    temperature: '5°C',
    condition: 'Cloudy',
    icon: '☁️',
    tags: ['Mountains', 'Adventure'],
    rating: 4.3,
    image: images['/src/assets/photos/p4.png']
  }
])


onMounted(fetchForecasts)
</script>

<template>
  <div id="app">
    <!-- Header -->
    <header class="header">
      <a href="/" style="text-decoration: none;">

      
      <h1>Trip<span style="color: black;">M</span>ate</h1> </a>
      <nav>
        <router-link to="/trips">Your Trips</router-link>
        <router-link to="/favorites">Favorites</router-link>
        <button v-if="!isLoggedIn" @click="logout" class="logout-button">Logout</button>
       
      </nav>
    </header>

    <!-- Hero Banner -->
    <section class="hero-banner">
      <div class="hero-text">
        <h2>Welcome {{ userStore.userData.username }}</h2>
        <h2>Your Adventure Awaits</h2>
        <p>Start planning your next road trip today and explore the most beautiful routes across the country.</p>
        <button class="cta-button"> <router-link to="/leaflet" style="text-decoration: none; color: white;"><i class="fa fa-car"></i> &nbsp; &nbsp; Plan Your Trip</router-link></button>
      </div>
    </section>

    <!-- Search Area -->
    <div class="search-container">
      <div class="search">
        <i class="fa fa-search"></i>
        <input type="text" placeholder="Search for cities, routes, or attractions" />
      </div>
      <div class="quick-links">
        <div class="quick-link">
          <i class="fa fa-road"></i>
          <span>Trending Routes</span>
        </div>
        <div class="quick-link">
          <i class="fa fa-map-marker"></i>
          <span>Popular Stops</span>
        </div>
        <div class="quick-link">
          <i class="fa fa-car"></i>
          <span>Road Conditions</span>
        </div>
        <div class="quick-link">
          <i class="fa fa-gas-pump"></i>
          <span>Gas Stations</span>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <!-- Upcoming Trips -->
      <section class="upcoming">
  <!-- <div class="section-header">
    <h2>Upcoming Trips</h2>
    <router-link to="#" class="view-all">View All</router-link>
  </div> -->

  


  <!-- If the user is not registered -->
  <div class="trip-placeholder" v-if="!isUserRegistered">
  <div class="trip-card placeholder-card">
    <div class="trip-image">
      <img src="@/assets/photos/u1.png" alt="Placeholder image" />
      <div class="overlay">
        <h3>Sign in to View Trips</h3>
        <p>Login or register to access your upcoming trips and start planning your adventures.</p>
        <div class="trip-actions">
          <button class="action-button view-button" @click="handleLoginClick">Login</button>
          <button class="action-button edit-button" @click="handleRegisterClick">Register</button>
        </div>
      </div>
    </div>
  </div>
</div>


<!-- If the user is registered -->
 <div v-if="!stopStore.source && !stopStore.destination && stopStore.stops.length === 0 && !isLoggedIn" class="no-trips">
  <p>No latest trips found. Start planning your next adventure!</p>
</div>
  <div v-else>
<div class="main-content container my-4" v-if="!isLoggedIn">
  <section class="upcoming">
    <div class="section-header d-flex justify-content-between align-items-center mb-3">
      <h2>Latest Trips</h2>
      <!-- <router-link to="#" class="btn btn-primary">View All</router-link> -->
    </div>

    <div class="trip-card shadow-sm p-3">
      <div class="trip-details">
        <h5 class="card-title mb-3">Trip ID: {{ stopStore.tripId || 'N/A' }}</h5>
        
        <div class="mb-2">
          <i class="bi bi-geo-alt-fill text-danger"></i>
          <strong>Source:</strong> {{ stopStore.source || 'N/A' }}
        </div>
        
        <div class="mb-2">
          <i class="bi bi-flag-fill text-success"></i>
          <strong>Destination:</strong> {{ stopStore.destination || 'N/A' }}
        </div>

        <div>
          <i class="bi bi-map-fill text-info"></i>
          <strong>Stops:</strong>
          <ul v-if="stopStore.stops.length" class="list-unstyled ms-3 mt-1">
            <li v-for="(stop, index) in stopStore.stops" :key="index">📍 {{ stop.name }}</li>
          </ul>
          <p v-else class="text-muted ms-2">No stops added yet.</p>
        </div>
      </div>
    </div>
  </section>
</div>
</div>
  
   
</section>



      <section class="trending">
  <div class="section-header">
    <h2>Trending Routes</h2>
    <router-link to="#" class="view-all">View All</router-link>
  </div>
  <div class="route-cards">
    <div class="route-card" 
      v-for="route in trendingRoutes" 
      :key="route.id"
    >
      <div class="route-image">
        <img :src="route.image" :alt="route.title" />
        <div v-if="route.featured" class="route-badge">FEATURED</div>
      </div>
      <div class="route-details">
        <h4>{{ route.title }}</h4>
        <p class="route-description">{{ route.description }}</p>
        <div class="route-meta">
          <div class="route-stats">
            <!-- <div class="stat">
              <i class="fa fa-road"></i>
              <span>{{ route.distance }}</span>
            </div> -->
            <!-- <div class="stat">
              <i class="fa fa-clock"></i>
              <span>{{ route.duration }}</span>
            </div> -->
          </div>
          <!-- Bookmark Icon -->
          <i 
            class="fa fa-bookmark bookmark" 
            :class="{ active: route.bookmarked }" 
            @click="toggleBookmark(route.id)"
          ></i>
        </div>
        <!-- Start Trip Button -->
        <button class="start-trip-button" @click="startTrip(route.title)">
          <i class="fa fa-car"></i> Start Trip Here
        </button>
      </div>
    </div>
  </div>
</section>
<!-- Weather Forecast -->
<section class="weather-forecast">
  <div class="section-header">
    <h2>Weather Forecasts</h2>
    <p>Plan ahead with accurate weather predictions for your destinations</p>
  </div>
  <div class="forecast-grid">
    <div 
      class="forecast-card" 
      v-for="forecast in weatherForecasts" 
      :key="forecast.id">
      <h4>{{ forecast.city }}</h4>
      <p class="date-range">{{ forecast.dateRange }}</p>
      <img 
          :src="'http://openweathermap.org/img/wn/' + forecast.icon + '.png'" 
          alt="icon" 
          width="50"
        />
      <p class="temperature">{{ forecast.temperature }}</p>
      <p class="condition">{{ forecast.condition }}</p>
      <div class="details">
        <p><i class="fa fa-tint"></i> {{ forecast.humidity }} humidity</p>
        <p><i class="fa fa-wind"></i> {{ forecast.wind }}</p>
      </div>
    </div>
  </div>
</section>

<section class="popular-stops">
  <div class="section-header">
    <h2>Popular Stops</h2>
    <router-link to="#" class="view-all">View all</router-link>
  </div>
  <div class="stops-grid">
    <div 
      class="stop-card" 
      v-for="stop in popularStops" 
      :key="stop.id"
    >
      <div class="stop-image">
        <img :src="stop.image" :alt="stop.city" />
        <div class="stop-rating">
          <i class="fa fa-star"></i> {{ stop.rating }}
        </div>
      </div>
      <div class="stop-details">
        <h4>{{ stop.city }}</h4>
        <p class="stop-condition">
          <span class="weather-icon">{{ stop.icon }}</span>
          {{ stop.temperature }} - {{ stop.condition }}
        </p>
        <div class="stop-tags">
          <span v-for="tag in stop.tags" :key="tag" class="tag">{{ tag }}</span>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="tips">
  <div class="section-header">
    <h2>Essential Road Trip Tips</h2>
    <router-link to="#" class="view-all">More Tips</router-link>
  </div>
  <div class="tip-grid">
    <div 
      class="tip-item" 
      v-for="tip in roadTripTips" 
      :key="tip.id"
    >
      <div class="tip-icon">
        
        <i :class="'fa fa-' + tip.icon"></i>
      </div>
      <div class="tip-content">
        <h5>{{ tip.title }}</h5>
        <p>{{ tip.description }}</p>
      </div>
    </div>
  </div>
</section>

      <!-- Newsletter -->
      <section class="newsletter">
  <h3>Stay Updated on Travel Inspiration</h3>
  <p>Subscribe to our newsletter and get the latest travel tips, route suggestions, and exclusive offers delivered straight to your inbox.</p>
  <form class="newsletter-form">
    <input type="email" placeholder="Your email address" />
    <button type="submit">Subscribe</button>
  </form>
</section>

    </div>
    <footer class="footer">
    <div class="footer-content">
      <div class="footer-section contact">
        <h3>Contact Us</h3>
        <p>Email: support@teamQueen.com</p>
        <p>Phone: +91 888-6666-4567</p>
        <p>Address: Ahmedabad, Gujarat</p>
      </div>

      <div class="footer-section social">
        <h3>Follow Us</h3>
        <div class="social-icons">
          <a href="https://facebook.com" target="_blank" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
          <a href="https://twitter.com" target="_blank" aria-label="Twitter"><i class="fab fa-twitter"></i></a>
          <a href="https://instagram.com" target="_blank" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
          <a href="https://linkedin.com" target="_blank" aria-label="LinkedIn"><i class="fab fa-linkedin-in"></i></a>
        </div>
      </div>

      <div class="footer-section developer">
        <h3>Developed By</h3>
        <p class="love-text">With ❤️ from Team Queens</p>
      </div>
    </div>
    <div class="footer-bottom">
      &copy; 2025 Team Queens. All rights reserved.
    </div>
  </footer>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

body {
  background-color: #e1dfdf;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.section-header h2 {
  font-size: 1.8rem;
  color: #333;
}

.view-all {
  color: #ff7f50;
  text-decoration: none;
  font-weight: 600;
}

/* Responsive */
@media (max-width: 768px) {
  .main-content {
    padding: 0 1rem;
  }
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  background: linear-gradient(45deg,#2980b9 , #1f618d,#2c3e50);
  /* background: linear-gradient(45deg, #ff4500,#ff6347); */

  color: white;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 10px rgba(0,0,0,0.2);
  
}


.header h1 {
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: #ffffff;  
}


.header nav {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.header nav a {
  text-decoration: none;
  color: white;
  font-weight: 600;
  font-size: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  transition: all 0.3s ease;
  border: 1px solid transparent;
}

.header nav a:hover {
  background: rgba(255,255,255,0.2);
  color: #ff7f50; 
  border: 1px solid #ff7f50;  
}


.logout-button {
  background: #eb0000;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease;
}

.logout-button:hover {
  background: #ff3f1e; 
}

.header .icon {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.header .icon:hover {
  border: 2px solid #ff7f50;
}

@media (max-width: 768px) {
  .header {
    padding: 1rem;
  }
  
  .header h1 {
    font-size: 1.5rem;
  }
}

.hero-banner {
  height: 52vh;
  background-image: linear-gradient(rgba(59, 57, 57, 0.3), rgba(106, 93, 93, 0.3)),url('@/assets/photos/home3.png');
  background-size: cover;
  /* background-repeat: no-repeat; */
  background-position: center;
  background-attachment: fixed;
  color: white;
  text-align: center;
  padding: 8rem 2rem;
  border-radius: 0 0 20px 20px;
  position: relative;
  margin-bottom: 2rem;
}

.hero-text {
  max-width: 800px;
  margin: 0 auto;
}

.hero-text h2 {
  font-size: 3.5rem;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
}

.hero-text p {
  font-size: 1.3rem;
  margin-bottom: 2rem;
  text-shadow: 1px 1px 3px rgba(0,0,0,0.5);
}

.cta-button {
  background: #eb0000;
  padding: 1rem 2.5rem;
  font-size: 1.1rem;
  border-radius: 30px;
  border: none;
  color: white;
  cursor: pointer;
  font-weight: 600;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 4px 15px rgba(255,127,80,0.4);
}

.cta-button:hover {
  background: #e83a00;
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(255,127,80,0.6);
}

@media (max-width: 768px) {
  .hero-text h2 {
    font-size: 2.5rem;
  }
  
  .hero-text p {
    font-size: 1.1rem;
  }
}

.weather-widget {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(255,255,255,0.2);
  backdrop-filter: blur(10px);
  padding: 1rem;
  border-radius: 15px;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.weather-widget i {
  font-size: 2.5rem;
  color: #ffcd03;
}

.weather-info h4 {
  font-size: 1.2rem;
  margin-bottom: 0.3rem;
  
}

.weather-info p {
  font-size: 0.9rem;
  text-shadow: none;
 
}



.search-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 2rem;
}

.search {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
  position: relative;
}

.search input {
  width: 100%;
  padding: 1.2rem 1rem 1.2rem 3rem;
  border-radius: 30px;
  border: 1px solid #ddd;
  font-size: 1rem;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  transition: all 0.3s ease;
}

.search input:focus {
  outline: none;
  border-color: #ff7f50;
  box-shadow: 0 4px 20px rgba(255,127,80,0.15);
}

.search i {
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  color: #777;
}

.quick-links {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;
}

.quick-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: white;
  padding: 0.7rem 1.5rem;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
}

.quick-link:hover {
  background: #f0f0f0;
  transform: translateY(-2px);
}

.quick-link i {
  color: #ff7f50;
}

.upcoming {
  margin-bottom: 3rem;
  
}

.placeholder-card {
  position: relative; 
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  padding: 0;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease;
  margin: 0;
  /* margin-bottom: 1rem; */
  overflow: hidden; 
  height: 180px;
}

.placeholder-card:hover {
  transform: translateY(-5px);
}

.placeholder-card .trip-image {
  position: relative;
  width: 100%;
  height: 160px;
  border-radius: 15px;
  overflow: hidden;
}

.placeholder-card .trip-image img {
  width: 100%;
  height: 160px;
  object-fit: cover;
}

.placeholder-card .overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.1); 
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  text-align: center;
  padding: 1rem;
}

.placeholder-card .overlay h3 {
  font-size: 1.6rem;
  margin-bottom: 0.5rem;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.placeholder-card .overlay p {
  font-size: 1.1rem;
  margin-bottom: 1rem;
  color: #f0f0f0;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.7);
}

.placeholder-card .overlay .trip-actions {
  display: flex;
  gap: 1rem;
}

.placeholder-card .overlay .action-button {
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.placeholder-card .overlay .view-button {
  background: #007bff;
  color: white;
  border: none;
}

.placeholder-card .overlay .view-button:hover {
  background: #0056b3;
}

.placeholder-card .overlay .edit-button {
  background: white;
  color: #333;
  border: 1px solid #ddd;
}

.placeholder-card .overlay .edit-button:hover {
  background: #f5f5f5;
}

.trip-card {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  background: white;
  padding: 1.5rem;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.08);
  transition: transform 0.3s ease;
  margin-bottom: 1rem;
}

.trip-card:hover {
  transform: translateY(-5px);
}

.trip-image {
  width: 200px;
  height: 100px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.trip-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.trip-details {
  flex: 1;
}

.trip-details h3 {
  font-size: 1.4rem;
  margin-bottom: 0.3rem;
  color: #333;
}

.trip-details p {
  font-size: 0.9rem;
  color: #777;
  margin-bottom: 0.5rem;
}

.trip-m {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-top: 0.8rem;
}

.mItem {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.85rem;
  color: #555;
}

.mItem i {
  color: #ff7f50;
}

.trip-actions {
  display: flex;
  gap: 1rem;
}

.action-button {
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.view-button {
  background: #333;
  color: white;
  border: none;
}

.view-button:hover {
  background: #555;
}

.edit-button {
  background: white;
  color: #333;
  border: 1px solid #ddd;
}

.edit-button:hover {
  background: #f5f5f5;
}

@media (max-width: 768px) {
  .trip-card {
    flex-direction: column;
    text-align: center;
  }
  
  .trip-m {
    justify-content: center;
  }
  
  .trip-actions {
    margin-top: 1rem;
    justify-content: center;
  }
}
.start-trip-button {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  color: #007bff;
  border: 2px solid #007bff;
  padding: 0.8rem 1.5rem;
  border-radius: 30px;
  /* font-weight: 600; */
  cursor: pointer;
  transition: background 0.3s ease, transform 0.3s ease;
  margin-top: 1rem;
  font-size: 1rem;
  margin-left: 50px;
}

.start-trip-button i {
  margin-right: 0.5rem;
  font-size: 1.2rem;
}

.start-trip-button:hover {
  background: #007bff;
  color: #ffffff;
  transform: translateY(-2px);
}

.trending {
  margin-bottom: 3rem;
}

.route-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.route-card {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0,0,0,0.08);
  transition: transform 0.3s ease;
}

.route-card:hover {
  transform: translateY(-8px);
}

.route-image {
  height: 200px;
  overflow: hidden;
  position: relative;
}

.route-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.route-card:hover .route-image img {
  transform: scale(1.05);
}

.route-badge {
  position: absolute;
  top: 15px;
  left: 15px;
  background: #ff7f50;
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.route-details {
  padding: 1.5rem;
}

.route-details h4 {
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
  color: #333;
}

.route-description {
  font-size: 0.9rem;
  color: #777;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.route-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.route-stats {
  display: flex;
  gap: 1rem;
}

.stat {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.85rem;
  color: #555;
}

.stat i {
  color: #ff7f50;
}

.bookmark {
  color: #aaa;
  cursor: pointer;
  transition: color 0.3s ease;
}

.bookmark:hover, .bookmark.active {
  color: #ff7f50;
}


.tips {
  background: white;
  border-radius: 15px;
  padding: 2rem;
  margin-bottom: 3rem;
  box-shadow: 0 4px 15px rgba(0,0,0,0.08);
}

.tip-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.tip-item {
  display: flex;
  gap: 1rem;
}

.tip-icon {
  min-width: 40px;
  height: 40px;
  background: #f0f7ff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3498db;
}

.tip-content h5 {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  color: #333;
}

.tip-content p {
  font-size: 0.9rem;
  color: #777;
  line-height: 1.5;
}

.weather-forecast {
  background: #f5faff;
  border-radius: 15px;
  padding: 2rem;
  margin-bottom: 3rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.weather-forecast .section-header {
  text-align: center;
  margin-bottom: 2rem;
}

.weather-forecast .section-header h2 {
  font-size: 2rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.weather-forecast .section-header p {
  font-size: 1rem;
  color: #777;
}

.forecast-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}

.forecast-card {
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease;
}

.forecast-card:hover {
  transform: translateY(-5px);
}

.forecast-card h4 {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.forecast-card .date-range {
  font-size: 0.9rem;
  color: #777;
  margin-bottom: 1rem;
}

.forecast-card .weather-icon {
  font-size: 3rem;
  margin: 1rem 0;
}

.forecast-card .temperature {
  font-size: 2rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 0.5rem;
}

.forecast-card .condition {
  font-size: 1rem;
  color: #777;
  margin-bottom: 1rem;
}

.forecast-card .details {
  font-size: 0.9rem;
  color: #555;
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.forecast-card .details i {
  margin-right: 0.3rem;
  color: #3498db;
}

.popular-stops {
  margin-bottom: 3rem;
}

.stops-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}

.stop-card {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease;
}

.stop-card:hover {
  transform: translateY(-5px);
}

.stop-image {
  position: relative;
  height: 150px;
  overflow: hidden;
}

.stop-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.stop-rating {
  position: absolute;
  top: 10px;
  right: 10px;
  background: #333;
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.stop-details {
  padding: 1rem;
  text-align: center;
}

.stop-details h4 {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: #333;
}

.stop-condition {
  font-size: 0.9rem;
  color: #777;
  margin-bottom: 1rem;
}

.stop-tags {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tag {
  background: #f0f7ff;
  color: #3498db;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
}

/* Newsletter Section */
.newsletter {
  background: linear-gradient(90deg, #ff7f50, #ff6347);
  color: white;
  text-align: center;
  padding: 2rem;
  border-radius: 15px;
  margin-bottom: 3rem;
}

.newsletter h3 {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.newsletter p {
  font-size: 1rem;
  margin-bottom: 1.5rem;
}

.newsletter-form {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.newsletter-form input {
  padding: 0.8rem 1rem;
  border-radius: 30px;
  border: none;
  flex: 1;
  max-width: 400px;
  font-size: 1rem;
}

.newsletter-form button {
  padding: 0.8rem 2rem;
  border-radius: 30px;
  border: none;
  background: #333;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s ease;
}

.newsletter-form button:hover {
  background: #555;
}

.footer {
  width: 100%;
  background-color: #1a1a1a;
  color: #f1f1f1;
  padding: 40px 20px 20px;
  font-family: 'Segoe UI', sans-serif;
}

.footer-content {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 40px;
  /* max-width: 1200px; */
  margin-left: 280px;
}

.footer-section {
  flex: 1 1 250px;
}

.footer-section h3 {
  margin-bottom: 10px;
  font-size: 18px;
  color: #fff;
}

.footer-section p {
  margin: 4px 0;
  color: #ccc;
  font-size: 14px;
}

.social-icons {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}

.social-icons a {
  color: #ccc;
  font-size: 18px;
  transition: color 0.3s ease;
}

.social-icons a:hover {
  color: #4fc3f7;
}

.love-text {
  margin-top: 12px;
  font-style: italic;
  color: #bbb;
}

.footer-bottom {
  text-align: center;
  margin-top: 30px;
  font-size: 13px;
  color: #999;
}
</style>


