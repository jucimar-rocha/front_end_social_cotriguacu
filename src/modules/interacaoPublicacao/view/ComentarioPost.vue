<template>
  <v-card elevation="0">
    <v-card-actions class="ml-n2">
      <div class="love-hover">
        <v-badge content="2" color="grey-lighten-2">
          <v-icon @click="toggleLove" color="red lighten-2">mdi-heart</v-icon>
        </v-badge>
      </div>
      <div class="like-hover ml-2">
        <v-badge content="2" color="grey-lighten-2">
          <v-icon @click="toggleLike" color="blue ">mdi-thumb-up</v-icon>
        </v-badge>
      </div>
      <div class=" coment-hover ml-2" @click="toggleComments">
        <v-badge :content="totalComentarios" color="grey-lighten-2">
          <v-icon color="teal-accent-4">mdi-comment</v-icon>
        </v-badge>
      </div>
    </v-card-actions>

    <transition name="fade">
      <v-card-text v-if="showComments" style="padding:0;">
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
          <v-btn @click="excluir(comment.id)">Excluir</v-btn>
        </div>
        <SnackValidatorCalisto v-model="alertaValidacao" titulo="Comentario" :mensagem="mensagem" :type="type" />
      </v-card-text>
    </transition>

  </v-card>
</template>
  
<script>
import { useInteracaoPublicacaoStore } from '../store'
import { ref, onMounted, computed } from 'vue'
import SnackValidatorCalisto from '@/components/SnackValidatorCalisto.vue'

export default {
  components: {
    SnackValidatorCalisto
  },
  props: {
    postId: Number,

  },
  methods: {

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
    const type = ref(''); // Variáveis reativas
    const mensagem = ref('');
    const alertaValidacao = ref(false);

    const loadComments = async () => {
      if (!store.interacao[props.postId]) {
        await store.buscarInteracoes(props.postId);
      }
    };
    const totalComentarios = () => {

    };
    const toggleComments = () => {
      showComments.value = !showComments.value;

      if (showComments.value) {
        loadComments();
      } else {
        store.limparDados(props.postId);
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

    onMounted(() => {
      totalComentarios();
    });

    return {
      showComments,
      interacoesMapeadas,
      toggleComments,
      excluir,
      type,
      mensagem,
      alertaValidacao,

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
</style>
  