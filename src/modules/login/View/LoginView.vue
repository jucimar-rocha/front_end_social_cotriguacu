<template>
  <v-app>
    <v-row class="mt-16" justify="center"  style="height: 100vh; align: center">
      <v-col>
        <v-card class="mx-auto px-6 pt-5 pb-8 my-custom-card" max-width="344"  style="background-color: #ECEFF1;">
          
          <v-row class="mt-5" justify="space-around">
            <v-avatar size="80" color="#0e77a8" class="my-styles-avatar">
                <v-img
                  :width="100" 
                  src="../../../assets/logo.png"                  
                ></v-img>
            </v-avatar>
          </v-row>
       
        <h2 class="text-center my-4">Login</h2>
      <v-form
        v-model="form"
        @submit.prevent="onSubmit"
      >
        <v-text-field
          v-model="usuario"
          placeholder="Entre com CPF ou usuario"
          :readonly="loading"
          :rules="[required]"
          class="mb-2"
          autocomplete="off"
          label="Usuário"
        ></v-text-field>

        <v-text-field
          v-model="senha"
          :readonly="loading"
          :rules="[required]"
          :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
          :type="visible ? 'text' : 'password'"
          autocomplete="off"
          label="Senha"
          @click:append-inner="visible = !visible"
          placeholder="Entre com sua senha"
        ></v-text-field>

          <div class="mt-n2 d-flex justify-end">
            <a class="hover_a" href="/redefinirSenha">Esqueceu sua senha?</a>
          </div>
            
         
        <br>

        <v-btn         
          :loading="loading"
          @click="login"
          block
          color="#1565C0"
          size="large"
          type="submit"
          variant="elevated"
          prepend-icon="mdi-exit-to-app"
        >
          ENTRAR
        </v-btn>
        
        <br>

        <v-btn 
          href="/cadastroUsuario"
          variant="outlined"
          size="large"
          block
          prepend-icon="mdi-account-multiple-plus">
          Não tenho conta
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
        loginOK: false,
        visible: false,
    }),
    methods: {
      login() {
          this.validarLoginSenha (this.usuario, this.senha);
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
                          router.push('/postUsuario');
                      }
                      else {
                          contexto.mensagem = "Falha na autenticação. Tente novamente.";
                          contexto.alertaValidacao = true;
                      }
                  }, 
                  (error) => {                      
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
      }
    }
}

</script>
<style scoped>
.my-custom-card {
    border-radius: 10px; /* Seu valor personalizado aqui */
}
.my-styles-avatar {
  box-shadow: 0px 0px 3px #5f5f5f, 0px 0px 0px 5px #ecf0f3, 8px 8px 15px #a7aaa7, -8px -8px 15px #fff
}
a {
  text-decoration: none;
  color: #3560d4;
  font-size: 15px;
}
.hover_a:hover{
  color: rgb(3, 3, 3);
}
.v-layout{
  background-color: #5d6768;
}
</style>