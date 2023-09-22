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
                            class="mt-2"         
                            v-model="usuario.senha"           
                            :rules="[rules.obrigatorio]"
                            :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                            :type="visible ? 'text' : 'password'"           
                            label="Senha"
                            @click:append-inner="visible = !visible"
                            placeholder="Digite sua senha"
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
                  Atualizar
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
    import router from '@/router'

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
            loadingDialog: false,        
            usuario:{},
            rules: {
                obrigatorio: v => !!v || 'Esse campo é obrigatório.',
            },
        }),
        methods: {
          async redefinirSenha(){
            const { valid } = await this.$refs.form.validate();
            if(!valid) return;
    
            else{             
              this.loadingDialog = true;
            
              try{
                const request = new requestHelper(); 
                const response = await request.post('/usuario/LinkRedefinirSenha/',{
                senha: this.usuario.senha,
                token: this.$route.params.token,           
              });
    
                if(response) {           
                  this.type = "success";
                  this.mensagem = "Senha atualizada, você sera redirecionado a tela do login.";
                  this.alertaValidacao = true;
                  this.usuario = {};
                  router.push("/login");
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