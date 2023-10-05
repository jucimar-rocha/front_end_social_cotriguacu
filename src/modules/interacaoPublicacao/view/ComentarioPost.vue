<template>
  <v-card elevation="0">
    <v-card-actions class="ml-n2">
      <div class="love-hover" @click="adicionaInteracao(2)">
        <v-badge :content="totalLoves" color="grey-lighten-2">
          <v-icon @click="toggleLove" :color="usuarioAmou ? 'red lighten-2' : 'grey'">mdi-heart</v-icon>
        </v-badge>
      </div>
      <div class="like-hover ml-2" @click="adicionaInteracao(1)">
        <v-badge :content="totalLikes" color="grey-lighten-2">
          <v-icon @click="toggleLike" :color="usuarioCurtiu ? 'blue-accent-2' : 'grey'">mdi-thumb-up</v-icon>
        </v-badge>
      </div>
      <div class=" coment-hover ml-2" @click="toggleComments">
        <v-badge :content="totalComentarios" color="grey-lighten-2">
          <v-icon>mdi-comment</v-icon>
        </v-badge>
      </div>
    </v-card-actions>

    <transition name="fade">
      <v-card-text v-if="showComments" style="padding:0;">
        <div class="publicar-comentario">
          <div class="ml-n4">
            <avatar-usuario :openModal="false" />
          </div>
          <QuillEditor placeholder="Adicione seu comentario!" theme="snow" v-model:content="postComentario"
            content-type="text" />
          <div>
            <button class="publish-button" @click="criarNovoComentario">
              Adiconar Comentar
            </button>
          </div>
        </div>

        <div v-for="comment in interacoesMapeadas" :key="comment.id" class="comment">
          <div class="d-flex ma-1 align-center">
            <v-avatar>
              <img style="width: 100%;" :src='comment.pathUsuario' alt="User Avatar" />
            </v-avatar>
            <div>
              <span class="ml-3" :title="comment.usuario">{{ comment.usuario }}</span>
            </div>
            <div class="ml-auto mt-n8">
              <span style="font-size: 10px;" :title="comment.dataCriacao">{{ comment.dataCriacao }}</span>
            </div>
          </div>
          <div class="ml-11 mt-n6 pa-3">
            <span class="comment-text" :title="comment.comentario">{{ comment.comentario }}</span>
          </div>
          <v-btn>Excluir
            <ConfirmationDialog v-if="!apenasVisualizar" :titulo="'Excluir'"
              :mensagem="'Deseja realmente excluir o comentario?'" @confirmar="excluir(comment.id)" />
          </v-btn>
        </div>
        <SnackValidatorCalisto v-model="alertaValidacao" titulo="Comentario" :mensagem="mensagem" :type="type" />
      </v-card-text>
    </transition>

  </v-card>
</template>
  
<script>
import AvatarUsuario from '@/modules/avatarUsuario/view/AvatarUsuario.vue';
import { useInteracaoPublicacaoStore } from '../store'
import { ref, onMounted, computed } from 'vue'
import SnackValidatorCalisto from '@/components/SnackValidatorCalisto.vue'
import ConfirmationDialog from '@/components/ConfirmationDialog.vue'


export default {
  components: {
    SnackValidatorCalisto,
    AvatarUsuario,
    ConfirmationDialog,
  },
  props: {
    postId: Number,

  },
  data() {
    return {
      dialog: false,
    }
  },
  setup(props) {
    const store = useInteracaoPublicacaoStore();
    const showComments = ref(false);
    const interacoesMapeadas = computed(() => {
      return store.interacao[props.postId] || [];
    });
    const type = ref('');
    const mensagem = ref('');
    const alertaValidacao = ref(false);
    const postComentario = ref('');
    const totalLoves = ref('');
    const totalLikes = ref('');
    const totalComentarios = ref('');
    const usuarioCurtiu = ref(false);
    const usuarioAmou = ref(false);


    const loadComments = async () => {
      await store.buscarInteracoes(props.postId);

    };
    const toggleComments = () => {
      showComments.value = !showComments.value;

      if (showComments.value) {
        loadComments();
      } else {
        store.limparDados(props.postId);
      }
    };
    const totalInteracoes = async () => {
      const response = await store.buscaTotalInteracoes(props.postId);
      if (response.data) {
        totalLoves.value = response.data.totalLove;
        totalLikes.value = response.data.totalLike;
        totalComentarios.value = response.data.totalComentario;
        usuarioCurtiu.value = response.data.usuarioLogadoLike;
        usuarioAmou.value = response.data.usuarioLogadoLove;
      }
    };
    const adicionaInteracao = async (id) => {

      if (id === 1) {
        if (usuarioCurtiu.value === true) {
          usuarioCurtiu.value = false;
          totalLikes.value = totalLikes.value === 0 ? 0 : totalLikes.value - 1;
        }
        else {
          usuarioCurtiu.value = true;
          if (totalLikes.value === 0) {
            totalLikes.value = totalLikes.value + 1;
          }
          else {
            totalLikes.value = totalLikes.value + 1
          }
        }
      }

      if (id === 2) {
        if (usuarioAmou.value === true) {
          usuarioAmou.value = false;
          totalLoves.value = totalLoves.value === 0 ? 0 : totalLoves.value - 1;
        }
        else {
          usuarioAmou.value = true;
          if (totalLoves.value === 0) {
            totalLoves.value = totalLoves.value + 1;
          }
          else {
            totalLoves.value = totalLoves.value + 1
          }

        }
      }

      const idUsuarioStr = localStorage.getItem("idUsuario");
      const idUsuario = parseInt(idUsuarioStr);

      const parametros = {
        idPublicacao: props.postId,
        idUsuario: idUsuario,
        idInteracao: id
      }

      const response = await store.adicionaInteracao(parametros);
      console.log(response);

    };
    const criarNovoComentario = async () => {
      try {
        const comentario = postComentario.value;
        const idPost = props.postId;

        if (!comentario) {
          return;
        }
        const parametros = {
          IdPublicacoes: idPost,
          comentario: comentario
        }
        const response = await store.criarComentario(parametros);
        if (response) {
          const quillEditor = document.querySelector('.ql-editor');
          if (quillEditor) {
            quillEditor.innerHTML = '';
          }
          totalComentarios.value = totalComentarios.value + 1;
          postComentario.value = '';
          type.value = "success";
          mensagem.value = "Comentário adicionado com sucesso!.";
          alertaValidacao.value = true;
          loadComments();
        }
        console.log('Novo comentário criado com sucesso!', response);
      } catch (error) {
        type.value = "error";
        mensagem.value = error.response.data.mensagem;
        alertaValidacao.value = true;
      }
    };
    const excluir = (commentId) => {
      store.excluir(commentId,
        (response) => {
          const index = store.interacao[props.postId].findIndex(comment => comment.id === commentId);
          if (index !== -1) {
            store.interacao[props.postId].splice(index, 1);
          }
          if (response) {
            totalComentarios.value = totalComentarios.value - 1;
            type.value = "success";
            mensagem.value = "Comentário excluído com sucesso!.";
            alertaValidacao.value = true;
            loadComments();
          }
        },
        (error) => {
          type.value = "error";
          mensagem.value = error.response.data.mensagem;
          alertaValidacao.value = true;
        }
      );

    }

    onMounted(async () => {
      await totalInteracoes();
    });

    return {
      showComments,
      interacoesMapeadas,
      toggleComments,
      excluir,
      type,
      mensagem,
      alertaValidacao,
      criarNovoComentario,
      postComentario,
      totalInteracoes,
      totalLoves,
      totalLikes,
      totalComentarios,
      adicionaInteracao,
      usuarioCurtiu,
      usuarioAmou
    };
  },
}
</script>
  
<style>
.comment {
  margin-bottom: 10px;
  padding: 5px;
  border: 1px solid #ddd;
  background-color: #f9f9f9;
  border-radius: 10px;
}

.coment-hover:hover {
  background-color: aqua;
  border-radius: 5px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
  z-index: 2;
}

.like-hover:hover {
  background-color: rgb(93, 148, 230);
  border-radius: 5px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
  z-index: 2;
}

.love-hover:hover {
  background-color: rgb(129, 61, 61);
  border-radius: 5px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
  z-index: 2;
}

.comment-card {
  margin: 1px;
  max-width: 100%;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.publish-button {
  background-color: #1877f2;
  border: none;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 16px;
  color: white;
  cursor: pointer;
  margin-top: 5px;
}

.publish-button:hover {
  background-color: #1465c0;
}

.publicar-comentario {
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 10px;
}
</style>
  