import { defineStore } from 'pinia'
import { router } from '../../router/index'

export const useAuthStore = defineStore('autenticacao', {
  state: () => {
      return { 
        user: sessionStorage.getItem('user'), 
        token: sessionStorage.getItem('token'), 
      };
    },
    getters: {
      getUser: sessionStorage.getItem('user'),
      getToken: (state) => state.token,
    },
    actions: {
      async autenticarUsuario(usuario, token) {
        this.token = token;
        this.user = usuario;
        
        sessionStorage.setItem('user', usuario);
        sessionStorage.setItem('token', token);
      },
      logout() {
        this.token = '';
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('token');
        router.push('login');
      },
      isAuthenticate() {
        return this.token != '' && this.token != null;
      }
    },
  })