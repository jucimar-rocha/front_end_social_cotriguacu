<template>
    <v-snackbar
      :timeout="timeout"
      location="top"
      color="rgba(0, 0, 0, 0.0)"
      class="pa-0" 
      variant="outlined"     
      
    >
      <v-alert
        :type="type"
        :title="titulo"       
        prominent
      >
        {{ mensagem }}
      </v-alert>
    </v-snackbar>
</template>

<script>
    export default {
        props: {
            type: {
              type: String,
              default: 'warning'
            },  
            titulo: {
                type: String,
                default: 'Aconteceu Algo de Errado!',
            },
            mensagem: {
                type: String,
                default: 'Verifique se esta tudo certo.'
            },
            timeout: {
                type: Number,
                default: 2500
            
            },
        data: () => ({
            
        }),
       
      },
    }
</script>