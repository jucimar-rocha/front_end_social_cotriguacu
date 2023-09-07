<template>
  <v-app>
    <v-row justify="center" align="center" style="height: 50vh;">
      <v-col>
        <v-card class="mx-auto px-6 pt-5 pb-8" max-width="344" style="background-color: rgb(235, 231, 234);">
      <v-img
        :width="50"
        class="mx-auto my-0"
        src="../../../assets/logo.png"
        style="background-color: rgb(45, 48, 48); border-radius: 50px;"
      ></v-img>
      <h2 class="text-center my-4">Login TIP</h2>
      <v-form
        v-model="form"
        @submit.prevent="onSubmit"
      >
        <v-text-field
          v-model="usuario"
          :readonly="loading"
          :rules="[required]"
          class="mb-2"
          clearable
          label="Usuário"
        ></v-text-field>

        <v-text-field
          v-model="senha"
          :readonly="loading"
          :rules="[required]"
          clearable
          label="Senha"
          :type="'password'"
          placeholder="Entre com sua senha"
        ></v-text-field>

        <br>

        <v-btn
          :disabled="!form"
          :loading="loading"
          @click="login"
          block
          color="success"
          size="large"
          type="submit"
          variant="elevated"
        >
          Acessar
        </v-btn>
        
      </v-form>

      <SnackValidatorCalisto 
        v-model="alertaValidacao"  
        titulo="Validação de Login" 
        :mensagem="mensagem"/>

      </v-card>
      </v-col>
    </v-row>
  </v-app>
</template>

<script>

import { useAuthStore } from '../store';
import { router } from '@/router' 

import SnackValidatorCalisto from '@/components/SnackValidatorCalisto.vue'
import requestHelper from '@/helpers/request'

export default {
    components: {
      SnackValidatorCalisto
    },
    data: () => ({
        usuario: '',
        senha: '',
        alertaValidacao: false,
        mensagem: '',
        loginOK: false
    }),
    methods: {
      login() {
          this.validarLoginSenha (this.usuario.toUpperCase(), this.senha);
      },
      validarLoginSenha (usuario, senha) {
          var contexto = this;
          const request = new requestHelper();
          request.post("/Usuario/ValidarLoginSenha/", 
                  {
                    Login: usuario,
                    Senha: senha
                  },
                  (response) => {
                      contexto.loginOK = response;
                      if (contexto.loginOK) {
                          const authStore = useAuthStore();
                          authStore.autenticarUsuario(contexto.usuario, contexto.senha);
                          contexto.senha = '';
                          router.push('/');
                      }
                      else {
                          contexto.mensagem = "Falha na autenticação. Tente novamente.";
                          contexto.alertaValidacao = true;
                      }
                  }, 
                  (error) => {
                      console.log(error.response.data.mensagem);
                      contexto.mensagem = error.response.data.mensagem;
                      contexto.alertaValidacao = true;
                      return;
                  });
      },
      logout() {
          const authStore = useAuthStore();
          this.usuario = '';
          authStore.logout();
          router.push('/login');
      },
      onSubmit() {
          console.log('submit clicked');
      }
    }
}

</script>