<template>
    <v-app> 
      <v-container>
        <v-row class="mt-16" justify="center"  style="height: 50vh; align: center">
          <v-col>
            <v-card class="mx-auto px-6 pt-5 pb-8 my-custom-card" max-width="344"  style="background-color: #ffffff;;">      
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
                <div class="requisitos-senha" v-if="senhaFocada">
                  <div
                  class="list_senha"
                    v-for="(requisito, index) in senhaRequisitos"
                    :key="index"
                    :class="{ 'requisito-atendido': requisito.atendido, 'requisito-nao-atendido': !requisito.atendido }"
                  >
                    {{ requisito.texto }}
                  </div>
                </div>
                <v-text-field
                  class="mt-2"
                  v-model="usuario.senha"
                  :rules="[rules.obrigatorio]"
                  :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                  :type="visible ? 'text' : 'password'"
                  label="Senha"
                  @click:append-inner="visible = !visible"
                  placeholder="Digite sua senha"
                  @focus="senhaFocada = true"
                  @blur="senhaFocada = false"
                ></v-text-field>                
                  <v-btn 
                    @click="redefinirSenha"
                    block
                    color="#1565C0"
                    size="large"
                    type="submit"
                    variant="elevated"
                    prepend-icon="mdi-account-convert"
                    :disabled="!todosRequisitosAtendidos"
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
            senhaFocada: false,
            visibleConf: true,          
            loadingDialog: false,        
            usuario:{},
            rules: {
                obrigatorio: v => !!v || 'Esse campo é obrigatório.',
            },
            senhaRequisitos: [
            { texto: 'Pelo menos 8 caracteres', atendido: false },
            { texto: 'Pelo menos uma letra maiúscula', atendido: false },
            { texto: 'Pelo menos uma letra minúscula', atendido: false },
            { texto: 'Pelo menos um número', atendido: false },
            { texto: 'Pelo menos um caractere especial', atendido: false },
          ],
        }),
        computed: {
          todosRequisitosAtendidos() {
            return this.senhaRequisitos.every(requisito => requisito.atendido);
          },
        },        
        methods: {
          async redefinirSenha(){
            const { valid } = await this.$refs.form.validate();
            if(!valid) return;

              try{
                const request = new requestHelper(); 
                const response = await request.post('/RedefinirSenha/LinkRedefinirSenha/',{
                senha: this.usuario.senha,
                token: this.$route.params.token,           
              });
    
                if(response) {           
                  this.type = "success";
                  this.mensagem = "Senha atualizada com sucesso, você sera redirecionado a tela do login.";
                  this.alertaValidacao = true;
                  this.usuario = {};
                  this.loadingDialog = false;

                  await new Promise(resolve => setTimeout(resolve, 5000));
                  
                  router.push("/login");                  
                }
              } catch (error) {
                this.type = "error";
                this.mensagem = error.response.data.mensagem;
                this.alertaValidacao = true;  
                this.loadingDialog = false;
              }
        },
        verificarRequisitosSenha() {
            const senha = this.usuario.senha;

            if (senha) { // Verifique se senha não é nula ou indefinida
              this.senhaRequisitos[0].atendido = senha.length >= 8;
              this.senhaRequisitos[1].atendido = /[A-Z]/.test(senha);
              this.senhaRequisitos[2].atendido = /[a-z]/.test(senha);
              this.senhaRequisitos[3].atendido = /\d/.test(senha);
              this.senhaRequisitos[4].atendido = /[!@#$%^&*]/.test(senha);
            }
          },
      },
      watch: {
          'usuario.senha': 'verificarRequisitosSenha',
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
      .requisitos-senha {     
        position: absolute;
        top: -0px; 
        width: 85%;
        margin: 8px 2px 2px 2px;       
        font-size: 14px;
        background-color: #dbdfe4;
        border-radius: 8px;
      }
      .list_senha{
        padding: 6px;
      }

      .requisito-atendido {
        color: green;
      }

      .requisito-nao-atendido {
        color: red;
      }
    </style>