<template>
  <v-dialog v-model="dialog" persistent>
    <template v-slot:activator="{ props }">
      <v-btn color="primary" v-bind="props">
        Nova Publicação
      </v-btn>
    </template>
    <div class="d-flex justify-center">
      <div class="post-form ma-5">
        <div class="d-flex align-center">
          <v-avatar>
            <v-img src="/src/assets/tuti.jpg"></v-img>
          </v-avatar>
          <span class="user-name ma-2 xs12 sm6" :title="getUsername()">{{ getUsername() }}</span>
          <v-btn class="ml-auto" variant="text" icon="mdi-close-circle-outline" @click="closeDialog"></v-btn>
        </div>
      
        <div>
          <textarea style="color: black;" v-model="postText" placeholder="No que você está pensando ?"></textarea>
          <div v-if="preloadedMedia" class="preloaded-media">
            <img v-if="isImage" :src="preloadedMedia" alt="Imagem pré-carregada" />
            <video v-else :src="preloadedMedia" controls autoplay muted loop>
              Seu navegador não suporta a exibição de vídeos.
            </video>
          </div>
        </div>

        <div class="action-buttons">         
          <v-dialog v-model="uploadDialog" max-width="600px" persistent>
            <v-card style=" box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
              <div class="d-flex justify-space-between">
                <v-card-title>
                  Adicionar Foto/Vídeo
                </v-card-title>
                <v-btn class="ma-2 pa-2" variant="text" icon="mdi-close-circle-outline"
                  @click="closeUploadDialog"></v-btn>
              </div>
              <v-card-text>
                <v-file-input label="Adicione aqui!" variant="outlined" ref="file" v-model="files" accept="image/*,video/*"
                  @change="onFileChange">
                </v-file-input>

                <v-progress-linear v-if="uploading" class="rounded-pill" v-model="uploadProgress" color="primary"
                  height="20">
                  <template v-slot:default="{ value }">
                    <strong>{{ Math.ceil(value) }}%</strong>
                  </template>
                </v-progress-linear>
              </v-card-text>
              <v-card-actions class="justify-end pa-2">
                <v-btn prepend-icon="mdi-cloud-upload" variant="tonal" color="primary" @click="uploadImage">Upload</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>        
          <v-btn @click="openUploadDialog">Adicionar Foto/Vídeo</v-btn>
        </div>
       
        <button class="publish-button" @click="createPost">
          Publicar
        </button>
      </div>
    </div>
  </v-dialog>
</template>

<script>
import { useAuthStore } from '@/modules/login/store';
import axios from 'axios';

export default {
  data() {
    return {
      postText: "",
      dialog: false,
      uploadDialog: false,
      files: [],
      uploading: false,
      uploadProgress: 0,
      preloadedMedia: '',
      isImage: false
    };
  },
  
  methods: {
    openUploadDialog() {
      this.uploadDialog = true;
    },
    closeUploadDialog() {
      this.uploadDialog = false;
      this.files = null;
    },
    closeDialog() {
      this.dialog = false;
      this.file = null;
      this.uploading = false;
      this.uploadProgress = 0;
      this.postText = '';
      this.preloadedMedia = null;
    },
    onFileChange() {     
      if (this.files.length > 0) {
        this.file = this.files[0];  
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
            const uploadedUrl = response.data;
            this.uploading = false;
            this.closeUploadDialog();         
            const isImage = /\.(jpeg|jpg|gif|png|bmp|webp)$/i.test(uploadedUrl);
           
            this.preloadedMedia = uploadedUrl;
            this.isImage = isImage;
          } else {         
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
      this.closeDialog();
    },
    loadMedia() {    
      this.preloadedMedia = '';
      this.isImage = false;
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
  width: 50%;
  align-content: center;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
}

@media (max-width: 600px) {
  .post-form {
    width: 100%;
  }
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
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 14px;
  color: #333;  
  cursor: pointer;
}
.action-button i {
  margin-right: 8px;
}
.publish-button {
  background-color: #1877f2; 
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 16px;
  color: white;
  cursor: pointer;
}
.publish-button:hover {
  background-color: #1465c0;  
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
</style>
