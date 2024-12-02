<script setup>
import { ref, onMounted } from 'vue'
import HomeLayout from '@/components/layout/HomeLayout.vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/utils/supabase'

const dialog = ref(false)
const router = useRouter()

const userProfile = ref({
  user_id: '',
  firstname: '',
  lastname: '',
  email: '',
  avatar: 'https://randomuser.me/api/portraits/lego/1.jpg', // Default avatar
  role: '',
  bio: '',
  expertise: '',
  availability: false
})

const toggleAvailability = async () => {
  // Toggle local availability state
  userProfile.value.availability = !userProfile.value.availability;

  const { error } = await supabase
    .from('users') // Replace with your actual table name
    .update({ availability: userProfile.value.availability })
    .eq('user_id', userProfile.value.user_id); // Use userProfile.value.user_id directly

  if (error) {
    console.error('Error updating availability:', error);

    // Revert the availability state if there was an error
    userProfile.value.availability = !userProfile.value.availability;
  } else {
    console.log('Availability updated successfully');
  }
}

const fetchUserProfile = async () => {
  try {
    // Fetch the authenticated user
    const {
      data: { user },
      error: authError
    } = await supabase.auth.getUser ()
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

    // Fetch the user profile from the database
    const { data, error: profileError } = await supabase
      .from('users')
      .select(
        'user_id, firstname, lastname, email, avatar, occupation, role, bio, expertise, availability'
      )
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
        avatar: data.avatar || 'https://randomuser.me/api/portraits/lego/1.jpg', // Default avatar
        role: data.role || '',
        occupation: data.occupation || '',
        bio: data.bio || '',
        expertise: data.expertise || '',
        availability: data.availability || false // Ensure availability is a boolean
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
  <HomeLayout>
    <template #content>
      <v-container class="profile-container d-flex justify-center pa-0">
        <v-card max-width="900" class="profile-card">
          <!-- Profile Header with background image and profile info -->
          <v-img src="/cover.jpg" class="background-img" height="250px" cover></v-img>

          <v-container class="profile-header">
            <v-avatar class="profile-img" size="140">
              <v-img :src="userProfile.avatar" alt="Profile Image"></v-img>
            </v-avatar>
            <div class="profile-info">
              <h2 class="profile-name">
                {{
                  userProfile.firstname
                    ? `${userProfile.firstname} ${userProfile.lastname}`
                    : 'Anonymous User'
                }}
              </h2>
              <h3 class="profile-job">{{ userProfile.occupation || 'Role' }}</h3>
              <p class="profile-bio">{{ userProfile.bio || 'No Bio' }}</p>
            </div>
          </v-container>

          <!-- Profile Details -->
          <v-card-text class="profile-details pa-4">
            <v-row class="profile-settings mb-4" justify="center">
              <v-col cols="12" md="5" class="mb-2">
                <!-- Dialog Trigger Button -->
                <v-btn
                  block
                  color="#80cbc4"
                  rounded
                  large
                  elevation="2"
                  class="text-none font-weight-regular"
                  prepend-icon="mdi-account"
                  text
                  @click="dialog = true"
                >
                  Edit Profile
                </v-btn>

                <!-- Dialog Component -->
                <v-dialog v-model="dialog" max-width="550">
                  <v-card>
                    <v-card-title class="text-center">
                      <v-icon class="mr-2">mdi-account</v-icon>
                      User Profile
                    </v-card-title>

                    <v-card-text>
                      <v-row dense class="d-flex justify-center">
                        <v-col cols="12" md="6 " sm="6">
                          <v-text-field
                            label="First name"
                            v-model="userProfile.firstname"
                            required
                            variant="outlined"
                            prepend-inner-icon="mdi-badge-account-outline"
                            placeholder="First Name"
                            hide-details="auto"
                            clearable
                          ></v-text-field>
                        </v-col>

                        <v-col cols="12" md="6" sm="6">
                          <v-text-field
                            label="Last name"
                            v-model="userProfile.lastname"
                            required
                            variant="outlined"
                            placeholder="Last Name"
                            hide-details="auto"
                            clearable
                          ></v-text-field>
                        </v-col>
                      </v-row>
                      <v-row dense class="d-flex justify-center">
                        <v-col cols="12" md="6" sm="6">
                          <v-text-field
                            label="Email"
                            v-model="userProfile.email"
                            required
                            variant="outlined"
                            prepend-inner-icon="mdi-email"
                            placeholder="user@gmail.com"
                            hide-details="auto"
                            clearable
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6" sm="6">
                          <v-select
                            label="Role"
                            v-model="userProfile.role"
                            :items="['Tutor ', 'Student']"
                            variant="outlined"
                          ></v-select>
                        </v-col>
                      </v-row>
                    </v-card-text>

                    <v-divider></v-divider>

                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn text @click="dialog = false">Close</v-btn>
                      <v-btn color="primary" @click="saveProfile">Save</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-col>
              <v-col cols="12" md="5" class="mb-2">
                <v-btn
                  block
                  outlined
                  rounded
                  large
                  :style="buttonStyle"
                  @click="toggleAvailability"
                >
                  {{ userProfile.availability ? 'Available' : 'Not Available' }}
                </v-btn>
              </v-col>
            </v-row>

            <!-- Skills Section -->
            <v-divider></v-divider>
            <v-row class="skills mt-4">
              <v-col>
                <h4 class="mb-3">Subjects</h4>
                <v-chip-group column>
                  <v-chip class="ma-1" color="primary" text-color="white"> Javascript </v-chip>
                  <v-chip class="ma-1" color="primary" text-color="white"> CSS </v-chip>
                  <v-chip class="ma-1" color="primary" text-color="white"> HTML </v-chip>
                  <v-chip class="ma-1" color="primary" text-color="white"> C </v-chip>
                  <v-chip class="ma-1" color="primary" text-color="white"> Java </v-chip>
                  <v-chip class="ma-1" color="primary" text-color="white"> UI Design </v-chip>
                </v-chip-group>
              </v-col>
            </v-row>

            <!-- Profile Actions -->
            <v-divider class="my-4"></v-divider>
            <v-row class="profile-actions">
              <v-col cols="12">
                <v-card class="action-item" outlined elevation="0">
                  <h5>Ready for work</h5>
                  <p>Show recruiters that you're ready for work</p>
                </v-card>
              </v-col>
              <v-col cols="12">
                <v-card class="action-item" outlined elevation="0">
                  <h5>Share posts</h5>
                  <p>Share latest news to get connected with others</p>
                </v-card>
              </v-col>
              <v-col cols="12">
                <v-card class="action-item" outlined elevation="0">
                  <h5>Update</h5>
                  <p>Keep your profile updated so that the recruiters know</p>
                </v-card>
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

.skills h4 {
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
