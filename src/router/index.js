import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../modules/login/store';
import LoginRouter from '@/modules/login/routes'
import CadastroUsuarioRouter from '@/modules/cadastroUsuario/routes';
import RedefinirSenhaRouter from '@/modules/redefinirSenha/routes';
import PostUsuarioRouter from '@/modules/postUsuario/routes';
import LinkRedefinicaoSenhaRouter from '@/modules/linkRedefinicaoSenha/routes';

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  linkActiveClass: 'active',
  routes:[
    ...LoginRouter,
    ...CadastroUsuarioRouter,
    ...RedefinirSenhaRouter,
    ...PostUsuarioRouter,
    ...LinkRedefinicaoSenhaRouter

  ]
});

router.beforeEach(async (to, from, next) => {
  const store = useAuthStore();
  
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth && !store.isAuthenticate()) {
    next({ name: 'Login' });
  } else if (!requiresAuth && store.isAuthenticate()) {
    next({ name: 'PostUsuario' });
  } else {
    next();
  }
});

export default router
