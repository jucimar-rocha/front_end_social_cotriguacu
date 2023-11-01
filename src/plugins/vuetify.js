import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from "vuetify";

const customDarkTheme = {
  dark: true,
  themes: {
    dark: {
      background: "#E3F2FD",
      surface: "#15202b",
      primary: "#3f51b5",
      secondary: "#03dac6",
      error: "#f44336",
      info: "#2196F3",
      success: "#4caf50",
      warning: "#fb8c00",
    
    },
  }
};

const customLightTheme = {
  dark: false,
  themes: {
    light: {
      primary: '#68913F',
      'primary-darken-1': '#48711F',
      secondary: '#355262',
      'secondary-darken-1': '#153242',
      dark: '#2A2A2A',
      white: '#FFFFFF',
      gray: '#b1b1b1',
      light: '#EFEFEF',
      medium: '#CCCDD2',
      soft: '#DDDEE3',
      success: '#53C76A',
      danger: '#E24343',
      warning: '#f8b92b',
      info: '#4985A5',
      blue: '#355262',
      background: '#FFFFFF',
      surface: '#FFFFFF',
      //transparent: 'transparent',
      'edit-button': '#f8b92b',     
    },
  },
};

const defaults = {
  VInput: { variant: 'outlined', density: "compact" },
  VAutocomplete: { variant: 'outlined', density: "compact"},
  VCombobox:  { variant: 'outlined', density: "compact"},
  VTextField: { 
    variant: 'outlined', 
    density: "compact"
  },
  VSelect: { variant: 'outlined', density: "compact" },
  VForm: { VCol: { class: 'px-2 py-1'}}
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
