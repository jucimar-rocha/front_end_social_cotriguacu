<template>
    <div class="post-form ma-5">
      <div class="user-info">
        <!-- Avatar do usuário -->
        <img class="user-avatar" src="/src/assets/tuti.jpg" alt="Avatar do usuário" />
  
        <!-- Nome do usuário -->
        <div class="user-name">JUCIMAR.ROCHA</div>
      </div>
  
      <!-- Área de texto para a postagem -->
      <textarea
        v-model="postText"
        placeholder="No que você está pensando, Jucimar?"
      ></textarea>
  
      <!-- Botões de ação -->
      <div class="action-buttons">        
        <button class="action-button" @click="uploadMedia">
          <i class="fas fa-photo-video"></i> Foto/Vídeo
        </button>  
      </div>
  
      <!-- Botão de publicar -->
      <button class="publish-button" @click="createPost">
        Publicar
      </button>
    </div>
    
  </template>
  
  <script>
  export default {
    data() {
      return {
        postText: "",
      };
    },
    methods: {
      createPost() {
        // Implemente a lógica para criar a postagem aqui
        // Use this.postText para acessar o texto da postagem
      },
    
      uploadMedia() {
        // Implemente a lógica para fazer upload de mídia (foto/vídeo)
      }      
    },
  };
  </script>
  
  <style scoped>
  .post-form { 
    max-width: 60%;
    max-height: auto;
    background-color: white;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 16px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  }
  
  .user-info {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
  }
  
  .user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 12px;
  }
  
  .user-name {
    font-weight: bold;
    font-size: 16px;
    color: #1877f2; /* Cor azul do Facebook */
  }
  
  textarea {
    width: 100%;
    height: 100px;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 8px;
    margin-bottom: 16px;
    font-size: 16px;
  }
  
  .action-buttons {
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;
  }
  
  .action-button {
    background-color: #f5f6f7; /* Cor de fundo dos botões no Facebook */
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 8px 16px;
    font-size: 14px;
    color: #333; /* Cor do texto dos botões */
    cursor: pointer;
  }
  
  .action-button i {
    margin-right: 8px;
  }
  
  .publish-button {
    background-color: #1877f2; /* Cor azul do Facebook */
    border: none;
    border-radius: 8px;
    padding: 12px 24px;
    font-size: 16px;
    color: white;
    cursor: pointer;   
  }
  
  .publish-button:hover {
    background-color: #1465c0; /* Cor azul escura do Facebook no hover */
  }
  </style>
  