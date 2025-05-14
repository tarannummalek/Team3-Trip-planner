<script setup>
import { ref } from 'vue';
import {useRouter} from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const username = ref('')
const email = ref('')
const password = ref('')

const showRegister = ref(false)


console.log(userStore.userData);


const register = () => {
    userStore.registerUser({
      username: username.value,
        email: email.value,
        password: password.value
    },
  
  )
   
    router.push('/planner')
}

</script>

<template>
  <div class="hero">
    <div class="overlay"></div>

    <nav class="navbar">
      <div class="logo">Trip<span style="color: black;">M</span>ate</div>
      <!-- <button class="signBtn" @click="showSignIn = true">Sign In</button> -->
    </nav>

    <div class="hero-content">
      <h1>Discover the Freedom<br />of the Open Road</h1>
      <p>Plan, organize, and embark <br>on your next great adventure with TripMate.</p>
      <div class="mainbuttons">
        <button class="startbtn" @click="$router.push('/planner')">GET STARTED</button>
        <button class="registerbtn" @click="showRegister = true">Register</button>
      </div>
    </div>


    <!-- Register Form Modal -->
    <div class="modal" v-if="showRegister"> 
      <div class="modal-content">
        <h2>Register</h2>
        <form @submit.prevent="register">
          <input type="text" placeholder="Username" v-model="username" />
          <input type="email" placeholder="Email" v-model="email" />
          <input type="password" placeholder="Password" v-model="password" />
          <button type="submit">Register</button>
        </form>
        <button class="close-btn" @click="showRegister = false">Close</button>
      </div>
    </div>
  </div>
</template>


  
  <style scoped>
  html, body {
    margin: 0;
    padding: 0;
    height: 100%;
    overflow: hidden;
  }
  
  .hero {
    position: relative;
    background-image: url('@/assets/photos/home.png');
    background-size: cover;
    background-position: center;
    height: 100vh;
    color: white;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    overflow: hidden;
  }
  
  
  .navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 40px;
    position: relative;
   
  }
  
  .logo {
    font-size: 2rem;
    font-weight: bold;
    letter-spacing: 1px;
  }
  
  
  .signBtn {
    background-color: black;
    color: white;
    border: none;
    padding: 10px 20px;
    font-weight: 600;
    font-size: 1rem;
    border-radius: 8px;
    cursor: pointer;
  }
  
  .signBtn:hover {
    background-color: #222;
  }
  
  
  .hero-content {
    position: absolute;
    top: 350px;
    left: 200px;
    transform: translateY(-50%);
    text-align: left;
    
  }
  
  
  .hero-content h1 {
    font-size: 5rem;
    font-weight: 800;
    line-height: 1.2;
    margin-bottom: 30px;
    color: white;
  }
  
  
  .hero-content p {
    font-size: 2rem;
    margin-bottom: 40px;
    color: white;
    line-height: 1.6;
  }
  
  .mainbuttons {
    display: flex;
    gap: 18px;
    opacity: 0.9;
    
  }
  
  .startbtn,
  .registerbtn {
    padding: 14px 28px;
    font-size: 1.1rem;
    font-weight: bold;
    border-radius: 8px;
    cursor: pointer;
    border: none;
  }
  
  .startbtn {
    background-color: black;
    color: white;
  }
  
  .startbtn:hover {
    background-color: #222;
  }
  
  .registerbtn {
    background-color: white;
    color: black;
  }
  
  .registerbtn:hover {
    background-color: #f0f0f0;
  }

  .modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  width: 400px;
  text-align: center;
  color: black;
}

.modal-content input {
  width: 90%;
  padding: 10px;
  margin: 10px 0;
}

.modal-content button {
  padding: 10px 20px;
  margin-top: 10px;
  font-weight: bold;
  cursor: pointer;
}

.close-btn {
  margin-top: 20px;
  background-color: #ccc;
  border: none;
  border-radius: 6px;
}

.close-btn:hover {
  background-color: #aaa;
}
  
  
  </style>
  
  