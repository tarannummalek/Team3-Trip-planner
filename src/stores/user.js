import { defineStore } from "pinia";

export const useUserStore = defineStore('user', {
  state: () => ({
    userData: [],
    currentUser: null,
    isRegistered: false,
    favoriteRoutes: [],
  }),

  actions: {
    //User Registration
    registerUser(data) {
      const findUser = this.userData.find(
        user =>  user.username === data.username    
      );
      if(findUser==null){
        this.userData.push(data);
       this.isRegistered = true;
       this.isSignedIn = false;
       return true;
      }
      else{
        alert("username exists...");
        return false;
      }
      
    },
 // User Login
    signinUser({username, password}) {
     
      const foundUser = this.userData.find(
        user =>  user.username === username && user.password === password   
      );

      if (foundUser) {
        this.currentUser = foundUser;
        this.isSignedIn = true;
        return true;
        
      } else {
        this.currentUser = null;
        this.isSignedIn = false;
        return false;
      }
    },

    // User Logout
    logout() {
      // this.userData = null;
      // this.isRegistered = false;

      this.currentUser = null;
      this.isSignedIn = false;
      this.favoriteRoutes = []; 
    },

    // Add a route to favorites
    addToFavorites(route) {
      if (!this.favoriteRoutes.find(fav => fav.id === route.id)) {
        this.favoriteRoutes.push(route); // Add route if not already bookmarked
      }
    },

    // Remove a route from favorites
    removeFromFavorites(routeId) {
      this.favoriteRoutes = this.favoriteRoutes.filter(fav => fav.id !== routeId); // Remove route by ID
    },
  },

  persist: true
});

