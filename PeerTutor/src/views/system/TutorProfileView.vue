<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { supabase } from '@/utils/supabase'
import HomeLayout from '@/components/layout/HomeLayout.vue'

const route = useRoute()
const router = useRouter()

// Reactive References
const ratingDialog = ref(false)
const ratingValue = ref(0)
const reviewText = ref('')
const currentUser = ref(null)
const averageRating = ref(0)

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

// Open Rating Dialog
const openRatingDialog = () => {
  ratingDialog.value = true
}

const fetchCurrentUser = async () => {
  const {
    data: { user }
  } = await supabase.auth.getUser()

  console.log('Authenticated User:', user)

  if (user) {
    const { data, error } = await supabase
      .from('users')
      .select('id, firstname, lastname, user_id')
      .eq('email', user.email)
      .single()

    console.log('User Data:', data)
    console.log('User Fetch Error:', error)

    if (data) {
      currentUser.value = data
    }
  }
}

const submitRating = async () => {
  console.log('Current User:', currentUser.value)
  console.log('Tutor Profile:', tutorProfile.value)

  if (!currentUser.value) {
    alert('Please log in to submit a rating')
    return
  }

  try {
    // Use the internal ID for database operations
    const tutorId = tutorProfile.value?.id
    const reviewerId = currentUser.value?.id

    console.log('Tutor Internal ID:', tutorId)
    console.log('Reviewer Internal ID:', reviewerId)

    // Validate IDs are not empty or undefined
    if (!tutorId || !reviewerId) {
      throw new Error(`Invalid tutor or reviewer ID. Tutor: ${tutorId}, Reviewer: ${reviewerId}`)
    }

    // Validate tutor and reviewer exist
    const { data: tutorCheck } = await supabase
      .from('users')
      .select('id, role')
      .eq('id', tutorId)
      .eq('role', 'Tutor')
      .single()

    const { data: reviewerCheck } = await supabase
      .from('users')
      .select('id')
      .eq('id', reviewerId)
      .single()

    console.log('Tutor Check:', tutorCheck)
    console.log('Reviewer Check:', reviewerCheck)

    if (!tutorCheck || !reviewerCheck) {
      throw new Error('Tutor or reviewer not found or invalid')
    }

    const roundedRating = Math.round(ratingValue.value * 2) / 2

    if (roundedRating < 0 || roundedRating > 5) {
      alert('Rating must be between 0 and 5')
      return
    }

    const reviewData = {
      tutor_id: tutorId,
      reviewer_id: reviewerId,
      rating: roundedRating,
      review_text: reviewText.value || null
    }

    // Check for existing review using .eq() multiple times
    const { data: existingReview, error: checkError } = await supabase
      .from('reviews')
      .select('*')
      .eq('tutor_id', tutorId)
      .eq('reviewer_id', reviewerId)
      .maybeSingle() // Use maybeSingle to handle no results without throwing an error

    console.log('Existing Review:', existingReview)
    console.log('Check Error:', checkError)

    let result
    if (existingReview) {
      // Update existing review
      result = await supabase
        .from('reviews')
        .update(reviewData)
        .eq('tutor_id', tutorId)
        .eq('reviewer_id', reviewerId)
    } else {
      // Insert new review
      result = await supabase.from('reviews').insert(reviewData)
    }

    // Check for insertion/update errors
    if (result.error) {
      throw result.error
    }

    // Recalculate average rating
    await calculateAverageRating()

    // Reset form
    ratingDialog.value = false
    ratingValue.value = 0
    reviewText.value = ''

    alert('Rating submitted successfully!')
  } catch (error) {
    console.error('Error submitting rating:', error)
    alert(`Failed to submit rating: ${error.message}`)
  }
}

const calculateAverageRating = async () => {
  try {
    const tutorId = tutorProfile.value?.id

    if (!tutorId) {
      console.warn('Invalid tutor ID for average rating', tutorId)
      averageRating.value = 0
      return
    }

    console.log('Calculating average rating for Tutor ID:', tutorId)

    const { data, error, count } = await supabase
      .from('reviews')
      .select('rating', { count: 'exact' })
      .eq('tutor_id', tutorId)

    console.log('Reviews Data:', data)
    console.log('Reviews Count:', count)
    console.log('Reviews Error:', error)

    if (error) {
      console.error('Error fetching reviews for average rating:', error)
      averageRating.value = 0
      return
    }

    if (data && data.length > 0) {
      const totalRating = data.reduce((sum, review) => sum + review.rating, 0)
      const avgRating = totalRating / data.length

      console.log('Total Rating:', totalRating)
      console.log('Number of Reviews:', data.length)
      console.log('Calculated Average Rating:', avgRating)

      averageRating.value = Number(avgRating.toFixed(1))
    } else {
      console.log('No reviews found for this tutor')
      averageRating.value = 0
    }
  } catch (error) {
    console.error('Unexpected error in calculateAverageRating:', error)
    averageRating.value = 0
  }
}

const fetchTutorProfile = async () => {
  try {
    const routeUserId = route.params.userId

    console.log('Route User ID:', routeUserId)

    const { data: userIdData, error: userIdError } = await supabase
      .from('users')
      .select('id')
      .eq('user_id', routeUserId)
      .single()

    console.log('User ID Data:', userIdData)
    console.log('User ID Error:', userIdError)

    if (userIdError) {
      console.error('Error finding user:', userIdError)
      router.replace('/home')
      return
    }

    if (!userIdData) {
      console.error('No user found with the given ID')
      router.replace('/home')
      return
    }

    const { data, error } = await supabase
      .from('users')
      .select(
        'id, user_id, firstname, lastname, email, avatar, occupation, role, bio, expertise, background, availability, social_links1, social_links2'
      )
      .eq('id', userIdData.id)
      .eq('role', 'Tutor')
      .single()

    console.log('Tutor Profile Fetch Data:', data)
    console.log('Tutor Profile Fetch Error:', error)

    if (error) {
      console.error('Error fetching tutor profile:', error)
      router.replace('/home')
      return
    }

    if (data) {
      tutorProfile.value = {
        user_id: data.user_id, // Use the external user_id
        id: data.id,
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
      await calculateAverageRating()

      console.log('Updated Tutor Profile:', tutorProfile.value)
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
  fetchCurrentUser()
  calculateAverageRating()
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
              <v-img :src="tutorProfile.avatar || 'default-avatar-url'" alt="Profile Image"></v-img>
            </v-avatar>
            <div class="profile-info">
              <h2 class="profile-name">{{ tutorProfile.firstname }} {{ tutorProfile.lastname }}</h2>
              <h3 class="profile-job">{{ tutorProfile.occupation }}</h3>
              <p class="profile-bio">{{ tutorProfile.bio }}</p>
            </div>
          </v-container>

          <v-card-text class="profile-details pa-4">
            <v-row class="profile-settings mb-4" justify="center">
              <v-col cols="12" md="4" class="mb-2">
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

              <v-col cols="12" md="4" class="mb-2">
                <v-btn
                  block
                  color="teal-darken-2"
                  rounded
                  large
                  elevation="2"
                  class="text-none font-weight-regular"
                  prepend-icon="mdi-star"
                  @click="openRatingDialog"
                >
                  Rate ({{ averageRating.toFixed(1) }})
                </v-btn>
                <!-- Rating Dialog -->
                <v-dialog v-model="ratingDialog" max-width="500">
                  <v-card>
                    <v-card-title>Rate This Tutor</v-card-title>
                    <v-card-text>
                      <!-- Rating Input -->
                      <v-rating
                        v-model="ratingValue"
                        color="teal-darken-2"
                        half-increments
                        hover
                        :length="5"
                        :size="50"
                      ></v-rating>

                      <!-- Review Text Area -->
                      <v-textarea
                        v-model="reviewText"
                        label="Write a review (optional)"
                        variant="outlined"
                        rows="3"
                        class="mt-4"
                      ></v-textarea>
                    </v-card-text>

                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="grey" text @click="ratingDialog = false"> Cancel </v-btn>
                      <v-btn
                        color="teal-darken-2"
                        text
                        @click="submitRating"
                        :disabled="ratingValue === 0"
                      >
                        Submit Rating
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-col>
              <v-col cols="12" md="2" class="mb-2">
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
  min-height: 400px;
  min-width: 80%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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
  border: 4px solid rgb(3, 71, 73);
}

.profile-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
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
  padding: 10px;
  text-align: center;
  color: #9e9e9e;
  font-style: italic;
  max-width: 85%;
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
