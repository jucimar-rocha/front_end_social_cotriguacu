<template>
 <div>
    <v-btn @click="post_action">Abrir Modal</v-btn>
    <v-dialog v-model="mostrarPost" max-width="100%">
      <post-form />
    </v-dialog>
  </div>
    <v-card class="post-card ma-5 elevation-2" color="light-grey">
      <!-- Avatar e Nome do Usuário -->
      <v-card-title>
        <v-avatar class="ma-2 xs12 sm6">
          <v-img src="/src/assets/tuti.jpg">
           
          </v-img>
        </v-avatar>
        <span class="user-name ma-2 xs12 sm6">JUCIMAR.ROCHA</span>
      </v-card-title>
  
      <!-- Foto ou Vídeo -->
      <v-card-media class="post-media">
        <img src="/src/assets/jucimar.jpg" alt="Post">
      </v-card-media>
  
      <!-- Texto ou Link -->
      <v-card-text class="ma-2" style="font-family: 'Arial', sans-serif; font-size: 16px;">
        "A vida é como um livro em branco, pronto para ser preenchido com as nossas histórias,
         sonhos e aventuras. Cada página virada é uma nova oportunidade de aprender,
          crescer e se reinventar. Não deixe que o medo ou a incerteza impeçam você de escrever a sua história.
           Viva cada momento com intensidade, abrace os desafios e celebre as pequenas alegrias.
            O presente é um presente. ✨📖 #Vida #Aventura #Gratidão"
      </v-card-text>
  
      <!-- Ícones -->
      <v-card-actions>
      <v-btn variant="text" icon>
        <v-icon color="red lighten-2">mdi-heart</v-icon>
      </v-btn>
      <span class="subheading me-1">10</span>

      <v-btn variant="text" icon>
        <v-icon color="blue lighten-2">mdi-thumb-up</v-icon>
      </v-btn>
      <span class="subheading me-1">25</span>

      <v-btn
        variant="text"
        icon
        @click="toggleComentarios"
      >
        <v-icon color="green lighten-2">mdi-comment</v-icon>
      </v-btn>
      <span class="subheading me-1">5</span>
      
    </v-card-actions>

    <div v-if="mostrarComentarios">
      <!-- Comentários -->
      <ComentarioPost
        v-for="(comentario, index) in comentarios"
        :key="index"
        :userAvatar="comentario.userAvatar"
        :userName="comentario.userName"
        :commentText="comentario.commentText"
        :liked="comentario.liked"
        :likes="comentario.likes"
        :thumbedUp="comentario.thumbedUp"
        :thumbsUp="comentario.thumbsUp"
      />
    </div>

    </v-card>
  </template>

<script>
import ComentarioPost from '@/components/ComentarioPost.vue';
import PostForm from '@/components/PostForm.vue';

export default {
  components: {
    ComentarioPost,
    PostForm
  },
  data() {
    return {
      mostrarPost: false,
      mostrarComentarios: false,
      comentarios: [
  {
    userAvatar: '/src/assets/jucimar.jpg',
    userName: 'Alice Johnson',
    commentText: 'Ótimo post!',
    liked: false,
    likes: 5,
    thumbedUp: false,
    thumbsUp: 2
  },
  {
    userAvatar: '/src/assets/jucimar.jpg',
    userName: 'Bob Smith',
    commentText: 'Concordo totalmente!',
    liked: true,
    likes: 10,
    thumbedUp: false,
    thumbsUp: 3
  },
  {
    userAvatar: '/src/assets/jucimar.jpg',
    userName: 'Charlie Brown',
    commentText: 'Que inspirador!',
    liked: false,
    likes: 7,
    thumbedUp: true,
    thumbsUp: 1
  }
]

    };
  },
  methods: {
    toggleComentarios() {
      this.mostrarComentarios = !this.mostrarComentarios;
    },
    post_action() {
      this.mostrarPost = !this.mostrarPost;
    },
    
  },
}
</script>

<style>
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
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  font-size: 15px;
}
.user-name:hover{
  color: #4d4c4c;
}

.post-media {
  position: relative;
  padding-top: 56.25%; /* Proporção de 16:9 para manter a imagem não esticada */
  
}
img {    
    width: 100%;
    height: 100%;
    object-fit: cover; /* Mantém a proporção da imagem e preenche o espaço disponível */
  }

@media (max-width: 600px) {
  /* Estilos específicos para telas pequenas (até 600px de largura) */
  .post-card {
    max-width: 100%; /* Usar toda a largura da tela */
   
  }
  /* Outras classes e estilos específicos para telas pequenas */
}
</style>