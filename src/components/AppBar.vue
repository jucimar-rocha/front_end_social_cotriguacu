<template>
   <v-app-bar class="flex-grow-0" flat color="#FFFFFF" elevation="1">

    <v-app-bar-nav-icon color="primary" @click="toogleBarraLateral"></v-app-bar-nav-icon>

      <v-app-bar-title>Media Social</v-app-bar-title>

      <v-spacer></v-spacer>
    
      <v-menu>
            <template v-slot:activator="{ props }">
              <v-btn class="v-btn--icon" color="primary" icon="mdi-logout" v-bind="props"></v-btn>
            </template>

            <v-list>
              <v-list-item
                v-for="(item, i) in items"
                :key="i"
              >               
                <v-btn class="btn_sair" color="" @click="logout">Sair</v-btn>
              </v-list-item>
            </v-list>
          </v-menu>

    </v-app-bar>
</template>

<script>
import { useAuthStore } from '../modules/login/store';

export default {
    data: () => ({ 
     drawer: true ,
     items: [
             { title: 'Sair' }
            ],
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
<style scoped>
.btn_sair:hover{
  background-color: rgb(97, 131, 83);
  border-radius: 10px;
}
</style>
