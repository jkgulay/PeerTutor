<script setup>
import HomeLayout from '@/components/layout/HomeLayout.vue'
import { ref, onMounted, computed } from 'vue'
import { supabase } from '@/utils/supabase'
import { useRouter } from 'vue-router'

const router = useRouter()
const searchQuery = ref('')
const tutors = ref([])
const loading = ref(false)
const selectedExpertise = ref([])

const fetchTutors = async () => {
  try {
    // First, fetch tutors
    const { data: tutorsData, error: tutorsError } = await supabase
      .from('users')
      .select('*')
      .eq('role', 'Tutor')
      .is('availability', true)

    if (tutorsError) {
      console.error('Error fetching tutors:', tutorsError)
      return
    }

    const tutorsWithRatings = await Promise.all(
      tutorsData.map(async (tutor) => {
        // Calculate average rating
        const { data: reviewsData, error: reviewsError } = await supabase
          .from('reviews')
          .select('rating')
          .eq('tutor_id', tutor.id)

        if (reviewsError) {
          console.error(`Error fetching reviews for tutor ${tutor.id}:`, reviewsError)
          return { ...tutor, rating: 0, reviewCount: 0 }
        }

        const ratings = reviewsData.map((review) => review.rating)
        const averageRating =
          ratings.length > 0 ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length : 0

        return {
          ...tutor,
          rating: Number(averageRating.toFixed(1)),
          reviewCount: ratings.length
        }
      })
    )

    tutors.value = tutorsWithRatings
  } catch (error) {
    console.error('Unexpected error:', error)
  }
}

const fetchSubjects = async () => {
  loading.value = true
  const { data, error } = await supabase
    .from('subjects')
    .select('id, subject_name')
    .eq('subject_name')
  if (error) {
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

const sendEmail = (recipientEmail, tutor) => {
  const subject = encodeURIComponent('Tutoring Connection Request')
  const body = encodeURIComponent(`Hi ${tutor.firstname},

I'm interested in connecting with you for tutoring.

Best regards,
[Your Name]`)

  const mailtoLink = `mailto:${recipientEmail}?subject=${subject}&body=${body}`

  window.location.href = mailtoLink
}
const openLink = (url) => {
  if (url) {
    window.open(url, '_blank')
  }
}

const navigateToTutorProfile = (userId) => {
  router.push({
    name: 'tutor-profile',
    params: { userId: userId }
  })
}

onMounted(() => {
  fetchTutors()
  fetchSubjects()
})

const openChat = (tutor) => {
  loading.value[tutor.id] = true

  setTimeout(() => {
    console.log('Chat with:', tutor.firstname)

    loading.value[tutor.id] = false
  }, 1000)
}
</script>

<template>
  <HomeLayout @search-query="searchQuery = $event">
    <template #content>
      <v-container fluid class="d-flex flex-column">
        <v-row class="py-10">
          <v-col
            v-for="tutor in filteredTutors"
            :key="tutor.user_id"
            cols="12"
            md="6"
            class="d-flex"
          >
            <v-card
              color="#05161a"
              class="tutor-card d-flex flex-column"
              style="border-radius: 20px; padding: 16px; width: 100%"
            >
              <!-- Tutor Information and Social Media Icons -->
              <v-row class="mb-4" align="center">
                <!-- Avatar -->
                <v-col cols="auto">
                  <v-avatar size="64">
                    <v-img
                      :src="tutor.avatar"
                      class="clickable"
                      @click="navigateToTutorProfile(tutor.user_id)"
                    ></v-img>
                  </v-avatar>
                </v-col>
                <v-col>
                  <div>
                    <h3
                      class="text-h5 text-white mb-1 clickable"
                      @click="navigateToTutorProfile(tutor.user_id)"
                    >
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
                    @click="sendEmail(tutor.email, tutor)"
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
              <v-container class="py-2 px-0 flex-grow-1">
                <p class="text-body-1 text-grey-300 mb-3" style="min-height: 60px">
                  {{ tutor.bio || 'No bio available' }}
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
              <v-row align="center" class="mt-auto">
                <!-- Contact Tutor Button -->
                <v-col cols="auto">
                  <v-btn
                    class="text-white"
                    :loading="loading[tutor.id] || false"
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
                <v-col cols="auto" class="d-flex justify-end align-center">
                  <v-rating
                    :model-value="tutor.rating"
                    :length="5"
                    :size="28"
                    color="grey-lighten-1"
                    active-color="teal-darken-2"
                    readonly
                    half-increments
                  />
                  <span class="ml-2 text-caption text-grey-400">
                    ({{ tutor.rating }} / 5 - {{ tutor.reviewCount }} reviews)
                  </span>
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

.clickable {
  cursor: pointer;
  transition: color 0.3s ease;
}

.clickable:hover {
  color: #80cbc4 !important;
}

.tutor-card {
  min-height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
