<template>
  <post-form @PostFormPostagemUsuario="atualizarPagina" />
  <div class="post-list">
    <v-card v-for="postagem in postagensMapeadas" :key="postagem.id" class="post-card ma-5 elevation-2"
      color="light-grey">
      <div class="mb-2">
        <v-avatar>
          <img :src="postagem.avatarUsuario" alt="User Avatar" />
        </v-avatar>
        <span class="ml-3" :title="postagem.usuario">{{ postagem.usuario }}</span>
      </div>
      <v-card-media class="post-media">
        <template v-if="postagem.urlVideo">
          <video class="d-flex post-video" controls :src="postagem.urlVideo" muted loop alt="Post">
            Seu navegador não suporta a reprodução de vídeos.
          </video>
        </template>
        <template v-else-if="postagem.urlImagem">
          <img :src="postagem.urlImagem" alt="Post" />
        </template>
      </v-card-media>
      <v-card-text class="ma-2" style="font-family: 'Arial', sans-serif; font-size: 16px;">
        {{ postagem.mensagem }}
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import PostForm from '@/components/PostForm.vue';
import { usePostUsuario } from '../store';
import { computed, onMounted } from 'vue';

export default {
  components: {
    PostForm,
  },

  setup() {
    const store = usePostUsuario();
    const params = {
      numeroPagina: 1,
      tamanhoPagina: 10,
      campoOrdem: {
        campo: "Id",
        ordem: "Desc"
      },
      camposFiltro: [
        {
          campo: "",
          query: "",
          type: ""
        }
      ]
    };
    const buscarListaPublicacao = async () => {
      await store.buscarListaPublicacao(params);
    };
    const atualizarPagina = () => {
      buscarListaPublicacao();
    };
    onMounted(() => {
      store.buscarListaPublicacao(params);
    });

    const postagensMapeadas = computed(() =>
      store.postagemUsuario.map(item => ({
        id: item.id,
        usuario: item.usuario,
        avatarUsuario: item.avatarUsuario,
        nomeusuarioPost: item.nomeusuarioPost,
        mensagem: item.mensagem,
        urlImagem: item.urlImagem || null,
        urlVideo: item.urlVideo || null,
        dataCriacao: item.dataCriacao
      }))
    );

    return {
      postagensMapeadas,
      atualizarPagina
    };
  },
  methods: {

  },
};
</script>

<style scoped>
.post-video {
  width: 100%;
}

.post-card {
  max-width: 60%;
  max-height: auto;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
}

.user-name {
  margin-left: 10px;
  font-family: system-ui, -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  font-size: 15px;
}

.user-name:hover {
  color: #4d4c4c;
}

.post-media {
  position: relative;
  padding-top: 56.25%;

}

img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

@media (max-width: 600px) {
  .post-card {
    max-width: 100%;
  }
}
</style>