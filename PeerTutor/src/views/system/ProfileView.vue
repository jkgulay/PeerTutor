<script setup>
import { ref, onMounted } from 'vue'
import HomeLayout from '@/components/layout/HomeLayout.vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/utils/supabase'

const dialog = ref(false)
const router = useRouter()
const selectedFile = ref(null) // Store the selected file

const userProfile = ref({
  user_id: '',
  firstname: '',
  lastname: '',
  email: '',
  avatar: 'https://randomuser.me/api/portraits/lego/1.jpg', 
  role: '',
  bio: 'This is my Bio!',
  expertise: '',
  social_links1: '',
  social_links2: '',
  availability: false
})

const toggleAvailability = async () => {
  userProfile.value.availability = !userProfile.value.availability

  const { error } = await supabase
    .from('users')
    .update({ availability: userProfile.value.availability })
    .eq('user_id', userProfile.value.user_id)

  if (error) {
    console.error('Error updating availability:', error)
    userProfile.value.availability = !userProfile.value.availability
    alert('Failed to update availability. Please try again.')
  } else {
    console.log('Availability updated successfully')
    alert('Availability updated successfully!')
  }
}

const saveProfile = async () => {
  try {
    if (!userProfile.value.firstname || !userProfile.value.lastname || !userProfile.value.email) {
      alert('First name, last name, and email are required fields.')
      return
    }

    const { error } = await supabase
      .from('users')
      .update({
        firstname: userProfile.value.firstname,
        lastname: userProfile.value.lastname,
        email: userProfile.value.email,
        role: userProfile.value.role,
        bio: userProfile.value.bio,
        avatar: userProfile.value.avatar,
        expertise: userProfile.value.expertise,
        occupation: userProfile.value.occupation,
        availability: userProfile.value.availability,
        social_links1: userProfile.value.social_links1,
        social_links2: userProfile.value.social_links2
      })
      .eq('user_id', userProfile.value.user_id)

    if (error) {
      console.error('Error updating profile:', error)
      alert('Failed to save profile. Please try again.')
    } else {
      console.log('Profile updated successfully')
      alert('Profile saved successfully!')
      dialog.value = false
    }
  } catch (err) {
    console.error('Unexpected error:', err)
    alert('An unexpected error occurred. Please try again.')
  }
}

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
      .select(
        'user_id, firstname, lastname, email, avatar, occupation, role, bio, expertise, availability, social_links1, social_links2'
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
        avatar: data.avatar || '',
        role: data.role || '',
        occupation: data.occupation || '',
        bio: data.bio || '',
        expertise: data.expertise || '',
        social_links1: data.social_links1 || '',
        social_links2: data.social_links2 || '',
        availability: data.availability || false
      }
    }
  } catch (err) {
    console.error('Unexpected error:', err)
  }
}




const uploadAvatar = async (file) => {
  if (!file) {
    console.error('No file provided for upload');
    alert('Please select a file to upload.');
    return;
  }

  
  const userId = (await supabase.auth.getUser ()).data.user?.id;
  if (!userId) {
    console.error('User  is not logged in');
    alert('User  is not logged in. Please log in to upload an avatar.');
    return;
  }

  const fileName = `${userId}-${Date.now()}.${file.name.split('.').pop()}`;
  const AVATAR_BUCKET = import.meta.env.VITE_APP_AVATAR_BUCKET || 'avatars'; // Use the environment variable

  const { data, error } = await supabase.storage.from(AVATAR_BUCKET).upload(fileName, file);

  if (error) {
    console.error('Error uploading avatar:', error.message);
    alert('Failed to upload avatar. Please try again.');
    return;
  }

  const { data: publicUrlData } = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(data.path);

  if (publicUrlData.publicUrl) {
    console.log('Avatar uploaded successfully. URL:', publicUrlData.publicUrl);
    // Update the user profile with the new avatar URL
  }
};

const loading = ref(false)
const selectedFilePreview = ref(null)

const onAvatarChange = (files) => {
  if (files && files.length > 0) {
    const file = files[0]
    const validFileTypes = ['image/jpeg', 'image/png', 'image/bmp']
    if (validFileTypes.includes(file.type)) {
      selectedFile.value = file
      selectedFilePreview.value = URL.createObjectURL(file)
      uploadAvatar(file)
    } else {
      alert('Please select a valid image file (JPG, PNG, BMP, JPEG).')
    }
  } else {
    alert('Please select a valid image file.')
  }
}

const saveProfileAndUploadAvatar = async () => {
  loading.value = true
  await saveProfile()
  if (selectedFile.value) {
    await uploadAvatar(selectedFile.value)
  }
  loading.value = false
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

          <v-card-text class="profile-details pa-4">
            <v-row class="profile-settings mb-4" justify="center">
              <v-col cols="12" md="5" class="mb-2">
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

                <v-dialog v-model="dialog" max-width="550">
                  <v-card>
                    <v-card-title class="text-center">
                      <v-icon class="mr-2">mdi-account</v-icon>
                      User Profile
                    </v-card-title>

                    <v-card-text>
                      <v-row dense class="d-flex justify-center">
                        <v-col cols="12" md="6">
                          <v-text-field
                            label="First name"
                            v-model="userProfile.firstname"
                            required
                            variant="outlined"
                            prepend-inner-icon="mdi-badge-account-outline"
                            placeholder="First Name"
                            hide-details="auto"
                            clearable
                            density="compact"
                          ></v-text-field>
                        </v-col>

                        <v-col cols="12" md="6">
                          <v-text-field
                            label="Last name"
                            v-model="userProfile.lastname"
                            required
                            variant="outlined"
                            placeholder="Last Name"
                            hide-details="auto"
                            clearable
                            density="compact"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                      <v-row dense class="d-flex justify-center">
                        <v-col cols="12" md="6">
                          <v-text-field
                            label="Email"
                            v-model="userProfile.email"
                            required
                            variant="outlined"
                            prepend-inner-icon="mdi-email"
                            placeholder="user@gmail.com"
                            hide-details="auto"
                            clearable
                            density="compact"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-select
                            label="Role"
                            v-model="userProfile.role"
                            :items="['Tutor', 'Student']"
                            variant="outlined"
                            hide-details="auto"
                            clearable
                            density="compact"
                          ></v-select>
                        </v-col>
                      </v-row>
                      <v-row dense class="d-flex justify-center">
                        <v-col cols="12" md="6">
                          <v-file-input
                            accept="image/png, image/jpeg, image/bmp, image/jpg"
                            placeholder="Pick an avatar"
                            prepend-icon="mdi-camera"
                            variant="outlined"
                            hide-details="auto"
                            label="Upload Avatar"
                            @change="onAvatarChange"
                            density="compact"
                          ></v-file-input>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-select
                            label="Occupation"
                            v-model="userProfile.occupation"
                            density="compact"
                            :items="[
                              'Teacher',
                              'Tutor',
                              'Student',
                              'Professor',
                              'Online Instructor',
                              'Education Consultant',
                              'School Administrator',
                              'Curriculum Developer',
                              'Learning Facilitator',
                              'Private Tutor',
                              'Training Specialist',
                              'Subject Matter Expert',
                              'Mentor',
                              'Coach',
                              'Librarian',
                              'Research Assistant',
                              'Guidance Counselor',
                              'Special Education Teacher',
                              'Vocational Trainer',
                              'Child Care Worker',
                              'Other'
                            ]"
                            variant="outlined"
                            hide-details="auto"
                          ></v-select>
                        </v-col>
                      </v-row>
                      <v-row dense class="d-flex justify-center">
                        <v-col cols="12" md="6">
                          <v-text-field
                            label="Facebook Link"
                            v-model="userProfile.social_links1"
                            required
                            variant="outlined"
                            prepend-inner-icon="mdi-facebook"
                            placeholder="Facebook"
                            hide-details="auto"
                            clearable
                            density="compact"
                          ></v-text-field>
                        </v-col>

                        <v-col cols="12" md="6">
                          <v-text-field
                            label="LinkedIn Link"
                            v-model="userProfile.social_links2"
                            prepend-inner-icon="mdi-linkedin"
                            required
                            variant="outlined"
                            placeholder="LinkedIn"
                            clearable
                            density="compact"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                      <v-row dense class="d-flex justify-center">
                        <v-textarea
                          v-model="userProfile.bio"
                          label="Bio"
                          maxlength="120"
                          variant="outlined"
                          hide-details="auto"
                          clearable
                          density="compact"
                        ></v-textarea>
                      </v-row>
                    </v-card-text>

                    <v-divider></v-divider>

                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn text @click="dialog = false">Close</v-btn>
                      <v-btn
                        color="primary"
                        @click="saveProfileAndUploadAvatar"
                        :disabled="loading"
                      >
                        <span v-if="loading">Saving...</span>
                        <span v-else>Save</span>
                      </v-btn>
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

            <v-divider></v-divider>
            <v-row class="skills mt-4">
              <v-col>
                <h4 class="mb-3">Expertise</h4>
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
