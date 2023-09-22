<template>
  <v-app>
  <v-container>
      <v-row  class="mt-sm-16" justify="center" >
        <v-col>
          <v-card class="mx-auto px-6 pt-5 pb-8" max-width="644"  style="background-color: #ECEFF1;">      
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
                  <v-text-field                   
                    v-model="usuario.cpf"
                    placeholder="Digite seu CPF"
                    :rules="[rules.obrigatorio, rules.validarCpf]"
                    label="CPF"
                    v-mask="'###.###.###-##'"
                    maxlength="14"  
                  ></v-text-field>
                </v-col>             
                <v-col cols="12" md="6">
                  <v-text-field   
                    type="number"  
                    min="0"           
                    v-model="usuario.matricula"
                    placeholder="Digite sua matricula"                   
                    :rules="[rules.obrigatorio]"
                    label="Matricula"
                    maxlength="6"                  
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
                      v-mask="'(##) #####-####'"
                      maxlength="15"
                    ></v-text-field>
                  </v-col>             
                  <v-col cols="12" md="6">
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
                        v-model="usuario.contraSenha"                       
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
    methods:{
      async salvarNovoUsuario() {   
        
        const { valid } = await this.$refs.form.validate();
        if(!valid) return;       
        
        else{        
          this.usuario.cpf = removerMascaras(this.usuario.cpf);
          this.usuario.matricula = removerMascaras(this.usuario.matricula);
          this.usuario.celular = removerMascaras(this.usuario.celular); 
          
          this.loadingDialog = true;

          try{
            const request = new requestHelper(); 
            const response = await request.post('/Usuario/CadastrarUsuario/', {
             id: this.usuario.id || 0,
             email: this.usuario.email,
             senha: this.usuario.senha,
             cpf: this.usuario.cpf,
             matricula: this.usuario.matricula,
             celular: this.usuario.celular
            });

            if(response) {             
              this.type = "success";
              this.mensagem = "Usuário cadastrado com sucesso.";
              this.alertaValidacao = true; 
              this.usuario = {};
             }
                       
          } catch (error) {
          this.type = "error";
          this.mensagem = error.response.data.mensagem;
          this.alertaValidacao = true;
          }
          this.loadingDialog = false;
        }       
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