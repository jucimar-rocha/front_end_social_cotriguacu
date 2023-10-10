<template>
   <v-app-bar class="flex-grow-0 rounded-lg" flat  elevation="1">

    <v-app-bar-nav-icon color="primary" @click="toogleBarraLateral"></v-app-bar-nav-icon>

      <v-app-bar-title class="title-appbar">Media Social</v-app-bar-title>

      <v-spacer></v-spacer>
      <div class="ml-auto">
      <v-btn class="text-none" stacked>
          <v-badge content="2" color="error">
            <v-icon color="primary">mdi-bell-outline</v-icon>
          </v-badge>
        </v-btn>
    
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
        </div>
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

@media (max-width: 600px) {
  .title-appbar{
    display: none;
  }
}
</style>
