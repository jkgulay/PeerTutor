<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import LoginForm from './LoginForm.vue'
</script>

<template>
  <AppLayout>
    <template #content>
      <v-container fluid>
        <v-row class="dflex justify-center">
          <v-col>
            <v-card
              class="mx-auto px-6"
              max-width="450"
              subtitle="PeerTutor"
              style="margin: 30px; border-radius: 30px"
              elevation="20"
              color="#294D61"
            >
              <template v-slot:title>
                <v-img class="mx-auto" max-width="228" src="/logo/try2.png"></v-img>

                <span class="font-weight-black text-teal-lighten-3">Welcome!</span>
              </template>

              <LoginForm></LoginForm>

              <v-divider class="mx-3"></v-divider>
              <v-card-text class="text-center">
                <a
                  class="text-white text-decoration-none"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Don't have an account?
                  <RouterLink class="text-teal-lighten-3 text-decoration-none" to="/register">
                    Sign Up</RouterLink
                  ><v-icon icon="mdi-chevron-right"></v-icon>
                </a>
              </v-card-text> </v-card
          ></v-col>
        </v-row>
      </v-container>
    </template>
  </AppLayout>
</template>
