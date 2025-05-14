<template>
 
    <header class="header">
        <h1>Trip<span style="color: black;">M</span>ate</h1>
        <nav>
          <router-link to="/planner" >Home</router-link>
          <router-link to="/trips">Your Trips</router-link>
          <router-link to="/favorites" class="fav-link">Favorites</router-link>
        </nav>
      </header>
      
        <button class="back-button" @click="goBack">←</button>
      
    <div class="favorites-container">

      <h2>Your Favorite Routes</h2>
      <div v-if="favoriteRoutes.length === 0" class="no-favorites">
        <p>No favorite routes added yet. Bookmark some routes from the trending section!</p>
      </div>
      <div v-else class="favorite-list">
        <div v-for="route in favoriteRoutes" :key="route.id" class="favorite-card">
          <div class="favorite-card-image">
            <img :src="route.image" alt="Route image" />
          </div>
          <div class="favorite-card-details">
            <h3>{{ route.title }}</h3>
            <p>{{ route.description }}</p>
            <div class="route-meta">
              <div class="route-info">
                <i class="fa fa-road"></i> {{ route.distance }} | 
                <i class="fa fa-clock"></i> {{ route.duration }}
              </div>
            </div>
            <div class="favorite-card-actions">
              <button class="start-trip-btn" @click="startTrip(route.id)">Start Trip</button>
              <button class="remove-favorite-btn" @click="removeFromFavorites(route.id)">Remove from Favorites</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
import { useUserStore } from '@/stores/user';
import { useRouter } from 'vue-router';
import { computed } from 'vue';

const userStore = useUserStore();
const router = useRouter();


const favoriteRoutes = computed(() => userStore.favoriteRoutes);


const removeFromFavorites = (routeId) => {
  userStore.removeFromFavorites(routeId); 
  console.log(`Route with ID ${routeId} removed from favorites.`);
};


const startTrip = (routeId) => {
  console.log(`Starting trip for route ID: ${routeId}`);
};

const goBack = () => {
  router.go(-1);
};


const logout = () => {
  userStore.logout();
  router.push('/');
};
</script>
  
  <style scoped>

  .header {
    width: 100vw;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem 2rem;
    background: linear-gradient(45deg, #2980b9, #1f618d, #2c3e50);
    color: white;
    position: sticky;
    top: 0;
    z-index: 100;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    margin:0;
  }

  .route-meta .route-info i {
  color: #ff7f50; 
  margin-right: 5px; 
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
    background: rgba(255, 255, 255, 0.2);
    color: #ff7f50;
    border: 1px solid #ff7f50;
  }
  
  
  .fav-link {
    background: #007bff;
    color: white;
    font-weight: 600;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    cursor: pointer;
    transition: background 0.3s ease;
    text-decoration: none;
  }
  
  .fav-link:hover {
    background: #0056b3;
  }
  
  /* Back Button Styling */
  .back-button {
    background-color: #007bff;
    color: white;
    font-size: 1.1rem;
    font-weight: bold;
    padding: 10px 20px;
    border-radius: 10px;
    cursor: pointer;
    margin: 20px 20px 0px 20px;
    transition: background-color 0.3s ease;
    border: none;
    display: inline-block;
  }
  
  .back-button:hover {
    background-color: #0056b3;
  }
  
  /* Main Content Styling */
  .favorites-container {
    max-width: 1200px;
    margin: 40px auto;
    padding: 0 20px;
    background-color: #f9f9f9;
  }
  
  h2 {
    font-size: 2.5rem;
    color: #333;
    text-align: center;
    margin-bottom: 30px;
    font-weight: bold;
    padding-top: 20px;
  }
  
  .no-favorites {
    text-align: center;
    font-size: 1.2rem;
    color: #888;
  }
  
  .favorite-list {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  .favorite-card {
    display: flex;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  
  .favorite-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 25px rgba(0, 0, 0, 0.15);
  }
  
  .favorite-card-image {
    width: 200px;
    height: 150px;
    overflow: hidden;
  }
  
  .favorite-card-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .favorite-card-details {
    padding: 20px;
    flex: 1;
  }
  
  .favorite-card-details h3 {
    font-size: 1.6rem;
    color: #333;
    margin-bottom: 15px;
  }
  
  .favorite-card-details p {
    font-size: 1rem;
    color: #555;
    line-height: 1.6;
    margin-bottom: 20px;
  }
  
  .route-meta {
    font-size: 0.9rem;
    color: #777;
  }
  
  .route-meta .route-info {
    margin-bottom: 10px;
  }
  
  .favorite-card-actions {
    display: flex;
    gap: 10px;
    justify-content: flex-start;
  }
  
  .start-trip-btn,
  .remove-favorite-btn {
    padding: 10px 20px;
    font-size: 1rem;
    font-weight: bold;
    border-radius: 30px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    border: none;
  }
  
  .start-trip-btn {
    background-color: #4caf50;
    color: white;
  }
  
  .start-trip-btn:hover {
    background-color: #45a049;
  }
  
  .remove-favorite-btn {
    background-color: #e64a19;
    color: white;
  }
  
  .remove-favorite-btn:hover {
    background-color: #d84013;
  }
  </style>
  