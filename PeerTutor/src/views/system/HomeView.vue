<script setup>
import HomeLayout from '@/components/layout/HomeLayout.vue'
import { ref, onMounted, computed } from 'vue'
import { supabase } from '@/utils/supabase'

const gapi = window.gapi

const searchQuery = ref('')
const tutors = ref([])
const loading = ref(false)
const selectedExpertise = ref([])

const fetchTutors = async () => {
  loading.value = true
  const { data, error } = await supabase
    .from('users')
    .select(
      'user_id, firstname, lastname, email, avatar, occupation, bio, role, social_links1, social_links2, availability, expertise'
    )
    .eq('role', 'Tutor')
    .eq('availability', true)

  if (error) {
    console.error('Error fetching tutors:', error)
  } else {
    tutors.value = data
  }
  loading.value = false
}

const fetchSubjects = async () => {
  loading.value = true
  const {data, error} = await supabase
    .from('subjects')
    .select(
      'subject_name'
    )
    .eq('id')
    if(error){
      console.error('Error fetching subjects:', error)
      fetchSubjects.value = data
    }
}

const filteredTutors = computed(() =>
  tutors.value.filter((tutor) =>
    `${tutor.firstname} ${tutor.lastname} ${tutor.bio} ${tutor.expertise}`
      .toLowerCase()
      .includes(searchQuery.value.toLowerCase())
  )
)

const openLink = (url) => {
  if (url) {
    window.open(url, '_blank')
  }
}

const initClient = () => {
  if (typeof gapi !== 'undefined') {
    gapi.load('client:auth2', () => {
      gapi.auth2
        .init({
          client_id: '1042151788717-crdgh4totnf4hlic9icl6rd1rmlc0slu.apps.googleusercontent.com',
          scope: 'https://www.googleapis.com/auth/gmail.send'
        })
        .then(() => {
          console.log('GAPI client initialized.')
        })
        .catch((error) => {
          console.error('Error initializing GAPI client:', error)
        })
    })
  } else {
    console.error('GAPI is not loaded.')
  }
}
const authenticate = async () => {
  try {
    await gapi.auth2.getAuthInstance().signIn()
    console.log('User  signed in')
  } catch (error) {
    console.error('Error signing in', error)
  }
}

const sendEmail = async (tutorEmail) => {
  const isSignedIn = gapi.auth2.getAuthInstance().isSignedIn.get()

  if (!isSignedIn) {
    await authenticate()
  }

  const email = [
    'From: your-email@example.com',
    'To: ' + tutorEmail,
    'Subject: Subject Here',
    '',
    'Email body goes here.'
  ].join('\n')

  const base64EncodedEmail = btoa(email).replace(/\+/g, '-').replace(/\//g, '_')

  try {
    await gapi.client.gmail.users.messages.send({
      userId: 'me',
      resource: {
        raw: base64EncodedEmail
      }
    })
    console.log('Email sent successfully')
    alert('Email sent successfully!') // User feedback
  } catch (error) {
    console.error('Error sending email:', error)
    alert('Failed to send email. Please try again.') // User feedback
  }
}

onMounted(() => {
  fetchTutors()
  fetchSubjects()
  initClient()
})

const openChat = (tutor) => {
  console.log('Chat with:', tutor.firstname)
}
</script>

<template>
  <HomeLayout @search-query="searchQuery = $event">
    <template #content>
      <v-container fluid class="d-flex flex-column" style="min-height: 100vh">
        <v-row class="py-10">
          <v-col v-for="tutor in filteredTutors" :key="tutor.user_id" cols="12" md="6">
            <v-card color="#05161a" style="border-radius: 20px; padding: 16px">
              <!-- Tutor Information and Social Media Icons -->
              <v-row class="mb-4" align="center">
                <!-- Avatar -->
                <v-col cols="auto">
                  <v-avatar size="64">
                    <v-img :src="tutor.avatar"></v-img>
                  </v-avatar>
                </v-col>
                <v-col>
                  <div>
                    <h3 class="text-h5 text-white mb-1">
                      {{ tutor.firstname }} {{ tutor.lastname }}
                    </h3>
                    <p class="text-body-2 text-grey-400">{{ tutor.occupation }}</p>
                  </div>
                </v-col>

                <!-- Social Media Icons -->
                <v-col cols="auto" class="d-flex justify-end">
                  <v-btn
                    icon="mdi-email"
                    text
                    color="teal-lighten-3"
                    density="compact"
                    @click="sendEmail(tutor.email)"
                    class="ma-1"
                  ></v-btn>
                  <v-btn
                    icon="mdi-facebook"
                    text
                    color="teal-lighten-3"
                    density="compact"
                    @click="openLink(tutor.social_links1)"
                    class="ma-1"
                  ></v-btn>
                  <v-btn
                    icon="mdi-linkedin"
                    text
                    color="teal-lighten-3"
                    density="compact"
                    @click="openLink(tutor.social_links2)"
                    class="ma-1"
                  ></v-btn>
                </v-col>
              </v-row>

              <!-- Description Section -->
              <v-container class="py-2 px-0">
                <p class="text-body-1 text-grey-300 mb-3">
                  {{ tutor.bio }}
                </p>
              </v-container>

              <!-- Expertise Section -->
              <v-row class="mb-3" justify="start">
                <v-col cols="12">
                  <v-chip-group column>
                    <v-chip
                      v-for="(item, index) in tutor.expertise"
                      :key="index"
                      :class="{ selected: selectedExpertise.includes(item) }"
                      class="ma-1"
                      color="teal-darken-2"
                      text-color="white"
                      @click="toggleExpertise(item)"
                    >
                      {{ item }}
                    </v-chip>
                  </v-chip-group>
                </v-col>
              </v-row>
              <!-- Button and Rating Section -->
              <v-row align="center">
                <!-- Contact Tutor Button -->
                <v-col cols="auto">
                  <v-btn
                    class="text-white"
                    :loading="loading"
                    color="teal-darken-2"
                    size="small"
                    variant="elevated"
                    block
                    elevation="10"
                    style="border-radius: 30px; height: 40px"
                    append-icon="mdi-phone-plus"
                    @click="openChat(tutor)"
                  >
                    Contact Tutor
                  </v-btn>
                </v-col>

                <!-- Rating -->
                <v-col cols="auto" class="d-flex justify-end">
                  <v-rating
                    hover
                    :length="5"
                    :size="28"
                    :model-value="tutor.rating"
                    active-color="teal-darken-2"
                  />
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </HomeLayout>
</template>

<style scoped>
.v-btn {
  text-transform: none;
  font-weight: 500;
}
</style>
