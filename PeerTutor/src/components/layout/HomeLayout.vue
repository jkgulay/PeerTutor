<script setup>
import { ref } from 'vue'

const drawer = ref(false)
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
            <RouterLink to="/home" style="text-decoration: none ">
              <span class="font-weight-bold" style="color: #80cbc4"> PeerTutor </span>
            </RouterLink>
          </v-app-bar-title>
        </v-col>

        <v-spacer></v-spacer>

        <!-- App Bar Icons -->
        <v-card-text>
          <v-text-field
            :loading="loading"
            append-inner-icon="mdi-magnify"
            density="compact"
            label="Search Tutor"
            variant="solo"
            hide-details
            single-line
            @click:append-inner="onClick"
          ></v-text-field>
        </v-card-text>

        <v-btn icon>
          <v-icon>mdi-star</v-icon>
        </v-btn>

        <v-btn icon>
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </v-app-bar>

      <!-- Main Content Layout -->
      <v-layout row class="">
        <v-navigation-drawer
          v-model="drawer"
          app
          permanent
          expand-on-hover
          rail
          class="py-14 text-white"
          style="
            background-color: #05161a;
            position: fixed;
            top: 0;
            left: 0;
            height: 100vh;
            z-index: 1000;
          "
        >
          <v-list>
            <!-- User Avatar and Info -->
            <v-list-item
              prepend-avatar="https://randomuser.me/api/portraits/men/91.jpg"
              subtitle="user123@gmail.com"
              title="User Name"
            ></v-list-item>
          </v-list>

          <v-divider></v-divider>

          <!-- Navigation List -->
          <v-list density="compact" nav>
            <v-list-item prepend-icon="mdi-home"
              ><RouterLink class="text-white text-decoration-none" to="/home">Home</RouterLink></v-list-item
            >
            <v-list-item prepend-icon="mdi-account-box"
              ><RouterLink class="text-white text-decoration-none" to="/profile">Profile</RouterLink></v-list-item
            >
            <v-list-item prepend-icon="mdi-logout"
              ><RouterLink class="text-white text-decoration-none" to="./">Logout</RouterLink></v-list-item
            >
          </v-list>
        </v-navigation-drawer>

        <!-- Content and Card Section -->
        <v-main>
          <v-container>
            <slot name="content"></slot>
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
