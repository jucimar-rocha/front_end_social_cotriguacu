<template>
  <v-switch
    class="align-end"
    inset
    color="info"
    v-model="darkMode"
    @change="toggleTheme"
  >
    <template v-slot:label>
      <v-icon :color="darkMode ? 'yellow darken-3' : 'yellow darken-2'">
        {{ darkMode ? 'mdi-weather-night' : 'mdi-weather-sunny' }}
      </v-icon>
    </template>
  </v-switch>
</template>

<script>
export default {
  data() {
    return {
      darkMode: false,
    };
  },

  mounted() {
    this.darkMode = this.getTheme() === 'dark-theme' || this.getMediaPreference() === 'dark-theme';
  },

  methods: {
    toggleTheme() {
      this.darkMode = !this.darkMode;
      const theme = this.darkMode ? 'dark-theme' : 'light-theme';
      this.setTheme(theme);
    },

    getTheme() {
      return localStorage.getItem('user-theme');
    },

    setTheme(theme) {
      localStorage.setItem('user-theme', theme);
      document.documentElement.className = theme;
    },

    getMediaPreference() {
      const isDarkPreference = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return isDarkPreference ? 'dark-theme' : 'light-theme';
    },
  },
};
</script>
