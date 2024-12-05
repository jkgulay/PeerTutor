<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { supabase } from '@/utils/supabase'
import HomeLayout from '@/components/layout/HomeLayout.vue'

const route = useRoute()
const router = useRouter()

const tutorProfile = ref({
  user_id: '',
  firstname: '',
  lastname: '',
  email: '',
  avatar: '',
  role: '',
  occupation: '',
  bio: '',
  expertise: [],
  social_links1: '',
  social_links2: '',
  availability: false,
  background: ''
})

const fetchTutorProfile = async () => {
  try {
    const tutorId = route.params.userId

    const { data, error } = await supabase
      .from('users')
      .select(
        'user_id, firstname, lastname, email, avatar, occupation, role, bio, expertise, background, availability, social_links1, social_links2'
      )
      .eq('user_id', tutorId)
      .eq('role', 'Tutor')
      .single()

    if (error) {
      console.error('Error fetching tutor profile:', error)
      router.replace('/home')
      return
    }

    if (data) {
      tutorProfile.value = {
        user_id: data.user_id,
        firstname: data.firstname || '',
        lastname: data.lastname || '',
        email: data.email || '',
        avatar: data.avatar || '',
        role: data.role || '',
        occupation: data.occupation || '',
        bio: data.bio || '',
        expertise: data.expertise || [],
        social_links1: data.social_links1 || '',
        social_links2: data.social_links2 || '',
        availability: data.availability || false,
        background: data.background || ''
      }
    }
  } catch (err) {
    console.error('Unexpected error:', err)
    router.replace('/home')
  }
}

const openLink = (url) => {
  if (url) {
    window.open(url, '_blank')
  }
}

onMounted(() => {
  fetchTutorProfile()
})
</script>

<template>
  <HomeLayout>
    <template #content>
      <v-container class="profile-container d-flex justify-center pa-0">
        <v-card max-width="900" class="profile-card">
          <v-img 
            :src="tutorProfile.background || 'default-background-url'" 
            class="background-img" 
            height="250px" 
            cover
          ></v-img>

          <v-container class="profile-header">
            <v-avatar class="profile-img" size="140">
              <v-img 
                :src="tutorProfile.avatar || 'default-avatar-url'" 
                alt="Profile Image"
              ></v-img>
            </v-avatar>
            <div class="profile-info">
              <h2 class="profile-name">
                {{ tutorProfile.firstname }} {{ tutorProfile.lastname }}
              </h2>
              <h3 class="profile-job">{{ tutorProfile.occupation }}</h3>
              <p class="profile-bio">{{ tutorProfile.bio }}</p>
            </div>
          </v-container>

          <v-card-text class="profile-details pa-4">
            <v-row class="profile-settings mb-4" justify="center">
              <v-col cols="12" md="5" class="mb-2">
                <v-btn
                  block
                  color="primary"
                  rounded
                  large
                  elevation="2"
                  class="text-none font-weight-regular"
                  prepend-icon="mdi-email"
                  @click="openLink(`mailto:${tutorProfile.email}`)"
                >
                  Contact
                </v-btn>
              </v-col>
              <v-col cols="12" md="5" class="mb-2">
                <v-btn
                  block
                  outlined
                  rounded
                  large
                  :color="tutorProfile.availability ? 'success' : 'error'"
                >
                  {{ tutorProfile.availability ? 'Available' : 'Not Available' }}
                </v-btn>
              </v-col>
            </v-row>

            <v-divider></v-divider>
            
            <v-row class="expertise mt-4">
              <v-col>
                <h4 class="mb-3">Expertise</h4>
                <v-chip-group column>
                  <v-chip
                    v-for="(item, index) in tutorProfile.expertise"
                    :key="index"
                    class="ma-1"
                    color="primary"
                    text-color="white"
                  >
                    {{ item }}
                  </v-chip>
                </v-chip-group>
              </v-col>
            </v-row>

            <v-divider class="my-4"></v-divider>
            
            <v-row class="social-links">
              <v-col cols="12" class="d-flex justify-center">
                <v-btn
                  v-if="tutorProfile.social_links1"
                  icon
                  class="mx-2"
                  @click="openLink(tutorProfile.social_links1)"
                >
                  <v-icon>mdi-facebook</v-icon>
                </v-btn>
                <v-btn
                  v-if="tutorProfile.social_links2"
                  icon
                  class="mx-2"
                  @click="openLink(tutorProfile.social_links2)"
                >
                  <v-icon>mdi-linkedin</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-container>
    </template>
  </HomeLayout>
</template>

<style scoped>
.profile-container {
  min-height: 100vh;
  background-color: #f9f9f9;
  padding-bottom: 80px;
}

.profile-card {
  background-color: white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.background-img {
  object-fit: cover;
  border-bottom: 5px solid #3f51b5;
}

.profile-header {
  position: relative;
  text-align: center;
  margin-top: -60px;
}

.profile-img {
  border: 4px solid white;
}

.profile-info {
  margin-top: 20px;
}

.profile-name {
  font-weight: bold;
  font-size: 24px;
  margin-bottom: 5px;
}

.profile-job {
  font-size: 18px;
  color: #757575;
}

.profile-bio {
  font-size: 16px;
  color: #9e9e9e;
}

.expertise h4 {
  font-weight: bold;
}

.action-item {
  text-align: center;
  padding: 20px;
}

.action-item h5 {
  font-weight: bold;
  margin-bottom: 5px;
}

.v-btn {
  text-transform: none;
  font-weight: 500;
}
</style>