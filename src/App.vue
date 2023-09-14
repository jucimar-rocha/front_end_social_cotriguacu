<template>
  <v-app id="inspire">
    
    <div v-show="!isAuthenticated">
      <router-view />
    </div>
   
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
body {
  margin: 0;
  font-family: 'TitilliumWeb',
  sans-serif;
  box-sizing: border-box;
}
</style>