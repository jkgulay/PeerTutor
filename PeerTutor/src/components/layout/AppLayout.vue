<script setup>
import { ref } from 'vue'
</script>

<script></script>

<template>
  <v-responsive>
    <v-app :theme="theme">
      <v-app-bar
        style="background: linear-gradient(#05161a, #072e33)"
        elevation="8"
        app
        color="primary"
      >
        
        <v-col class="d-flex align-center"
          ><v-img src="/logo/try2.png" max-width="50"></v-img
          ><v-app-bar-title
            ><span class="font-weight-bold" style="color: #80cbc4">PeerTutor</span></v-app-bar-title
          ></v-col
        >

        <v-spacer></v-spacer>

        <v-btn icon>
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </v-app-bar>

      <v-main style="background-color: #05161a">
        <v-container><slot name="content"></slot> </v-container>
      </v-main>

      <v-footer style="background: linear-gradient(#072e33, #05161a)" border app class="dflex">
        <v-row justify="center" no-gutters>
          <v-col class="text-center mt-4" cols="12" style="color: #26a69a">
            {{ new Date().getFullYear() }} — <strong>Kayel</strong>
          </v-col>
        </v-row>
      </v-footer>
    </v-app>
  </v-responsive>
</template>
