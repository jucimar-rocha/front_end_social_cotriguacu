import { createApp } from 'vue'
import { createPinia } from 'pinia'
import VueMask from '@devindex/vue-mask';

import { registerPlugins } from '@/plugins'

import App from './App.vue'
import router from './router'

const pinia = createPinia();
const app = createApp(App)

import './assets/global.css';

app.use(pinia)

app.use(router)
registerPlugins(app)

app.use(VueMask);

app.mount('#app')
