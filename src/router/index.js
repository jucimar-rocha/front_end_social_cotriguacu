import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../modules/login/store';
import LoginRouter from '@/modules/login/routes'
import CadastroUsuarioRouter from '@/modules/cadastroUsuario/routes';
import RedefinirSenhaRouter from '@/modules/redefinirSenha/routes';
import PostUsuarioRouter from '@/modules/postUsuario/routes';

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  linkActiveClass: 'active',
  routes:[
    ...LoginRouter,
    ...CadastroUsuarioRouter,
    ...RedefinirSenhaRouter,
    ...PostUsuarioRouter

  ]
});

router.beforeEach(async (to, from, next) => {
  const store = useAuthStore();

  // Verificar se a rota é a de cadastro de usuário
  if (to.name === 'CadastroUsuario') {
    // Permitir o acesso sem autenticação
    next();
  } else if (to.name === 'RedefinirSenha') {
    // Verificar se o usuário está autenticado ou não
    if (!store.isAuthenticate()) {
      // Permitir o acesso à rota 'RedefinirSenha' se o usuário estiver autenticado
      next();
    } else {
      // Redirecionar para a rota de login se não estiver autenticado
      next({ name: 'Login' });
    }
  } else if (to.name !== 'Login' && !store.isAuthenticate()) {
    // Redirecionar para a rota de login se não estiver autenticado
    next({ name: 'Login' });
  } else {
    // Continuar para a próxima rota se autenticado
    next();
  }
});


export default router
