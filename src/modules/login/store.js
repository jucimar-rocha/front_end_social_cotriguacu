import { defineStore } from 'pinia'
import { router } from '../../router/index'


export const useAuthStore = defineStore('autenticacao', {
  state: () => {
    return {
      user: sessionStorage.getItem('user'),
      token: sessionStorage.getItem('token'),
      currentUser: null,
      avatarUrl: sessionStorage.getItem('avatarUrl'),
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
      this.currentUser = {
        id: this.getUserIdFromToken(),
        username: usuario,
      };
      const avatarUrl = this.getAvatarFromToken();
      this.avatarUrl = avatarUrl;

      sessionStorage.setItem('user', usuario);
      sessionStorage.setItem('token', token);
      sessionStorage.setItem('avatarUrl', avatarUrl);

    },
    logout() {
      this.token = '';
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('token');
      this.resetState();
      router.push('login');
    },
    isAuthenticate() {
      return this.token != '' && this.token != null;
    },
    getUserIdFromToken() {
      const token = this.token;
      if (token) {
        try {
          const decodedToken = JSON.parse(atob(token.split('.')[1]));
          if (decodedToken && decodedToken.nameid) {
            return decodedToken.nameid;
          }
        } catch (error) {
          console.error('Erro ao decodificar o token:', error);
        }
      }

      return null;
    },
    getAvatarFromToken() {
      const token = this.token;
      if (token) {
        try {
          const decodedToken = JSON.parse(atob(token.split('.')[1]));
          if (decodedToken && decodedToken.avatar) {
            return decodedToken.avatar;
          }
        } catch (error) {
          console.error('Erro ao decodificar o token:', error);
        }
      }

      return null;
    },

    resetState() {
      this.token = '';
      this.user = '';
      this.currentUser = null;
      this.avatarUrl = null;
    },

    updateAvatarUrl(newUrl) {
      this.avatarUrl = newUrl;
      sessionStorage.setItem('avatarUrl', newUrl);
    },

  },
})