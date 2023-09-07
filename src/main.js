import { createApp } from 'vue'
import { createPinia } from 'pinia'

import { registerPlugins } from '@/plugins'

import App from './App.vue'
import router from './router'

const pinia = createPinia();
const app = createApp(App)

app.use(pinia)

app.use(router)
registerPlugins(app)

app.mount('#app')
