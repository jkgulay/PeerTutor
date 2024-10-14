<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
</script>

<script></script>

<template>
  <AppLayout>
    <template #content>
      <v-row class="dflex justify-center">
        <v-col>
          <v-card
            class="mx-auto px-6"
            max-width="450"
            subtitle="Login Form"
            style="margin: 30px; border-radius: 30px"
            elevation="20"
            color="#294D61"
          >
            <template v-slot:title>
              <v-img class="mx-auto" max-width="228" src="/logo/try2.png"></v-img>

              <span class="font-weight-black" style="color: #80cbc4">PeerTutor</span>
              <v-divider class="my-2" color="black"></v-divider>
            </template>

            <v-form fast-fail @submit.prevent>
              <v-text-field
                class="mx-3 my-2"
                variant="outlined"
                prepend-inner-icon="mdi-account"
                density="compact"
                v-model="email"
                :rules="emailRules"
                placeholder="user@gmail.com"
                label="Email"
                type="email"
                hide-details="auto"
                clearable
              ></v-text-field>

              <v-text-field
                class="mx-3"
                density="compact"
                variant="outlined"
                prepend-inner-icon="mdi-lock"
                :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                :type="visible ? 'text' : 'password'"
                @click:append-inner="visible = !visible"
                v-model="password"
                :rules="passwordRules"
                label="Password"
                type="password"
                hint="Always remember your password!"
                placeholder="Enter your password"
              ></v-text-field>

              <v-container width="200">
                <v-btn
                  class=""
                  :loading="loading"
                  color="teal-darken-2"
                  size="large"
                  type="submit"
                  variant="elevated"
                  block
                  elevation="10"
                  style="border-radius: 30px"
                >
                  <span style="color: #80cbc4">Sign In</span>
                </v-btn></v-container
              >
            </v-form>
            <v-divider class=""></v-divider>
            <v-card-text class="text-center">
              <a class="text-white text-decoration-none" rel="noopener noreferrer" target="_blank">
                Don't have an account? <RouterLink to="/register">Sign up now</RouterLink
                ><v-icon icon="mdi-chevron-right"></v-icon>
              </a>
            </v-card-text> </v-card
        ></v-col>
      </v-row>
    </template>
  </AppLayout>
</template>
