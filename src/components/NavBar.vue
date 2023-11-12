<template>
  <div>
    <v-navigation-drawer 
    v-model="drawer" 
    :rail="isMobile ? false : rail"
    :permanent="isMobile ? false : true" 
    :flat="isMobile ? false : true" 
    elevation="1"
    style="background-color: rgb(1, 42, 64); color: white;">
      <v-list class="mt-3">
        <avatar-usuario :showUsername="isMobile ? true : !rail" :openModal="true" />
      </v-list>
      <v-list>
        <v-list-item>
          <v-text-field variant="underlined" class="condensed" v-model="textoFiltro" prepend-inner-icon="mdi-magnify" />
        </v-list-item>
        <v-list-item v-for="[icon, text, href] in main" :key="icon" :to="href" v-show="filterItemMenu(text)"
          class="list-item">
          <template v-slot:prepend>
            <v-icon>{{ icon }}</v-icon>
          </template>

          <v-list-item-title>{{ text }}</v-list-item-title>
        </v-list-item>

        <v-list-group class="list-item" value="Menu">

          <template v-slot:activator="{ props }">

            <v-list-item v-bind="props" title="Colaborador">
              <template v-slot:prepend>
                <v-icon>mdi-cog-outline</v-icon>
              </template>
            </v-list-item>

          </template>

          <v-list-item class="list-item" v-for="[icon, text, href] in colaborador" :key="icon" :to="href" :nav="true"
            v-show="filterItemMenu(text)">
            <!-- <template v-slot:prepend>
              <v-icon>{{ icon }}</v-icon>
            </template> -->

            <v-list-item-title>{{ text }}</v-list-item-title>
          </v-list-item>
        </v-list-group>

        <v-list-group class="list-item" value="MenuSolicitacao">

          <template v-slot:activator="{ props }">

            <v-list-item v-bind="props" title="Solicitações">
              <template v-slot:prepend>
                <v-icon>mdi-account-plus</v-icon>
              </template>
            </v-list-item>

          </template>

          <v-list-item class="list-item" v-for="[icon, text, href] in solicitacoes" :key="icon" :to="href" :nav="true"
            v-show="filterItemMenu(text)">
            <!-- <template v-slot:prepend>
                <v-icon>{{ icon }}</v-icon>
              </template> -->

            <v-list-item-title>{{ text }}</v-list-item-title>
          </v-list-item>
        </v-list-group>
        <v-list-item v-for="[icon, text, href] in refeicao" :key="icon" :to="href" v-show="filterItemMenu(text)"
          class="list-item">
          <template v-slot:prepend>
            <v-icon>{{ icon }}</v-icon>
          </template>

          <v-list-item-title>{{ text }}</v-list-item-title>
        </v-list-item>

        <v-list-group class="list-item" value="MenuGeral">

          <template v-slot:activator="{ props }">

            <v-list-item v-bind="props" title="Geral">
              <template v-slot:prepend>
                <v-icon>mdi-bank</v-icon>
              </template>
            </v-list-item>

          </template>

          <v-list-item class="list-item" v-for="[icon, text, href] in geral" :key="icon" :to="href" :nav="true"
            v-show="filterItemMenu(text)">
            <!-- <template v-slot:prepend>
              <v-icon>{{ icon }}</v-icon>
            </template> -->

            <v-list-item-title>{{ text }}</v-list-item-title>
          </v-list-item>
        </v-list-group>
      </v-list>
      <v-switch class="align-end" inset color="info" v-model="darkMode" @change="toggleTheme()"
        :label="`Tema ${darkMode ? 'Escuro' : 'Claro'}!`">
      </v-switch>
    </v-navigation-drawer>
    <app-bar @update="toggleRail" />
  </div>
</template>

<script>
import AppBar from './AppBar.vue';
import AvatarUsuario from '../modules/avatarUsuario/view/AvatarUsuario.vue';
import { ref } from "vue";
import { useTheme } from "vuetify";

export default {
  components: {
    AppBar,
    AvatarUsuario
  },
  data: () => ({
    theme: useTheme(),
    darkMode: ref(false),
    nomeAvatar: false,
    drawer: true,
    username: '',
    textoFiltro: '',
    rail: true,
    main: [
      ['mdi-home-outline', 'Inicio', '/postUsuario'],
    ],
    colaborador: [
      ['', 'Holerite', '/postUsuario'],
      ['', 'Férias', '/postUsuario'],
      ['', 'Patrimônios', '/postUsuario'],
      ['', 'OTRS', '/postUsuario'],
      ['', 'Qualificações', '/postUsuario'],
    ],
    solicitacoes: [
      ['', 'Viagem', '/postUsuario'],
      ['', 'Reserva Veículo', '/postUsuario'],
      ['', 'Reserva Sala', '/postUsuario'],
    ],
    refeicao: [
      ['mdi-food-fork-drink', 'Refeicão', '/postUsuario'],
    ],
    geral: [
      ['', 'Ramais', '/postUsuario'],
      ['', 'Padrões Cotriguaçu', '/postUsuario'],
      ['', 'Normas', '/postUsuario'],
      ['', 'Relatório Anual', '/postUsuario'],
    ],
    isMobile: false,
  }),
  mounted() {
    this.isMobile = window.innerWidth <= 600;
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
        this.drawer = !this.drawer;
      } else {
        this.rail = !this.rail;
      }
    },
    toggleTheme() {
      this.theme.global.name = this.darkMode ? "dark" : "light";

    }
  },
};
</script>

<style scoped>
.list-item,
.list-item div {
  font-size: 14px !important;
}

.v-list-item__spacer {
  width: 16px !important;
}

.v-list-group__items .v-list-item {
  padding-inline-start: calc(-2px + var(--indent-padding)) !important;
}
</style>