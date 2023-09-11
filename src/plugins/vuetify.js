/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'

const jupterCustomStyle = {
  dark: true,
  colors: { 
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
}

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  ssr: true,
  defaults: {
    VInput: { variant: 'outlined', density: "compact" },
    VAutocomplete: { variant: 'outlined', density: "compact"},
    VCombobox:  { variant: 'outlined', density: "compact"},
    VTextField: { 
      variant: 'outlined', 
      density: "compact"
    },
    VSelect: { variant: 'outlined', density: "compact" },
    VForm: { VCol: { class: 'px-2 py-1'}}
  },
  theme: {
    defaultTheme: 'jupterCustomStyle',
    themes: {
      jupterCustomStyle,
    },
  },
})