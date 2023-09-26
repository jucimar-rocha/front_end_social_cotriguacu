<template>
  <div class="post-form ma-5">
    <div>
      <v-avatar class="ma-2">
        <v-img src="/src/assets/tuti.jpg"></v-img>
      </v-avatar>
      <span class="user-name ma-2 xs12 sm6" :title="getUsername()">{{ getUsername() }}</span>
    </div>

    <!-- Área de texto para a postagem -->
    <div>
      <textarea style="color: black;" v-model="postText" placeholder="No que você está pensando ?"></textarea>
      <div v-if="preloadedMedia" class="preloaded-media">
        <img v-if="isImage" :src="preloadedMedia" alt="Imagem pré-carregada" />
        <video v-else :src="preloadedMedia" controls autoplay muted loop>
          Seu navegador não suporta a exibição de vídeos.
        </video>
      </div>
    </div>

    <!-- Botões de ação -->
    <div class="action-buttons">
      <!-- Botão para adicionar foto/vídeo -->
      <v-dialog v-model="dialog" max-width="600px" persistent>
        <v-card style=" box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
          <div class="d-flex justify-space-between">
            <v-card-title>
            Adicionar Foto/Vídeo
          </v-card-title>
          <v-btn class="ma-2 pa-2" variant="text" icon="mdi-close-circle-outline" @click="cancelUpload"></v-btn>
        </div>
          <v-card-text>           
              <v-file-input label="Adicone aqui!" variant="outlined" ref="file" v-model="files" accept="image/*,video/*"
                @change="onFileChange">
              </v-file-input>
          
            <v-progress-linear v-if="uploading" class="rounded-pill" v-model="uploadProgress" color="primary" height="20">
              <template v-slot:default="{ value }">
                <strong>{{ Math.ceil(value) }}%</strong>
              </template>
            </v-progress-linear>
          </v-card-text>
          <v-card-actions class="justify-end pa-2">
            <v-btn prepend-icon="mdi-cloud-upload"  variant="tonal" color="primary" @click="uploadImage">Upload</v-btn>         
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Botão para abrir o diálogo -->
      <v-btn @click="openDialog">Adicionar Foto/Vídeo</v-btn>
    </div>

    <!-- Botão de publicar -->
    <button class="publish-button" @click="createPost">
      Publicar
    </button>
  </div>
</template>

<script>
import { useAuthStore } from '@/modules/login/store';
import axios from 'axios';

export default {
  data() {
    return {
      postText: "",
      dialog: false,
      files: [],
      uploading: false,
      uploadProgress: 0,
      preloadedMedia: '',
      isImage: false
    };
  },
  watch: {
    postText: function () {
      this.loadMedia();
    },
  },
  methods: {
    openDialog() {
      this.dialog = true;
    },
    closeDialog() {
      this.dialog = false;
      this.file = null;
      this.uploading = false;
      this.uploadProgress = 0;
    },
    onFileChange() {
      // Aqui você pode validar e processar os arquivos selecionados
      if (this.files.length > 0) {
        this.file = this.files[0]; // Obtém o primeiro arquivo (assumindo que você deseja processar apenas um arquivo)        
      }
    },
    async uploadImage() {
      if (this.file) {
        try {
          const formData = new FormData();
          formData.append('file', this.file);
          this.files.push({ loading: 0 });

          this.uploading = true;

          const response = await axios.post('https://localhost:7084/api/Arquivos/Upload/',
            formData, {
            ...this.getHeaderConfig(),
            onUploadProgress: ({ loaded, total }) => {
              this.uploadProgress = Math.floor((loaded / total) * 100);
            }
          });

          if (response.status === 200) {
            // A resposta da API deve conter a URL do arquivo carregado
            const uploadedUrl = response.data.fileUrl;
            this.uploading = false;
            this.closeDialog();
            // Verifique o tipo do arquivo para determinar se é uma imagem ou vídeo
            const isImage = /\.(jpeg|jpg|gif|png|bmp|webp)$/i.test(uploadedUrl);

            // Faça o que for necessário com a URL carregada
            this.preloadedMedia = uploadedUrl;
            this.isImage = isImage;
          } else {
            // Lida com erros da API, se houver
            console.error('Erro no upload:', response.status, response.statusText);
          }
        } catch (error) {
          console.error('Erro na solicitação:', error.message);
        }
      }
    },
    getToken() {
      let store = useAuthStore();
      return store.token;
    },
    getHeaderConfig() {
      let token = this.getToken();

      return {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        }
      };
    },
    getUsername() {
      let store = useAuthStore();

      if (store && store.user) {
        return store.user.toUpperCase();
      }
    },
    cancelUpload() {
      // Cancelar o upload (pode ser implementado)
      this.closeDialog();
    },
    loadMedia() {
      // Limpa a mídia pré-carregada ao começar a carregar novamente
      this.preloadedMedia = '';
      this.isImage = false;

      // Aqui você pode adicionar a lógica para identificar e pré-carregar imagens ou vídeos
      // Por exemplo, você pode usar expressões regulares para encontrar URLs de imagens ou vídeos no texto do post.

      const urls = this.extractUrls(this.postText);

      if (urls.length > 0) {
        // Suponha que a primeira URL seja a imagem ou vídeo principal
        this.preloadedMedia = urls[0];
        this.isImage = this.preloadedMedia.match(/\.(jpeg|jpg|gif|png|bmp|webp)$/i) !== null;
      }
    },
    extractUrls(text) {
      // Esta função utiliza uma expressão regular para extrair URLs do texto
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      return text.match(urlRegex) || [];
    },
  },
};
</script>

<style scoped>
.post-form {
  max-width: 50%;
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
  color: #1877f2;
  /* Cor azul do Facebook */
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
  background-color: #f5f6f7;
  /* Cor de fundo dos botões no Facebook */
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 14px;
  color: #333;
  /* Cor do texto dos botões */
  cursor: pointer;
}

.action-button i {
  margin-right: 8px;
}

.publish-button {
  background-color: #1877f2;
  /* Cor azul do Facebook */
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 16px;
  color: white;
  cursor: pointer;
}

.publish-button:hover {
  background-color: #1465c0;
  /* Cor azul escura do Facebook no hover */
}


.preloaded-media {
  margin-top: 10px;
}

.preloaded-media img {
  max-width: 100%;
  max-height: 300px;
}

.preloaded-media video {
  max-width: 100%;
}


.custom-file-input {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  border: 1px dashed #ccc;
  padding: 20px;
  text-align: center;
  cursor: pointer;
}
</style>
