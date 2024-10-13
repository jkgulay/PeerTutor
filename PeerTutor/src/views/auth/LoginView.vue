<script setup>
import { ref } from 'vue'

const theme = ref('light')

function onClick() {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}
</script>

<script>
import { ref } from 'vue'
export default {
  data: () => ({
    links: ['Home', 'About Us', 'Team', 'Services', 'Blog', 'Contact Us', 'Portfolio']
  })
}
</script>

<template>
  <v-responsive class="border rounded">
    <v-app :theme="theme">
      <v-app-bar class="3">
        <v-spacer></v-spacer>
        <v-btn
          :prepend-icon="theme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'"
          text="Toggle Theme"
          slim
          @click="onClick"
        ></v-btn>
      </v-app-bar>

      <v-main>
        <v-container>
          <v-row class="dflex justify-center">
            <v-col>
              <v-card
                class="mx-auto px-6 py-8"
                max-width="450"
                prepend-icon="mdi-book-education"
                subtitle="Login Form"
                style="margin: 50px; border-radius: 10%"
              >
                <template v-slot:title>
                  <span class="font-weight-black">PeerTutor</span>
                </template>

                <v-form fast-fail @submit.prevent>
                  <v-text-field
                    class="mx-3 my-2"
                    variant="outlined"
                    prepend-icon="mdi-account"
                    v-model="email"
                    :rules="emailRules"
                    placeholder="user@gmail.com"
                    label="Email"
                    type="email"
                    hide-details="auto"
                    clearable
                  ></v-text-field>

                  <v-text-field
                    class="mx-3 my-2"
                    variant="outlined"
                    prepend-icon="mdi-lock"
                    v-model="password"
                    :rules="passwordRules"
                    label="Password"
                    type="password"
                    hint="Always remember your password!"
                    placeholder="Enter your password"
                    clearable
                  ></v-text-field>

                  <v-btn
                    :disabled="!form"
                    :loading="loading"
                    color="transparent"
                    size="large"
                    type="submit"
                    variant="elevated"
                    block
                  >
                    Sign In
                  </v-btn>
                </v-form>
              </v-card></v-col
            >
          </v-row>
          <v-row class="dflex justify-center">
            <v-col class="mx-auto"
              ><v-card
                append-icon="mdi-open-in-new"
                class="mx-auto"
                href="https://github.com/jkgulay"
                max-width="250"
                prepend-icon="mdi-github"
                rel="noopener"
                subtitle="Jun Kyle"
                target="_blank"
                title="Github"
              ></v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-main>

      <v-footer color="grey-darken-3" border app class="dflex">
        <v-row justify="center" no-gutters>
          <v-btn
            v-for="link in links"
            :key="link"
            class="mx-2"
            color="white"
            rounded="xl"
            variant="text"
          >
            {{ link }}
          </v-btn>
          <v-col class="text-center mt-4" cols="12">
            {{ new Date().getFullYear() }} — <strong>Jun Kyle</strong>
          </v-col>
        </v-row>
      </v-footer>
    </v-app>
  </v-responsive>
</template>
