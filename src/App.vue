<template>
  <v-app id="inspire">    
    <div v-show="!isAuthenticated">
      <router-view />
    </div>
       
    <div v-show="isAuthenticated">
      <nav-bar />
      <v-main>
        <div style="min-height: calc(89vh - 64px);">
          <router-view />
        </div>
        <footer-bar />      
      </v-main>
    </div>
  </v-app>
</template>

<script >
 import NavBar from './components/NavBar.vue';
 import { useAuthStore } from './modules/login/store';
 import FooterBar from './components/FooterBar.vue';


export default {
  components: {
    NavBar,
    FooterBar
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