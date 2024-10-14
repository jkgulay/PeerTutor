<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import RegisterForm from './RegisterForm.vue'
</script>

<template>
  <AppLayout
    ><template #content
      ><v-container fluid
        ><v-row class="dflex justify-center">
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
                <span class="font-weight-black text-teal-lighten-3">Create an account</span>
                <v-divider class="my-2"></v-divider>
              </template>

              <RegisterForm></RegisterForm>
              <v-divider class="mx-3"></v-divider>
              <v-card-text class="text-center">
                <a
                  class="text-white text-decoration-none"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Already have an account?<v-icon icon="mdi-chevron-left"></v-icon>
                  <RouterLink class="text-teal-lighten-3" to="/login">Sign In</RouterLink>
                </a>
              </v-card-text>
            </v-card></v-col
          >
        </v-row>
      </v-container>
    </template>
  </AppLayout>
</template>
