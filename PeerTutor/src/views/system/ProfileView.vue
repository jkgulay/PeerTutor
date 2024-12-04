<script setup>
import { ref, onMounted } from 'vue'
import HomeLayout from '@/components/layout/HomeLayout.vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/utils/supabase'

supabase.auth.onAuthStateChange((event, session) => {
  if (!session) {
    router.replace({ name: 'login' })
  }
})

const dialog = ref(false)
const router = useRouter()
const selectedFile = ref(null)
const loading = ref(false)

const expertiseOptions = [
  'Math',
  'English',
  'Filipino',
  'Science',
  'History',
  'JavaScript',
  'CSS',
  'HTML',
  'C',
  'Java',
  'UI Design',
  'Sociology',
  'Anthropology',
  'Political Science',
  'Economics',
  'Psychology',
  'Social Work Practice',
  'Biochemistry',
  'Environmental Science',
  'Microbiology',
  'Genetics',
  'Ecology',
  'Statistics',
  'Linear Algebra',
  'Discrete Mathematics',
  'Data Structures',
  'Algorithms',
  'Machine Learning',
  'Cybersecurity',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Software Engineering',
  'Robotics',
  'Network Systems',
  'Database Management',
  'Educational Psychology',
  'Curriculum Development',
  'Classroom Management',
  'Assessment and Evaluation',
  'Special Education',
  'Agricultural Economics',
  'Sustainable Agriculture',
  'Horticulture Techniques',
  'Soil Fertility Management',
  'Pest Management',
  'Philosophy',
  'Literature',
  'Creative Writing',
  'Visual Arts',
  'Health and Wellness',
  'Sports Management',
  'Kinesiology',
  'Recreational Activities',
  'Calculus',
  'Statistical Analysis',
  'Web Development',
  'Database Management (SQL)',
  'Network Administration',
  'Environmental Policy',
  'Conservation Biology',
  'Climate Change Studies',
  'Public Speaking',
  'Interpersonal Communication',
  'Media Studies',
  'Marketing',
  'Accounting',
  'Entrepreneurship',
  'Business Ethics',
  'Introduction to Programming (Python)',
  'Mobile App Development',
  'Game Development'
]

const selectedExpertise = ref([])
const toggleExpertise = (item) => {
  if (selectedExpertise.value.includes(item)) {
    selectedExpertise.value = selectedExpertise.value.filter((expertise) => expertise !== item)
  } else {
    selectedExpertise.value.push(item)
  }
}

const saveExpertiseToSupabase = async () => {
  try {
    const { error } = await supabase
      .from('users')
      .update({ expertise: selectedExpertise.value })
      .eq('user_id', userProfile.value.user_id)

    if (error) {
      console.error('Error updating expertise:', error)
    } else {
      console.log('Expertise updated successfully:', selectedExpertise.value)
    }
  } catch (err) {
    console.error('Unexpected error:', err)
  }
}
const userProfile = ref({
  user_id: '',
  firstname: '',
  lastname: '',
  email: '',
  avatar: '',
  role: '',
  bio: 'This is my Bio!',
  expertise: [],
  social_links1: '',
  social_links2: '',
  availability: false
})

const updateExpertise = () => {
  userProfile.value.expertise = [...selectedExpertise.value]
}

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
  loading.value = true
  if (!userProfile.value.firstname || !userProfile.value.lastname || !userProfile.value.email) {
    alert('Please fill in all required fields.')
    loading.value = false
    return
  }
  try {
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
        availability: userProfile.value.availability,
        social_links1: userProfile.value.social_links1,
        social_links2: userProfile.value.social_links2,
        background: userProfile.value.background
      })
      .eq('user_id', userProfile.value.user_id)

    if (error) {
      console.error('Error updating profile:', error)
      alert('Failed to save profile. Please try again.')
    } else {
      console.log('Profile updated successfully')
      alert('Profile saved successfully!')
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
        'user_id, firstname, lastname, email, avatar, occupation, role, bio, expertise, background, availability, social_links1, social_links2'
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
        expertise: data.expertise || [],
        social_links1: data.social_links1 || '',
        social_links2: data.social_links2 || '',
        availability: data.availability || false,
        background: data.background || ''
      }
      selectedExpertise.value = [...userProfile.value.expertise]
    }
  } catch (err) {
    console.error('Unexpected error:', err)
  }
}

const uploadAvatar = async (file) => {
  if (!file) {
    console.error('No file provided for upload.')
    alert('Please select a file to upload.')
    return null
  }

  try {
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif']
    const MAX_SIZE = 5 * 1024 * 1024

    if (!ALLOWED_TYPES.includes(file.type)) {
      alert('Invalid file type. Only JPEG, PNG, and GIF are allowed.')
      return null
    }

    if (file.size > MAX_SIZE) {
      alert('File is too large. Maximum size is 5MB.')
      return null
    }

    const {
      data: { user },
      error: authError
    } = await supabase.auth.getUser()

    if (authError || !user) {
      console.error('User not logged in:', authError)
      alert('User is not logged in. Please log in to upload an avatar.')
      return null
    }

    const userId = user.id
    const fileName = `${userId}-${Date.now()}.${file.name.split('.').pop().toLowerCase()}`
    const AVATAR_BUCKET = 'avatars'
    const FOLDER_NAME = 'profile'
    const filePath = `${FOLDER_NAME}/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from(AVATAR_BUCKET)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      })

    if (uploadError) {
      console.error('Error uploading avatar:', uploadError.message)
      alert('Failed to upload avatar. Please try again.')
      return null
    }

    const { data: urlData } = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(filePath)

    const avatarUrl = urlData.publicUrl

    const { error: updateError } = await supabase
      .from('users')
      .update({
        avatar: avatarUrl
      })
      .eq('user_id', userId)
      .select()

    if (updateError) {
      console.error('Error updating user avatar in database:', updateError.message)
      alert('Failed to save avatar to profile. Please try again.')
      return null
    }

    userProfile.value.avatar = avatarUrl

    console.log('Avatar uploaded successfully. URL:', avatarUrl)

    return avatarUrl
  } catch (error) {
    console.error('Unexpected error:', error)
    alert('An unexpected error occurred. Please try again.')
    return null
  }
}

const onAvatarChange = async (event) => {
  const files = event.target.files
  if (files && files.length > 0) {
    const file = files[0]
    console.log('Selected file:', file)

    selectedFile.value = file

    const uploadedAvatarUrl = await uploadAvatar(file)

    if (uploadedAvatarUrl) {
      userProfile.value.avatar = uploadedAvatarUrl
    }
  } else {
    alert('No file selected. Please choose an image file.')
  }
}

const uploadBackground = async (file) => {
  if (!file) {
    console.error('No file provided for upload.')
    alert('Please select a file to upload.')
    return null
  }

  try {
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    const MAX_SIZE = 10 * 1024 * 1024

    if (!ALLOWED_TYPES.includes(file.type)) {
      alert('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.')
      return null
    }

    if (file.size > MAX_SIZE) {
      alert('File is too large. Maximum size is 10MB.')
      return null
    }

    const {
      data: { user },
      error: authError
    } = await supabase.auth.getUser()

    if (authError || !user) {
      console.error('User not logged in:', authError)
      alert('User is not logged in. Please log in to upload a background.')
      return null
    }

    const userId = user.id
    const fileName = `background-${userId}-${Date.now()}.${file.name.split('.').pop().toLowerCase()}`
    const BACKGROUND_BUCKET = 'backgrounds'
    const FOLDER_NAME = 'back'
    const filePath = `${FOLDER_NAME}/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from(BACKGROUND_BUCKET)
      .upload(filePath, file, {
        cacheControl: '31536000',
        upsert: true
      })

    if (uploadError) {
      console.error('Error uploading background:', uploadError.message)
      alert('Failed to upload background. Please try again.')
      return null
    }

    const { data: urlData } = supabase.storage.from(BACKGROUND_BUCKET).getPublicUrl(filePath)

    const backgroundUrl = urlData.publicUrl

    const { error: updateError } = await supabase
      .from('users')
      .update({
        background: backgroundUrl
      })
      .eq('user_id', userId)
      .select()

    if (updateError) {
      console.error('Error updating user background in database:', updateError.message)
      alert('Failed to save background to profile. Please try again.')
      return null
    }

    userProfile.value.background = backgroundUrl

    console.log('Background uploaded successfully. URL:', backgroundUrl)

    return backgroundUrl
  } catch (error) {
    console.error('Unexpected background upload error:', error)
    alert('An unexpected error occurred while uploading background. Please try again.')
    return null
  }
}

const onBackgroundChange = async (event) => {
  const files = event.target.files
  if (files && files.length > 0) {
    const file = files[0]

    try {
      const uploadedBackgroundUrl = await uploadBackground(file)

      if (uploadedBackgroundUrl) {
        userProfile.value.background = uploadedBackgroundUrl
      }
    } catch (error) {
      console.error('Background upload failed:', error)
      alert('Failed to upload background. Please try again.')
    }
  } else {
    alert('No file selected. Please choose an image file.')
  }
}

const saveProfileAndUploadAvatar = async () => {
  loading.value = true
  await saveProfile()
  await saveExpertiseToSupabase()
  if (selectedFile.value) {
    await uploadAvatar(selectedFile.value)
  }
  if (selectedFile.value) {
    await uploadBackground(selectedFile.value)
  }

  dialog.value = false
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
          <v-img :src="userProfile.background" class="background-img" height="250px" cover></v-img>

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
                            clearable
                            density="compact"
                          ></v-select>
                        </v-col>
                      </v-row>
                      <v-row dense class="d-flex justify-center">
                        <v-col cols="12" md="6">
                          <v-file-input
                            accept="image/*"
                            placeholder="Pick an avatar"
                            prepend-icon="mdi-camera"
                            variant="outlined"
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
                          maxlength="240"
                          variant="outlined"
                          clearable
                          density="compact"
                        ></v-textarea>
                      </v-row>

                      <v-row dense class="d-flex justify-center">
                        <v-autocomplete
                          v-model="selectedExpertise"
                          :items="expertiseOptions"
                          label="Select Expertise"
                          density="compact"
                          variant="outlined"
                          multiple
                          chips
                          clearable
                          placeholder="Start typing to search..."
                          @change="updateExpertise"
                        />
                      </v-row>
                      <v-row dense class="d-flex justify-center">
                        <v-file-input
                          accept="image/*"
                          placeholder="Pick an avatar"
                          prepend-icon="mdi-camera"
                          variant="outlined"
                          label="Upload Background"
                          @change="onBackgroundChange"
                          density="compact"
                        ></v-file-input>
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
            <v-row class="expertise mt-4">
              <v-col>
                <h4 class="mb-3">Expertise</h4>
                <v-chip-group column>
                  <v-chip
                    v-for="(item, index) in userProfile.expertise"
                    :key="index"
                    :class="{ selected: selectedExpertise.includes(item) }"
                    class="ma-1"
                    color="primary"
                    text-color="white"
                    @click="toggleExpertise(item)"
                  >
                    {{ item }}
                  </v-chip>
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
