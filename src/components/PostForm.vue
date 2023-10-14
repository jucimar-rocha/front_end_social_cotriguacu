<template>
  <v-dialog v-model="dialog" persistent>
    <template v-slot:activator="{ props }">
      <v-card class="templet-post ma-5 elevation-2" v-bind="props">
        <div class="d-flex align-center">
        <avatar-usuario :showUsername="false" :openModal="false" class="ml-n5 mt-1"/>
            <span class="templete-span">
              No que você esta pensando ?
            </span>
        </div>
      </v-card>      
    </template>
    <div class="d-flex justify-center">
      <v-card  class="post-form ma-5">
        <div class="d-flex">
          <avatar-usuario :openModal="false" class="ml-n4"/>
          <v-btn class="ml-auto mt-n3 mr-n3"  density="compact" variant="text" icon="mdi-close-thick" @click="closeDialog"></v-btn>          
        </div>

        <div>
          <QuillEditor placeholder="Adicione a mensagem da publicação!" theme="snow" v-model:content="postText" content-type="text"/>
          <div v-if="preloadedMedia" class="d-flex justify-center ma-3 preloaded-media">
            <img v-if="isImage" :src="preloadedMedia" alt="Imagem pré-carregada" />
            <video v-else :src="preloadedMedia" controls muted loop>
              Seu navegador não suporta a exibição de vídeos.
            </video>
          </div>
        </div>

        <div class="action-buttons">
          <v-dialog v-model="uploadDialog" max-width="600px" persistent>
            <v-card>
              <div class="d-flex justify-space-between">
                <v-card-title>
                  Adicionar Foto/Vídeo
                </v-card-title>
                  <v-btn class="ml-auto"
                    density="compact" variant="text" icon="mdi-close-thick" @click="closeUploadDialog"></v-btn> 
              </div>
              <v-card-text>
                <v-file-input label="Adicione aqui!" variant="outlined" ref="file" v-model="files"
                  accept="image/*,video/*" @change="onFileChange">
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
          <v-btn prepend-icon="mdi-group" @click="openUploadDialog">Adicionar Foto/Vídeo</v-btn>
        </div>

        <button class="publish-button" @click="publicarPost">
          Publicar
        </button>      
      <SnackValidatorCalisto 
              v-model="alertaValidacao"  
              titulo="Publicação" 
              :mensagem="mensagem"
              :type="type"/>
    </v-card>
  </div>
    <LoadingDialog :dialog="loadingDialog" />
  </v-dialog>
</template>

<script>
import { useAuthStore } from '@/modules/login/store';
import SnackValidatorCalisto from '@/components/SnackValidatorCalisto.vue'
import LoadingDialog from '@/components/LoadingDialog.vue'
import requestHelper from '@/helpers/request'
import axios from 'axios';
import AvatarUsuario from '../modules/avatarUsuario/view/AvatarUsuario.vue';

export default {
  components: {    
    LoadingDialog,
    SnackValidatorCalisto, 
    AvatarUsuario
  },
  data() {
    return {      
      alertaValidacao: false, 
      dialog: false,
      uploadDialog: false,
      files: [],
      uploading: false,
      uploadProgress: 0,
      preloadedMedia: '',
      isImage: false,
      postText: "",
      loadingDialog: false,  
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
      this.alertaValidacao = false;
    },
    onFileChange() {
      if (this.files.length > 0) {
        this.file = this.files[0];
      }
    },
    async publicarPost(){
      
      this.loadingDialog = true;
      try {
        const request = new requestHelper(); 
        let postData = {
          id: this.id || 0,
          idUsuario: this.idUsuario || 0,
          mensagem: this.postText,
          senha: this.senha,
          urlImagem: '',
          urlVideo: '' 
        };

        if (this.isImage) {
          postData.urlImagem = this.preloadedMedia;
        } else {
          postData.urlVideo = this.preloadedMedia;
        }

        const response = await request.post('/Publicacoes/PublicarPost/', postData);

            if(response) {             
              this.type = "success";
              this.mensagem = "Publicação realizada com sucesso";
              this.alertaValidacao = true; 
              this.$emit('PostFormPostagemUsuario');            
             }
             
      } catch (error) {
        this.type = "error";
        this.mensagem = error.response.data.mensagem;
        this.alertaValidacao = true;        
      }

      await new Promise(resolve => setTimeout(resolve, 3000));

      this.closeDialog();
      this.loadingDialog = false;      
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
        this.loadingDialog = false;
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
        this.preloadedMedia = urls[0];
        this.isImage = this.preloadedMedia.match(/\.(jpeg|jpg|gif|png|bmp|webp)$/i) !== null;
      }
    },
    extractUrls(text) {   
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      return text.match(urlRegex) || [];
    },
    
  },
};
</script>

<style scoped>
.templete-span{
  background-color: #b3b8bd; 
  padding: 10px; 
  border-radius: 15px; 
  width: 95%;  
}
.post-form {
  width: 50%;
  max-height: 80vh;
  align-content: center;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
}
.templet-post{
  max-width: 60%;
  max-height: auto; 
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
}

@media (max-width: 600px) {
  .post-form {
    width: 100%;
  }
  .templet-post{
    max-width: 100%;
  }
  .templete-span{
    width: 80%;
  }

  .preloaded-media img {
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

.preloaded-media img {
  max-width: 50%;
  max-height: 50%;
  overflow: hidden;
}

.preloaded-media video {
  max-width: 100%;
  height: auto;
}
</style>
