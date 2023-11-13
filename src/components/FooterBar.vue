<template>
    <v-footer
    style="height: 10px;"
      class="d-flex flex-column" elevation="0"
    >
      <div>
        <v-btn
          v-for="icon in icons"
          :key="icon"
          class="mx-4"
          :icon="icon"
          variant="text"
          color="rgb(1, 42, 6)"
          
        ></v-btn>
      </div>
  
      <div class="pt-0">
        {{ new Date().getFullYear() }} — <strong>Todos os direitos reservados</strong>   
      </div>
  
      <v-divider></v-divider>
  
      <div>
        <strong>₢Jdr-Projects</strong>
      </div>
    </v-footer>
  </template>

<script>
export default {
  data: () => ({
    icons: [
      'mdi-facebook',
      'mdi-twitter',
      'mdi-linkedin',
      'mdi-instagram',
    ],
  }),
}
</script>