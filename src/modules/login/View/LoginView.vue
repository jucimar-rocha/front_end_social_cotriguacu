<template>
  <v-app>
    <v-card class="mt-10" justify="center"  style="height: 100vh; align: center; background-color: #5d6768;">
        <v-card class="mx-auto mt-10 px-6 pt-5 pb-8 my-custom-card" max-width="344"  style="background-color: #ffffff;;">
          
          <v-row class="mt-5" justify="space-around">
            <v-avatar size="80" color="#0e77a8" class="my-styles-avatar">
                <v-img
                  :width="100" 
                  src="../../../assets/logo.png"                  
                ></v-img>
            </v-avatar>
          </v-row>
       
        <h2 class="text-center my-4">Login</h2>
        <v-form  ref="form" @submit.prevent validate-on="blur">
          <v-text-field                   
            v-model="usuario.cpf"
            placeholder="Digite seu CPF"
            :rules="[rules.obrigatorio, rules.validarCpf]"
            label="CPF"
            v-mask="'###.###.###-##'"
            maxlength="14" 
          ></v-text-field>
         
          <v-text-field 
            class="mt-2"         
            v-model="usuario.senha"           
            :rules="[rules.obrigatorio]"
            :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
            :type="visible ? 'text' : 'password'"           
            label="Senha"
            @click:append-inner="visible = !visible"
            placeholder="Digite sua senha"
          ></v-text-field>

            <div class="mt-n1 d-flex justify-end">
              <a class="hover_a" href="/redefinirSenha">Esqueceu sua senha?</a>
            </div>
              
          
          <br>

          <v-btn  
            @click="validarLoginSenha"
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
    </v-card>
    <LoadingDialog :dialog="loadingDialog" />
  </v-app>
</template>

<script>

import { useAuthStore } from '../store';
import { router } from '@/router' 
import { validarCpf, removerMascaras } from '/validacao-global'
import SnackValidatorCalisto from '@/components/SnackValidatorCalisto.vue'
import requestHelper from '@/helpers/request'
import LoadingDialog from '@/components/LoadingDialog.vue'

export default {
    components: {
      SnackValidatorCalisto,
      LoadingDialog,
    },
    data: () => ({      
        loadingDialog: false, 
        alertaValidacao: false,
        mensagem: '',
        loginOK: false,
        visible: false,
        usuario:{},
        rules: {
            obrigatorio: v => !!v || 'Esse campo é obrigatório.',           
            validarCpf: v => validarCpf(v) || 'CPF inválido'  
        },
    }),
    methods: {      
      async validarLoginSenha() {

        const { valid } = await this.$refs.form.validate();
        if(!valid) return;       
        this.loadingDialog = true; 
        
        try {
          this.usuario.cpf = removerMascaras(this.usuario.cpf);
          const request = new requestHelper();
          const response = await request.post("/Login/ValidarLoginSenha/", {
            cpf: this.usuario.cpf,
            senha: this.usuario.senha,
          });

          if (response) {
            
            const { usuario, idUsuario, token } = response.data; 
            const authStore = useAuthStore();
            authStore.autenticarUsuario(usuario, idUsuario, token);
            this.loadingDialog = false, 
            this.senha = '';
            router.push('/postUsuario');

          } else {

            this.mensagem = "Falha na autenticação. Tente novamente.";
            this.alertaValidacao = true;
          }          
        } catch (error) {
          if(error.message){
            error.message === 'Network Error' ? this.mensagem = "Api esta offline, tente novamente mais tarde" : this.mensagem = error.response.data.mensagem;
            this.alertaValidacao = true;
            this.loadingDialog = false;
          }
          else{
            this.mensagem = "Desculpe, parece que estamos enfrentando problemas técnicos no momento e o nosso sistema de login não está disponível. Por favor, tente novamente mais tarde. Estamos trabalhando para resolver o problema o mais rápido possível. Agradecemos a sua paciência.";            
            this.alertaValidacao = true;
            this.loadingDialog = false;
          }
         
        }
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