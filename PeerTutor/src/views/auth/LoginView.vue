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
          <v-row>
            <v-col>
              <v-card
                class="mx-auto"
                prepend-icon="$vuetify"
                subtitle="The #1 Vue UI Library"
                width=""
              >
                <template v-slot:title>
                  <span class="font-weight-black">Welcome to Me</span>
                </template>

                <v-card-text class="bg-surface-light pt-4">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi, ratione debitis
                  quis est labore voluptatibus! Eaque cupiditate minima, at placeat totam, magni
                  doloremque veniam neque porro libero rerum unde voluptatem! Lorem ipsum dolor sit
                  amet consectetur adipisicing elit. Nihil deleniti harum corrupti quas, vitae illum
                  quam aut esse unde, facilis nobis repellendus nostrum at sunt laudantium odio
                  eveniet. Ratione, nostrum.
                </v-card-text>
              </v-card></v-col
            >
          </v-row>
          <v-row>
            <v-col
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
              ></v-card
            ></v-col>
          </v-row>
        </v-container>
      </v-main>

      <v-footer class="bg-grey-lighten-1">
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
