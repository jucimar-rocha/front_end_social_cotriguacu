<template>
<v-app> 
  <v-container>
    <v-row class="mt-16" justify="center"  style="height: 50vh; align: center">
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
            <h2 class="text-center my-4">Redefinir Senha</h2>       

          <v-form ref="form" @submit.prevent validate-on="blur">           
            
                <v-col>
                <v-text-field                  
                  v-model="usuario.cpf"
                  placeholder="Digite seu CPF"
                  :rules="[rules.obrigatorio, rules.validarCpf]"
                  label="CPF"
                  v-mask="'###.###.###-##'"
                  maxlength="14"  
                ></v-text-field>
              </v-col>            
                <v-col>
                  <v-text-field
                    type="email"                
                    v-model="usuario.email"
                    placeholder="Digite seu Email"                     
                    :rules="[rules.obrigatorio, rules.email]"
                    label="Email"
                    maxlength="50"
                    auto-uppercase="off"
                  ></v-text-field>   
                </v-col> 

              <v-btn 
                @click="redefinirSenha"
                block
                color="#1565C0"
                size="large"
                type="submit"
                variant="elevated"
                prepend-icon="mdi-account-convert"
              >
              Redefinir
              </v-btn>
              <br>
              <v-btn 
                href="/login"
                variant="outlined"
                size="large"
                block
                prepend-icon="mdi-account-circle">
                Voltar para Login
              </v-btn>
          </v-form>
          <SnackValidatorCalisto 
              v-model="alertaValidacao"  
              titulo="Redefinição de senha" 
              :mensagem="mensagem"
              :type="type"
           />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  <LoadingDialog :dialog="loadingDialog" />
</v-app> 
</template>

<script>
import SnackValidatorCalisto from '@/components/SnackValidatorCalisto.vue'
import LoadingDialog from '@/components/LoadingDialog.vue'
import requestHelper from '@/helpers/request'
import { validarCpf, removerMascaras } from '/validacao-global'

export default {
  components: {    
    LoadingDialog,
    SnackValidatorCalisto, 
  },
  data: () => ({        
        alertaValidacao: false, 
        mensagem: '',  
        type: '',        
        visible: false,
        visibleConf: true,
        enviando: false,
        loadingDialog: false,        
        usuario:{},
        rules: {
            obrigatorio: v => !!v || 'Esse campo é obrigatório.',
            email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Email inválido',
            validarCpf: v => validarCpf(v) || 'CPF inválido'  
        },
    }),
    methods: {
      async redefinirSenha(){
        const { valid } = await this.$refs.form.validate();
        if(!valid) return;

        else{
          this.usuario.cpf = removerMascaras(this.usuario.cpf);

          this.loadingDialog = true;
          var contexto = this;
          const request = new requestHelper(); 

          request.post('/usuario/RedefinirSenha/',{
            cpf: this.usuario.cpf,
            email: this.usuario.email,
          },
          (response) =>{
            if (response.status === 200){
                contexto.type = "success";
                contexto.mensagem = "Senha redefinida, verifique seu email.";
                contexto.alertaValidacao = true; 

                contexto.usuario = {};
             }
          },
          (error) => {                      
            contexto.type = "error";
             contexto.mensagem = error.response.data.mensagem;
             contexto.alertaValidacao = true;          
           });   
        }
        this.loadingDialog = false;
      }
    },
}
</script>

<style scoped>
  .v-layout{
   background-color: #5d6768;
  }
  .my-styles-avatar {
  box-shadow: 0px 0px 3px #5f5f5f, 0px 0px 0px 5px #ecf0f3, 8px 8px 15px #a7aaa7, -8px -8px 15px #fff
}
</style>