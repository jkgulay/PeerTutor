<script setup>
import { ref } from 'vue'

// Ref to toggle the drawer state
const drawer = ref(false)

// Function to toggle the drawer
const toggleDrawer = () => {
  drawer.value = !drawer.value
}
</script>

<template>
  <v-responsive>
    <v-app :theme="theme">
      <!-- App Bar -->
      <v-app-bar
        style="background: linear-gradient(#05161a, #072e33)"
        elevation="8"
        app
        color="primary"
      >
        <!-- App Bar Nav Icon to toggle the drawer -->
        <v-app-bar-nav-icon @click="toggleDrawer"></v-app-bar-nav-icon>

        <!-- Logo and Title -->
        <v-col class="d-flex align-center">
          <v-img src="/logo/try2.png" max-width="50"></v-img>
          <v-app-bar-title>
            <span class="font-weight-bold" style="color: #80cbc4"> PeerTutor </span>
          </v-app-bar-title>
        </v-col>

        <v-spacer></v-spacer>

        <!-- App Bar Icons -->
        <v-btn icon>
          <v-icon>mdi-magnify</v-icon>
        </v-btn>

        <v-btn icon>
          <v-icon>mdi-star</v-icon>
        </v-btn>

        <v-btn icon>
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </v-app-bar>

      <!-- Main Content Layout -->
      <v-layout row class="">
        <v-navigation-drawer v-model="drawer" app permanent expand-on-hover rail>
          <v-list>
            <!-- User Avatar and Info -->
            <v-list-item
              prepend-avatar="https://randomuser.me/api/portraits/women/85.jpg"
              subtitle="sandra_a88@gmail.com"
              title="Sandra Adams"
            ></v-list-item>
          </v-list>

          <v-divider></v-divider>

          <!-- Navigation List -->
          <v-list density="compact" nav>
            <v-list-item prepend-icon="mdi-folder" title="My Files"></v-list-item>
            <v-list-item prepend-icon="mdi-account-multiple" title="Shared with me"></v-list-item>
            <v-list-item prepend-icon="mdi-star" title="Starred"></v-list-item>
          </v-list>
        </v-navigation-drawer>

        <!-- Content and Card Section -->
        <v-main>
          <v-container>
            <!-- Slot for additional content -->
            <slot name="content"></slot>

            <!-- Card Section -->
            <v-card class="mx-auto" max-width="600" style="background-color:; margin-top: 100px">
              <v-card-title class="white--text">Welcome to PeerTutor</v-card-title>
              <v-card-subtitle class="white--text">
                Your learning journey starts here
              </v-card-subtitle>
              <v-card-text class="white--text">
                Explore our features and connect with your tutor today.
              </v-card-text>
            </v-card>
          </v-container>
        </v-main>
      </v-layout>

      <!-- Footer -->
      <v-footer style="background: linear-gradient(#072e33, #05161a)" app class="d-flex">
        <v-row justify="center" no-gutters>
          <v-col class="text-center mt-4" cols="12" style="color: #26a69a">
            {{ new Date().getFullYear() }} — <strong>Kayel</strong>
          </v-col>
        </v-row>
      </v-footer>
    </v-app>
  </v-responsive>
</template>
