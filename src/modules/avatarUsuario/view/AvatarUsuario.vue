<template>
    <div>
        <v-list-item class="mt-n2" @click="openAvatarDialog">
            <v-avatar>
                <img class="avatar-img" :src="avatarUrl" alt="User Avatar" />
            </v-avatar>
            <span class="ml-3" :title="showUsername ? getUsername() : ''" v-if="showUsername">{{ getUsername() }}</span>
            <v-dialog v-model="avatarDialog" max-width="400px" persistent>
                <v-card style="box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
                    <div class="d-flex">
                        <v-card-title>Adicionar Avatar</v-card-title>
                        <v-btn class="ml-auto" variant="text" icon="mdi-close-circle-outline"
                            @click="cancelAvatar"></v-btn>
                    </div>
                    <v-card-text>
                        <v-file-input label="Adicione seu avatar!" variant="outlined" ref="file" v-model="files"
                            accept="image/*" @change="onFileChange">
                        </v-file-input>

                        <v-progress-linear v-if="uploading" class="rounded-pill" v-model="uploadProgress" color="primary"
                            height="20">
                            <template v-slot:default="{ value }">
                                <strong>{{ Math.ceil(value) }}%</strong>
                            </template>
                        </v-progress-linear>
                    </v-card-text>
                    <v-card-actions class="justify-end pa-2">
                        <v-btn prepend-icon="mdi-cloud-upload" variant="tonal" color="primary"
                            @click="saveAvatar">Upload</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-list-item>
        <SnackValidatorCalisto v-model="alertaValidacao" titulo="Avatar" :mensagem="mensagem" :type="type" />
    </div>
</template>
  
<script>
import axios from 'axios';
import { useAuthStore } from '@/modules/login/store';
import SnackValidatorCalisto from '@/components/SnackValidatorCalisto.vue'
import requestHelper from '@/helpers/request'
import {useAvatarStore} from '../store'

export default {
    components: {
        SnackValidatorCalisto,
    },
    props: {
        openModal: {
            type: Boolean,
            default: false
        },
        showUsername: {
            type: Boolean,
            default: true,
        },
    },

    data: () => ({
        alertaValidacao: false,
        avatarDialog: false,
        files: [],
        uploading: false,
        uploadProgress: 0        
    }),
    mounted() {
        const idUsuario = localStorage.getItem('idUsuario');
        this.avaterUsuario(idUsuario);
    },
    computed:{
        avatarUrl() {
        const avatarStore = useAvatarStore();
        return avatarStore.getAvatarUrl();
        },
    },
    methods: {
        async avaterUsuario(idUsuario) {
            const request = new requestHelper();
            const avatarStore = useAvatarStore();

            request.get(`/Usuario/BuscarPorId${idUsuario}`,{},
                function (response) {
                    avatarStore.setAvatarUrl(response.data.pathAvatar);
                }
            );
        },
        getUsername() {
            let store = useAuthStore();
            if (store) {
                return store.user;
            }
        },
        onFileChange() {
            if (this.files.length > 0) {
                this.file = this.files[0];
            }
        },
        openAvatarDialog() {
            if (this.openModal) {
                this.avatarDialog = true;
            }
        },
        async saveAvatar() {
            if (this.file) {
                try {
                    const formData = new FormData();
                    formData.append('file', this.file);
                    formData.append('isAvatar', true);
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
                        const avatarStore = useAvatarStore();
                        avatarStore.setAvatarUrl(response.data);
                        this.avatarUrl = response.data;
                        this.type = "success";
                        this.mensagem = "Avatar atualizado com sucesso";
                        this.alertaValidacao = true;
                        this.uploading = false;                  
                    } else {
                        console.error('Erro no upload:', response.status, response.statusText);
                    }

                } catch (error) {
                    this.type = "error";
                    this.mensagem = error.mensagem;
                    this.alertaValidacao = true;
                }
                this.avatarDialog = false;
            }
            await new Promise(resolve => setTimeout(resolve, 4000));

            this.cancelAvatar();
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
        cancelAvatar() {
            this.files = null;
            this.avatarDialog = false;
            this.uploading = false;
        },
    },
};
</script>

<style scoped>
.avatar-img {
    width: 100%;
}
</style>