<template>
  <app-bar @update="changeDrawer" />
  <v-navigation-drawer v-model="drawer" flat color="blue-grey-lighten-5" elevation="1">
    <v-divider></v-divider>
    <v-list>
      <v-list>
        <avatar-usuario :openModal="true"/>
      </v-list>
    </v-list>
    <v-list>
      <v-list-item>
        <v-text-field variant="underlined" class="condensed" v-model="textoFiltro" prepend-inner-icon="mdi-magnify" />
      </v-list-item>
      <v-list-item v-for="[icon, text, href] in main" :key="icon" :to="href" v-show="filterItemMenu(text)">
        <template v-slot:prepend>
          <v-icon>{{ icon }}</v-icon>
        </template>

        <v-list-item-title>{{ text }}</v-list-item-title>
      </v-list-item>

      <v-list-group value="Menu">

        <template v-slot:activator="{ props }">

          <v-list-item v-bind="props" title="Cadastros">

            <template v-slot:prepend>
              <v-icon>mdi-cog-outline</v-icon>
            </template>
          </v-list-item>

        </template>

        <v-list-item v-for="[icon, text, href] in parametros" :key="icon" :to="href" :nav="true"
          v-show="filterItemMenu(text)">
          <!-- <template v-slot:prepend>
              <v-icon>{{ icon }}</v-icon>
            </template> -->

          <v-list-item-title>{{ text }}</v-list-item-title>
        </v-list-item>
      </v-list-group>


    </v-list>

  </v-navigation-drawer>
</template>

<script>
import AppBar from './AppBar.vue';
import AvatarUsuario from './AvatarUsuario.vue';

export default {
  components: {
    AppBar,
    AvatarUsuario
  },
  data: () => ({
    drawer: true,
    username: '',
    textoFiltro: '', 
    main: [

    ],
    parametros: [
    ]
  }),
  methods: {
    filterItemMenu(menuName) {

      menuName = menuName.toLowerCase();
      const filtro = this.textoFiltro.toLowerCase();
      return menuName && menuName.includes(filtro);
    },
    changeDrawer(draweUpdated) {
      this.drawer = draweUpdated;
    },   
  }  
}
</script>
