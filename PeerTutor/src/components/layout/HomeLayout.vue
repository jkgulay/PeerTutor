<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/utils/supabase'

// Drawer state
const drawer = ref(false)
const toggleDrawer = () => {
  drawer.value = !drawer.value
}

// Dialog state for messages (not used directly for logout)
const dialog = ref(false)

// Use router for navigation after logout
const router = useRouter()

// Logout function
const onLogout = async () => {
  try {
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error('Error during logout:', error.message)
      return
    }
    router.replace({ name: 'login' })
  } catch (err) {
    console.error('Unexpected error during logout:', err)
  }
}

const userProfile = ref({
  firstname: '',
  lastname: '',
  email: '',
  avatar: ''
})

const fetchUserProfile = async () => {
  const { data: user, error } = await supabase.auth.getUser()

  if (error) {
    console.error('Error fetching user:', error)
    return
  }

  if (user) {
    const role = user.user_metadata?.role || 'Student'
    const tableName = role === 'Tutor' ? 'tutors' : 'students'

    const { data, error } = await supabase
      .from(tableName)
      .select('firstname, lastname, email, avatar') // Adjust fields based on your table structure
      .eq('id', user.id)
      .single() // Get a single record

    if (error) {
      console.error('Error fetching user profile:', error)
    } else if (data) {
      userProfile.value = {
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        avatar: data.avatar || 'https://randomuser.me/api/portraits/men/91.jpg' // Default avatar if none exists
      }
    }
  }
}

onMounted(() => {
  fetchUserProfile()
})
</script>

<template>
  <v-responsive>
    <v-app>
      <!-- App Bar -->
      <v-app-bar
        style="background: linear-gradient(#05161a, #072e33)"
        elevation="8"
        app
        color="primary"
      >
        <v-app-bar-nav-icon @click="toggleDrawer"></v-app-bar-nav-icon>

        <v-col class="d-flex align-center">
          <v-img src="/logo/try2.png" max-width="50"></v-img>
          <v-app-bar-title class="pl-2">
            <RouterLink to="/home" style="text-decoration: none">
              <span class="font-weight-bold" style="color: #80cbc4">PeerTutor</span>
            </RouterLink>
          </v-app-bar-title>
        </v-col>

        <v-col cols="5" class="d-flex justify-center">
          <v-text-field
            :loading="loading"
            append-inner-icon="mdi-magnify"
            density="compact"
            label="Search"
            variant="solo"
            hide-details
            single-line
            @click:append-inner="onClick"
            class="mx-4"
            style="max-width: 400px; width: 100%"
          ></v-text-field>
        </v-col>

        <v-spacer></v-spacer>

        <v-btn icon @click="dialog = true">
          <v-icon>mdi-chat</v-icon>
        </v-btn>
        <v-dialog v-model="dialog" max-width="550">
          <v-card>
            <!-- Messages Box Section -->
            <v-divider class="mx-4 mb-2"></v-divider>
            <v-card-title>Messages</v-card-title>
            <v-container>
              <v-row class="d-flex flex-column">
                <v-col cols="12" class="d-flex align-center mb-2">
                  <v-avatar size="32">
                    <img src="https://randomuser.me/api/portraits/men/5.jpg" alt="Sender Profile" />
                  </v-avatar>
                  <div class="ms-2">
                    <div class="text-h6">Sender Name</div>
                    <div class="text-body-2">Hey, I'd like to schedule a session!</div>
                  </div>
                </v-col>

                <v-col cols="12" class="d-flex align-center mb-2">
                  <v-avatar size="32">
                    <img
                      src="https://randomuser.me/api/portraits/men/1.jpg"
                      alt="Receiver Profile"
                    />
                  </v-avatar>
                  <div class="ms-2">
                    <div class="text-h6">Receiver Name</div>
                    <div class="text-body-2">Sure, what time works for you?</div>
                  </div>
                </v-col>
              </v-row>
            </v-container>
          </v-card>
        </v-dialog>
      </v-app-bar>

      <!-- Main Content Layout -->
      <v-layout row>
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
            <v-list-item
              :prepend-avatar="userProfile.avatar"
              :title="`${userProfile.firstname} ${userProfile.lastname}`"
              :subtitle="userProfile.email"
            ></v-list-item>
          </v-list>

          <v-divider></v-divider>

          <v-list density="compact" nav>
            <v-list-item prepend-icon="mdi-home">
              <RouterLink class="text-white text-decoration-none" to="/home">Home</RouterLink>
            </v-list-item>
            <v-list-item prepend-icon="mdi-account-box">
              <RouterLink class="text-white text-decoration-none" to="/profile">Profile</RouterLink>
            </v-list-item>
            <!-- Logout Button -->
            <v-list-item prepend-icon="mdi-logout" @click="onLogout">
              <span class="text-white">Logout</span>
            </v-list-item>
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
      <v-footer style="background: linear-gradient(#072e33, #05161a)" class="d-flex" padless>
        <v-row justify="center" no-gutters>
          <v-col class="text-center mt-4" cols="12" style="color: #26a69a">
            {{ new Date().getFullYear() }} — <strong>Kayel</strong>
          </v-col>
        </v-row>
      </v-footer>
    </v-app>
  </v-responsive>
</template>
