<template>
    <v-card class="comment-card" color="light-grey">
      <v-card-title>
        <v-avatar class="ma-2 xs12 sm6">
          <v-img :src="userAvatar">
          </v-img>
        </v-avatar>
        <span class="user-name ma-2 xs12 sm6">{{ userName }}</span>
      </v-card-title>
  
      <v-card-text class="ma-2">{{ commentText }}</v-card-text>
  
      <v-card-actions>
        <v-btn variant="text" icon @click="toggleLike">
          <v-icon :color="liked ? 'red lighten-2' : 'grey lighten-2'">mdi-heart</v-icon>
        </v-btn>
        <span class="subheading me-1">{{ likes }}</span>
  
        <v-btn variant="text" icon @click="toggleThumbUp">
          <v-icon :color="thumbedUp ? 'blue lighten-2' : 'grey lighten-2'">mdi-thumb-up</v-icon>
        </v-btn>
        <span class="subheading me-1">{{ thumbsUp }}</span>
      </v-card-actions>
    </v-card>
  </template>
  
  <script>
  export default {
    props: {
      userAvatar: String,
      userName: String,
      commentText: String,
      liked: Boolean,
      likes: Number,
      thumbedUp: Boolean,
      thumbsUp: Number
    },
    methods: {
      toggleLike() {
        // Implemente a lógica para curtir/descurtir o comentário
        // Atualize a variável liked e likes
      },
      toggleThumbUp() {
        // Implemente a lógica para reagir ao comentário
        // Atualize a variável thumbedUp e thumbsUp
      }
    }
  };
  </script>
  
  <style>
  .comment-card {
    margin: 1px;
    max-width: 100%;
    background-color: white;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 16px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  }
  </style>
  