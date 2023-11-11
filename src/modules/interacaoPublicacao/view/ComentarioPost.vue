<template>
  <v-card elevation="0">
    <v-card-actions class="ml-n2 mt-n1">
      <div class="love-hover"  @mouseover="retornaListaUsuarioInteracao(2)" @mouseout="limpaListaUsuarioInteracao()" @click="adicionaInteracao(2)">
        <v-badge :content="totalLoves" color="grey-lighten-2">
          <v-icon @click="toggleLove"
            :color="usuarioAmou ? 'red lighten-2' : 'grey'">mdi-heart</v-icon>
        </v-badge>        
      </div>
      <div class="like-hover ml-2" @mouseover="retornaListaUsuarioInteracao(1)" @mouseout="limpaListaUsuarioInteracao()" @click="adicionaInteracao(1)">
        <v-badge :content="totalLikes" color="grey-lighten-2">
          <v-icon @click="toggleLike"
            :color="usuarioCurtiu ? 'blue-accent-2' : 'grey'">mdi-thumb-up</v-icon>
        </v-badge>
      </div>
      <div class=" coment-hover ml-2">
        <v-badge :content="totalComentarios" color="grey-lighten-2">
          <v-icon>mdi-comment</v-icon>
        </v-badge>
      </div>
    </v-card-actions>
    <v-card v-show="showPopup && usersToShow.length > 0" class="floating-card">        
        <v-card-text>
            <v-row v-for="user in usersToShow" :key="user.usuario" cols="6">
              <v-row class="pa-3">{{ user.usuario }}</v-row>
            </v-row>
        </v-card-text>
      </v-card>
      <v-divider></v-divider>
        <v-card-actions style="justify-content: space-around; align-items: center; margin: -10px;">       
          <v-btn icon @click="toggleMenuInteracao" >
            <v-icon color="grey pr-2">mdi-thumb-up-outline</v-icon>
            Curtir
          </v-btn>          
          <v-btn icon @click="toggleComments">
            <v-icon color="grey pr-2">mdi-comment-outline</v-icon>
            Comentar
          </v-btn>
        </v-card-actions>
    
    <v-divider class="mb-3"></v-divider>
    <transition name="slide-fade">
      <v-card-text v-if="showComments" style="padding:0;">        
        <div v-for="comment in interacoesMapeadas" :key="comment.id" class="comment">
          <div class="d-flex ma-1 align-center">
            <v-avatar>
              <img style="width: 100%;" :src='comment.pathUsuario' alt="User Avatar" />
            </v-avatar>
            <div>
              <span class="ml-3" :title="comment.usuario">{{ comment.usuario }}</span>
            </div>
            <div class="d-flex align-center ml-auto mt-n6">
              <div>
                <span style="font-size: 10px;" :title="comment.dataCriacao">{{ comment.dataCriacao }}</span>
              </div>
              <div style=" background-color: white;">
              <v-btn v-if="comment.usuario === usuarioLogado" elevation="0" size="20" class="ma-0 pa-0 pl-4">
                <ConfirmationDialog v-if="!apenasVisualizar" :titulo="'Excluir'"
                :mensagem="'Deseja realmente excluir o comentario?'" @confirmar="excluir(comment.id)" />
                <v-icon left>mdi-delete-empty</v-icon>
                <v-tooltip activator="parent" location="top">Excluir</v-tooltip>
              </v-btn>
              </div>
            </div>
          </div>
          <div class="ml-11 mt-n6 pa-3">
            <span class="comment-text" :title="comment.comentario">{{ comment.comentario }}</span>
          </div>          
        </div>
        <transition :duration="1000" name="slide-fade">
          <div class="publicar-comentario transition-element"
            v-show="true">
            <div class="ml-n4">
              <avatar-usuario :openModal="false" />
            </div>
            <QuillEditor placeholder="Adicione seu comentario!" theme="snow" v-model:content="postComentario"
              content-type="text" />
            <div>
              <button class="publish-button" @click="criarNovoComentario">
                Adiconar Comentario
              </button>
            </div>
          </div>
        </transition>
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
    const usuarioLogado = sessionStorage.getItem('user');
    const showComments = ref(false);
    const interacoesMapeadas = computed(() => {
      return store.interacao[props.postId] || [];
    });
    const type = ref('');
    const mensagem = ref('');
    const alertaValidacao = ref(false);
    const showPopup = ref(false);
    const postComentario = ref('');
    const totalLoves = ref('');
    const totalLikes = ref('');
    const totalComentarios = ref('');
    const usuarioCurtiu = ref(false);
    const usuarioAmou = ref(false);
    const visualizarComentario = ref(false);
    const usersToShow = ref([]);
    const menu = ref(false);

    const loadComments = async () => {
      await store.buscarInteracoes(props.postId);

    };
    const toggleComments = () => {
      showComments.value = !showComments.value;

      if (interacoesMapeadas.value.lenght) {
        visualizarComentario.value = true;
      }

      if (showComments.value) {
        loadComments();
      } else {
        store.limparDados(props.postId);
        visualizarComentario.value = false;
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

    const retornaListaUsuarioInteracao = async (id) => {

      const response = await store.bucarUsuarioInteracao(props.postId, id);

      if (response) {
        usersToShow.value = response
        showPopup.value = true;
      }
    };

    const limpaListaUsuarioInteracao = () =>{
      showPopup.value = false;
    }

    const defineInteracao = (id, usuarioCurtiuPost, totalCurtidas) => {
      if (usuarioCurtiuPost === true) {
        usuarioCurtiuPost = false;
        totalCurtidas = totalCurtidas === 0 ? 0 : totalCurtidas - 1;
      } else {
        usuarioCurtiuPost = true;
        if (totalCurtidas === 0) {
          totalCurtidas = totalCurtidas + 1;
        } else {
          totalCurtidas = totalCurtidas + 1;
        }
      }
      return atualizaEstadoVariaveisInteracao(id, usuarioCurtiuPost, totalCurtidas);
    }

    const atualizaEstadoVariaveisInteracao = (id, usuarioCurtiuPost, totalCurtidas) => {
      if (id === 1) {
        usuarioCurtiu.value = usuarioCurtiuPost;
        totalLikes.value = totalCurtidas;
      } else {
        usuarioAmou.value = usuarioCurtiuPost;
        totalLoves.value = totalCurtidas;
      }
    }

    const adicionaInteracao = async (id) => {
      id === 1 ? defineInteracao(id, usuarioCurtiu.value, totalLikes.value) : defineInteracao(id, usuarioAmou.value, totalLoves.value);

      const idUsuarioStr = sessionStorage.getItem("idUsuario");
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
    };
    const showAdicionarComentario = () => {
      if (totalComentarios.value === 0) {
        showComments.value = true;
        visualizarComentario.value = !visualizarComentario.value;
      }
      if (totalComentarios.value > 0 && showComments.value === true) {
        visualizarComentario.value = !visualizarComentario.value;
      }

    };
    const toggleMenuInteracao = () => {
     menu.value = !menu.value;
    };

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
      usuarioAmou,
      visualizarComentario,
      showAdicionarComentario,
      usuarioLogado,
      showPopup,
      usersToShow,
      retornaListaUsuarioInteracao,
      limpaListaUsuarioInteracao,
      menu,
      toggleMenuInteracao
    };
  },
}
</script>
  
<style scoped>
.floating-card {
  padding: 5px;
  padding-left: 15px;
  top: 20px;
  left: 25%;
  width: 50%;
  transform: translate(-50%, -50%);
  z-index: 999; /* Certifique-se de que este valor seja maior do que outros elementos se necessário */
  background-color: white; /* Ajuste conforme necessário */
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
  border-radius: 8px; /* Ajuste conforme necessário */
}
.slide-fade-enter-active {
  transition: all .3s ease;
}

.slide-fade-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}

.slide-fade-enter,
.slide-fade-leave-to

/* .slide-fade-leave-active below version 2.1.8 */
  {
  transform: translateX(10px);
  opacity: 0;
}

.comment {
  margin-bottom: 10px;
  padding: 5px;
  border: 1px solid #ddd;
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
  background-color: rgb(250, 121, 121);
  border-radius: 5px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
  z-index: 2;
}

.comment-card {
  margin: 1px;
  max-width: 100%;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
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
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 10px;
  transition: all 5.5s;
}</style>
  