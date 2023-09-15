<template>
 <v-container>
    <v-row class="mt-16" justify="center"  style="height: 50vh; align: center">
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

          <v-form  v-model="form"
                   @submit.prevent validate-on="blur">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field                  
                  v-model="cpf"
                  placeholder="Digite seu CPF"
                  :readonly="loading"
                  :rules="[required]"
                  label="CPF"
                ></v-text-field>
              </v-col>             
              <v-col cols="12" md="6">
                <v-text-field                
                  v-model="matricula"
                  placeholder="Digite sua matricula"
                  :readonly="loading"
                  :rules="[required]"
                  label="Matricula"
                ></v-text-field>   
              </v-col>             
            </v-row>
            <v-row>
                <v-col cols="12" md="6">
                  <v-text-field                  
                    v-model="celular"
                    placeholder="Digite seu Celular"
                    :readonly="loading"
                    :rules="[required]"
                    label="Celular"
                  ></v-text-field>
                </v-col>             
                <v-col cols="12" md="6">
                  <v-text-field
                  type="email"                
                    v-model="email"
                    placeholder="Digite sua Email"
                    :readonly="loading"
                    :rules="[required]"
                    label="Email"
                  ></v-text-field>   
                </v-col>             
            </v-row>
            <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="senha"
                      :readonly="loading"
                      :rules="[required]"
                      :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                      :type="visible ? 'text' : 'password'"
                      label="Senha"
                      @click:append-inner="visible = !visible"
                      placeholder="Digite sua senha"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="senha"
                      :readonly="loading"
                      :rules="[required]"
                      :append-inner-icon="visibleConf ? 'mdi-eye-off' : 'mdi-eye'"
                      :type="visibleConf ? 'text' : 'password'"
                      label="Confirmar Senha"
                      @click:append-inner="visibleConf = !visibleConf"
                      placeholder="Confirme sua senha"
                    ></v-text-field>
                  </v-col>
              </v-row>
              <v-btn                
                :loading="loading"
                @click="novoUsuario"
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
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data: () => ({        
        alertaValidacao: false,
        mensagem: '',       
        visible: false,
        visibleConf: true
    }),
}
</script>

<style>

</style>