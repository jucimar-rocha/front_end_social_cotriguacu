import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from "vuetify";

const customDarkTheme = {
  dark: true,
  colors: {
    background: "#15202b",
    surface: "#15202b",
    primary: "#3f51b5",
    secondary: "#03dac6",
    error: "#f44336",
    info: "#2196F3",
    success: "#4caf50",
    warning: "#fb8c00",
  },
};

const customLightTheme = {
  dark: false,
  themes: {
    light: {
      background: "#eee",
      surface: "#15202b",
      primary: "#3f51b5",
      secondary: "#00ccff",
      error: "#ffcc00",
    },
  },
};

const defaults = {
  VInput: { variant: 'outlined', density: "compact" },
  VAutocomplete: { variant: 'outlined', density: "compact" },
  VCombobox: { variant: 'outlined', density: "compact" },
  VTextField: { variant: 'outlined', density: "compact" },
  VSelect: { variant: 'outlined', density: "compact" },
  VForm: { VCol: { class: 'px-2 py-1' } }
};

export default createVuetify({ 
  ssr: true, 
  theme: {
    defaultTheme: "light",
    themes: {
      customDarkTheme,
      customLightTheme,
    },
  },
  defaults: defaults,
});
