import { defineStore } from "pinia";

export const useUserStore = defineStore('user', {
  state: () => ({
    userData: null,
    isRegistered: false,
    favoriteRoutes: [], // Store the list of favorite routes
  }),

  actions: {
    // Register a user and store their data
    registerUser(data) {
      this.userData = data;
      this.isRegistered = true;
    },

    // Logout the user and clear user data
    logout() {
      this.userData = null;
      this.isRegistered = false;
      this.favoriteRoutes = []; // Clear favorite routes when logging out
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
});





// import { defineStore } from "pinia";

// export const useUserStore = defineStore('user',{
//     state: () => ({
//         userData: null,
//         isRegistered: false,
//     }),

//     actions: {
//         registerUser(data){
//             this.userData = data
//             this.isRegistered = true
//         },
//         logout(){
//             this.userData = null
//             this.isRegistered = false
//         },
//     },
// })

