<template>
   <v-app-bar class="flex-grow-0" flat color="rgba(166, 178, 205, 0.2)">

    <v-app-bar-nav-icon @click="toogleBarraLateral"></v-app-bar-nav-icon>

      <v-app-bar-title>Media Social</v-app-bar-title>

      <v-spacer></v-spacer>

       <v-btn icon @click="logout">
          <v-icon>mdi-logout</v-icon>
        </v-btn> 

        <v-avatar class="mr-5">
            <v-img src="../assets/tuti.jpg">

            </v-img>
        </v-avatar>
          
    </v-app-bar>
</template>

<script>
import { useAuthStore } from '../modules/login/store';

export default {
    data: () => ({ 
            drawer: true 
        }),
        methods: {
            toogleBarraLateral() {
                this.drawer = !this.drawer;
                this.$emit('update', this.drawer);
            },
            logout() {
                var authStore = useAuthStore();
                authStore.logout();
            }
        }        
}
</script>
