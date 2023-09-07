import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../modules/login/store';
import LoginRouter from '@/modules/login/routes'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  linkActiveClass: 'active',
  routes:[
    ...LoginRouter,

  ]
});

router.beforeEach(async (to) => {
  var store = useAuthStore();

   if (to.name !== 'Login' && !store.isAuthenticate()) {
     return { name: 'Login' }
   }
})

export default router
