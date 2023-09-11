<template>
  <v-app id="inspire">
    <!-- Only show the login view when not authenticated -->
    <div v-show="!isAuthenticated">
      <router-view />
    </div>

    <!-- Only show the main content and navigation bar when authenticated -->
    <div v-show="isAuthenticated">
      <nav-bar />
      <v-main>
        <router-view />
      </v-main>
    </div>
  </v-app>
</template>



<script >
 import NavBar from './components/NavBar.vue';
 import { useAuthStore } from './modules/login/store';


export default {
  components: {
    NavBar
  },
  data() {
    return {
      
    }
  },
  computed: {
    isAuthenticated() {
      return useAuthStore().isAuthenticate();
    }
  }
}
</script>

<style>
  * {
  scrollbar-width: auto;
  scrollbar-color: #dedede #f7f7f7;
}

/* Chrome, Edge, and Safari */
*::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

*::-webkit-scrollbar-track {
  background: #f7f7f7;
}

*::-webkit-scrollbar-thumb {
  background-color: #dedede;
  border-radius: 10px;
  border: 2px solid #ffffff;
}
</style>