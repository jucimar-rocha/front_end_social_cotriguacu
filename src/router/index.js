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
  
  if (to.name === 'CadastroUsuario') {
    next();
  } else if (to.name === 'LinkRedefinicaoSenha') { // Primeira letra em maiúscula
    next();
  } else if (to.name === 'RedefinirSenha') {
    if (!store.isAuthenticate()) {
      next();
    } else {
      next({ name: 'Login' });
    }
  } else if (to.name !== 'Login' && !store.isAuthenticate()) {
    next({ name: 'Login' });
  } else if(to.name ==='Login' && store.isAuthenticate()){
    next({ name: 'PostUsuario' });
  } else {
    next();
  }
});


export default router
