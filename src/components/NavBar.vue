<template>
  <div>
   
    <v-navigation-drawer
      class="rounded-be-lg"
      v-model="drawer"
      :rail="isMobile ? false : rail"
      :permanent="isMobile ? false : true"
      :flat="isMobile ? false : true"      
      elevation="1"
    >
    <v-list class="mt-3">
      <avatar-usuario :showUsername="isMobile ? true : !rail" :openModal="true"/> 
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
    <app-bar @update="toggleRail" />
  </div>
</template>

<script>
import AppBar from './AppBar.vue';
import AvatarUsuario from '../modules/avatarUsuario/view/AvatarUsuario.vue';

export default {
  components: {
    AppBar,
    AvatarUsuario
  },
  data: () => ({
    nomeAvatar: false,
    drawer: true,
    username: '',
    textoFiltro: '',
    rail: true, // Comece com o rail recolhido
    main: [],
    parametros: [],
    isMobile: false, // Variável para verificar se a tela é móvel
  }),
  mounted() {
    // Use window.innerWidth para verificar a largura da tela
    this.isMobile = window.innerWidth <= 600; // Por exemplo, considere 768 como a largura de tela para dispositivos móveis
  },
  methods: {
    filterItemMenu(menuName) {
      menuName = menuName.toLowerCase();
      const filtro = this.textoFiltro.toLowerCase();
      return menuName && menuName.includes(filtro);
    },
    changeDrawer(draweUpdated) {
      this.drawer = draweUpdated;
    },
    toggleRail() {
      if (this.isMobile) {
        this.drawer = !this.drawer; // Alternar o drawer em telas menores
      } else {
        this.rail = !this.rail; // Alternar o rail em telas maiores
      }
    },
  },
};
</script>
