import { createApp } from 'vue'
import { createPinia } from 'pinia'
import VueMask from '@devindex/vue-mask';
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { registerPlugins } from '@/plugins'

import App from './App.vue'
import router from './router'

const pinia = createPinia();
const app = createApp(App)

import './assets/global.css';
import Vue3Datatable from '@bhplugin/vue3-datatable'
import '@bhplugin/vue3-datatable/dist/style.css'

app.component('QuillEditor', QuillEditor)
app.use(pinia)

app.use(router)
registerPlugins(app)

app.use(VueMask);
app.component('v-datatable', Vue3Datatable);

app.mount('#app')
