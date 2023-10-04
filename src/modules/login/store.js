import { defineStore } from 'pinia'
import { router } from '../../router/index'


export const useAuthStore = defineStore('autenticacao', {
  state: () => {
    return {
      user: localStorage.getItem('user'),
      token: localStorage.getItem('token'),
    };
  },
  getters: {
    getUser: localStorage.getItem('user'),
    getToken: (state) => state.token,
  },
  actions: {
    async autenticarUsuario(usuario, idUsuario, token) {
      this.token = token;
      this.user = usuario;
      this.idUsuario = idUsuario;

      localStorage.setItem('idUsuario', idUsuario);
      localStorage.setItem('user', usuario);
      localStorage.setItem('token', token);

    },
    logout() {
      this.token = '';
      localStorage.removeItem('idUsuario');
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      this.resetState();
      router.push('login');
    },

    isAuthenticate() {
      return this.token != '' && this.token != null;
    },

    resetState() {
      this.token = '';
      this.user = '';
      this.idUsuario = '';
    },

  },
})