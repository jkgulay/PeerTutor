<script setup>
import HomeLayout from '@/components/layout/HomeLayout.vue'
import { ref, onMounted, computed } from 'vue'
import { supabase } from '@/utils/supabase'

const searchQuery = ref('')
const tutors = ref([])
const loading = ref(false)
const selectedExpertise = ref([])

const fetchTutors = async () => {
  loading.value = true
  const { data, error } = await supabase
    .from('users')
    .select(
      'user_id, firstname, lastname, email, avatar, occupation, bio, role, rating, social_links1, social_links2, availability, expertise'
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

onMounted(() => {
  fetchTutors()
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
                    @click="openLink(tutor.email)"
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
