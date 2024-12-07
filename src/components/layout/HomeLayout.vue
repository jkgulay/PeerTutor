<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/utils/supabase'

const searchQuery = ref('')
const drawer = ref(false)
const toggleDrawer = () => {
  drawer.value = !drawer.value
}

const dialog = ref(false)
const router = useRouter()

const onLogout = async () => {
  try {
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error('Error during logout:', error.message)
      return
    }

    localStorage.clear()
    sessionStorage.clear()

    router.replace({ name: 'login' })
  } catch (err) {
    console.error('Unexpected error during logout:', err)
  }
}

const userProfile = ref({
  user_id: '',
  firstname: '',
  lastname: '',
  email: '',
  avatar: '',
  role: '',
  bio: '',
  expertise: [],
  availability: ''
})

const fetchUserProfile = async () => {
  try {
    const {
      data: { user },
      error: authError
    } = await supabase.auth.getUser()
    if (authError) {
      console.error('Error fetching authenticated user:', authError)
      return
    }

    if (!user || !user.id) {
      console.error('No authenticated user found or user ID is undefined.')
      router.replace({ name: 'login' })
      return
    }

    console.log('Authenticated user:', user)

    const { data, error: profileError } = await supabase
      .from('users')
      .select('user_id, firstname, lastname, email, avatar, role, bio, expertise, availability')
      .eq('user_id', user.id)
      .single()

    if (profileError) {
      console.error('Error fetching user profile:', profileError)
    } else if (data) {
      userProfile.value = {
        user_id: data.user_id,
        firstname: data.firstname || '',
        lastname: data.lastname || '',
        email: data.email || '',
        avatar: data.avatar || 'https://randomuser.me/api/portraits/lego/1.jpg',
        role: data.role || '',
        bio: data.bio || '',
        expertise: data.expertise || '',
        availability: data.availability || ''
      }
    }
  } catch (err) {
    console.error('Unexpected error:', err)
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
            v-model="searchQuery"
            append-inner-icon="mdi-magnify"
            density="compact"
            label="Search"
            variant="solo"
            hide-details
            single-line
            class="mx-4"
            style="max-width: 400px; width: 100%"
            @input="$emit('search-query', searchQuery)"
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
              :prepend-avatar="
                userProfile.avatar || 'https://randomuser.me/api/portraits/men/91.jpg'
              "
              :title="
                userProfile.firstname
                  ? `${userProfile.firstname} ${userProfile.lastname}`
                  : 'Anonymous User'
              "
              :subtitle="userProfile.email || 'No email provided'"
            ></v-list-item>
          </v-list>

          <v-divider></v-divider>

          <v-list density="compact" nav>
            <v-list-item prepend-icon="mdi-home" class="clickable">
              <RouterLink class="text-white text-decoration-none" to="/home">Home</RouterLink>
            </v-list-item>
            <v-list-item prepend-icon="mdi-account-box" class="clickable">
              <RouterLink class="text-white text-decoration-none" to="/profile">Profile</RouterLink>
            </v-list-item>
            <v-list-item prepend-icon="mdi-message" class="clickable">
              <RouterLink class="text-white text-decoration-none" to="/messages"
                >Messages</RouterLink
              >
            </v-list-item>
            <!-- Logout Button -->
            <v-list-item prepend-icon="mdi-logout" @click="onLogout" class="clickable">
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
      <v-footer
        position="relative"
        height="auto"
        style="background: linear-gradient(#072e33, #05161a)"
      >
        <v-row justify="center">
          <v-col class="text-center mt-4" cols="12" style="color: #26a69a">
            {{ new Date().getFullYear() }} — <strong>Kayel</strong>
          </v-col>
        </v-row>
      </v-footer>
    </v-app>
  </v-responsive>
</template>

<style scoped>
.clickable {
  cursor: pointer;
  transition: color 0.3s ease;
}

.clickable:hover {
  color: #80cbc4 !important;
}
</style>
