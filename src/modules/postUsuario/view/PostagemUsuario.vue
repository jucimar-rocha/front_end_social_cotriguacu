<template>
  <post-form @PostFormPostagemUsuario="atualizarPagina(page)" />
  <div>
    <v-card v-for="postagem in postagensMapeadas"  :key="postagem.id" class="post-card ma-5"
      >
      <div class="d-flex ma-1 align-center">
        <v-avatar>
          <img :src="postagem.avatarUsuario" alt="User Avatar" />
        </v-avatar>
        <span class="ml-3" :title="postagem.usuario">{{ postagem.usuario }}</span>
        <div class="ml-auto mt-n8">
          <span style="font-size: 10px;" :title="postagem.dataCriacao">{{ postagem.dataCriacao }}</span>
        </div>
        <div class="mt-n8" :class="{ 'mr-n8': postagem.usuario === usuarioLogado }">
          <v-btn variant="text" v-if="postagem.usuario === usuarioLogado">
            <ConfirmationDialog v-if="!apenasVisualizar" :titulo="'Excluir'"
              :mensagem="'Deseja realmente excluir esta publicação?'" @confirmar="excluirPublicacao(postagem.id, page)" />
            <v-icon left>mdi-delete-empty</v-icon>
            <v-tooltip activator="parent" location="top">Excluir</v-tooltip>
          </v-btn>
        </div>
      </div>
      <v-card-text class="ma-2" style="font-family: 'Arial', sans-serif; font-size: 16px;">
        {{ postagem.mensagem }}
      </v-card-text>
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
      <comentario-post :postId="postagem.id" />
    </v-card>
    <SnackValidatorCalisto v-model="alertaValidacao" titulo="Publicação" :mensagem="mensagem" :type="type" />
    <div v-if="postagensMapeadas.length > 0" class="d-flex justify-center post-pagination">
      <v-pagination color="rgb(104, 146, 61) !important" v-model="page" :length="totalPages" size="14" rounded="circle"
        prev-icon="mdi-menu-left" next-icon="mdi-menu-right" @click="atualizarPagina(page)"></v-pagination>
    </div>
    <LoadingDialog :dialog="loadingDialog" />
  </div>
</template>

<script>
import PostForm from '@/components/PostForm.vue';
import ComentarioPost from '@/modules/interacaoPublicacao/view/ComentarioPost.vue';
import { usePostUsuario } from '../store';
import { computed, onMounted, ref } from 'vue';
import SnackValidatorCalisto from '@/components/SnackValidatorCalisto.vue'
import ConfirmationDialog from '@/components/ConfirmationDialog.vue'
import LoadingDialog from '@/components/LoadingDialog.vue'

export default {
  components: {
    PostForm,
    ComentarioPost,
    SnackValidatorCalisto,
    ConfirmationDialog,
    LoadingDialog
  },
  setup() {
    const store = usePostUsuario();
    const usuarioLogado = sessionStorage.getItem('user');
    const page = ref(1);
    const postagensPorPagina = 10;
    const type = ref('');
    const mensagem = ref('');
    const alertaValidacao = ref(false);
    const totalPostagens = computed(() => store.total);
    const totalPages = computed(() => Math.ceil(totalPostagens.value / postagensPorPagina));
    const loadingDialog =  ref(false);

    const params = {
      numeroPagina: page.value,
      tamanhoPagina: postagensPorPagina,
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
      params.numeroPagina = page.value;
      await store.buscarListaPublicacao(params);
    };
    const atualizarPagina = (novaPagina) => {
      page.value = novaPagina;
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
    const excluirPublicacao = (id, paginaAtual) => {
      store.excluir(id,
        (response) => {

          if (response) {
            type.value = "success";
            mensagem.value = "Publicação excluída com sucesso!.";
            alertaValidacao.value = true;
            atualizarPagina(paginaAtual);
          }
        },
        (error) => {
          type.value = "error";
          mensagem.value = error.response.data.mensagem;
          alertaValidacao.value = true;
        }
      );
    }

    return {
      page,
      postagensPorPagina,
      postagensMapeadas,
      atualizarPagina,
      excluirPublicacao,
      type,
      mensagem,
      alertaValidacao,
      usuarioLogado,
      totalPages,
      loadingDialog
    };
  },
};
</script>

<style scoped>
.post-video {
  width: 100%;
}

.post-pagination {
  max-width: 60%;
  padding: 16px;
}

.post-card {
  max-width: 60%;
  max-height: auto; 
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.5s;
  cursor: pointer;
}

.post-card:hover{
    transform: scale(1.01);
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

  .post-pagination {
    max-width: 100%;
  }
}
</style>