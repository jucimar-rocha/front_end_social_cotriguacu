import { defineStore } from 'pinia';

export const useAvatarStore = defineStore('avatarUsuario', {
    state: () => {
        return {
            avatarUrl: null
          };
    },
    actions: {
        setAvatarUrl(url) {
            this.avatarUrl = url;
        },
        getAvatarUrl() {
            return this.avatarUrl;
        },
    }
});