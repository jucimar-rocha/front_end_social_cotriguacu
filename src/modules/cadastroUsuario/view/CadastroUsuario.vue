<template>
  <v-app>
  <v-container>
      <v-row  class="mt-16" justify="center" >
        <v-col>
          <v-card class="mx-auto px-6 pt-5 pb-8 my-custom-card" max-width="644"  style="background-color: #ECEFF1;">      
            <v-row class="mt-5" justify="space-around">
              <v-avatar size="80" color="#0e77a8" class="my-styles-avatar">
                  <v-img
                    :width="100" 
                    src="../../../assets/logo.png"                  
                  ></v-img>
              </v-avatar>
            </v-row>
              <h2 class="text-center my-4">Cadastrar novo usuário</h2>       

            <v-form  ref="form" @submit.prevent validate-on="blur">
              <v-row>
                <v-col cols="12" md="6">
                  <CpfCnpjFieldVue                 
                    v-model="usuario.cpf"
                    placeholder="Digite seu CPF"                   
                    :rules="[rules.obrigatorio]"                   
                    maxlength="12"
                  ></CpfCnpjFieldVue>
                </v-col>             
                <v-col cols="12" md="6">
                  <v-text-field                
                    v-model="usuario.matricula"
                    placeholder="Digite sua matricula"
                   
                    :rules="[rules.obrigatorio]"
                    label="Matricula"
                  ></v-text-field>   
                </v-col>             
              </v-row>
              <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field                  
                      v-model="usuario.celular"
                      placeholder="Digite seu Celular"
                     
                      :rules="[rules.obrigatorio]"
                      label="Celular"
                    ></v-text-field>
                  </v-col>             
                  <v-col cols="12" md="6">
                    <v-text-field
                    type="email"                
                      v-model="usuario.email"
                      placeholder="Digite sua Email"
                     
                      :rules="[rules.obrigatorio]"
                      label="Email"
                    ></v-text-field>   
                  </v-col>             
              </v-row>
              <v-row>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="usuario.senha"
                       
                        :rules="[rules.obrigatorio]"
                        :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                        :type="visible ? 'text' : 'password'"
                        label="Senha"
                        @click:append-inner="visible = !visible"
                        placeholder="Digite sua senha"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="usuario.senha"
                       
                        :rules="[rules.obrigatorio]"
                        :append-inner-icon="visibleConf ? 'mdi-eye-off' : 'mdi-eye'"
                        :type="visibleConf ? 'text' : 'password'"
                        label="Confirmar Senha"
                        @click:append-inner="visibleConf = !visibleConf"
                        placeholder="Confirme sua senha"
                      ></v-text-field>
                    </v-col>
                </v-row>
                <v-btn
                  class="mt-2"
                  @click="salvarNovoUsuario"
                  block
                  color="#1565C0"
                  size="large"
                  type="submit"
                  variant="elevated"
                  prepend-icon="mdi-account-multiple-plus"
                >
                Cadastrar
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
              titulo="Validação de Cadastro" 
              :mensagem="mensagem"
              :type="type"/>
              
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
import CpfCnpjFieldVue from '@/components/CpfCnpjField.vue'
import requestHelper from '@/helpers/request'

export default {
  components: {
    CpfCnpjFieldVue,
    LoadingDialog,
    SnackValidatorCalisto
    
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
            obrigatorio: v => !!v || 'Esse campo é obrigatório.'            
        },
        
    }),
    methods:{
      async salvarNovoUsuario() {   
        
        const { valid } = await this.$refs.form.validate();
        if(!valid) return;       
        
        else{         
          this.loadingDialog = true;
          var contexto = this;
          const request = new requestHelper(); 
          request.post('/Usuario/CadastrarUsuario/', {
             id: this.usuario.id || 0,
             email: this.usuario.email,
             senha: this.usuario.senha,
             cpf: this.usuario.cpf,
             matricula: this.usuario.matricula,
             celular: this.usuario.celular
           }, 
           (response) =>{                                          
             if (response.status === 200){
                contexto.type = "success";
                contexto.mensagem = "Usuário cadastrado com sucesso.";
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
    }

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