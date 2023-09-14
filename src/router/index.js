import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../modules/login/store';
import LoginRouter from '@/modules/login/routes'
import CadastroUsuarioRouter from '@/modules/cadastroUsuario/routes';

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  linkActiveClass: 'active',
  routes:[
    ...LoginRouter,
    ...CadastroUsuarioRouter

  ]
});

router.beforeEach(async (to, from, next) => {
  var store = useAuthStore();

  // Verificar se a rota é a de cadastro de usuário
  if (to.name === 'CadastroUsuario') {
    // Permitir o acesso sem autenticação
    next();
  } else if (to.name !== 'Login' && !store.isAuthenticate()) {
    // Redirecionar para a rota de login se não estiver autenticado
    next({ name: 'Login' });
  } else {
    // Continuar para a próxima rota se autenticado
    next();
  }
});


export default router
