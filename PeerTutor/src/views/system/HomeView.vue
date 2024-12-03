<script setup>
import HomeLayout from '@/components/layout/HomeLayout.vue'
import { ref, onMounted } from 'vue'
import { supabase } from '@/utils/supabase'

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
  <HomeLayout>
    <template #content>
      <v-container fluid>
        <v-row class="py-10">
          <v-col v-for="tutor in tutors" :key="tutor.user_id" cols="12" md="6">
            <v-card color="#05161a" style="border-radius: 20px">
              <!-- Tutor Information and Social Media Icons -->
              <v-row class="mx-2 mt-2" align="center">
                <!-- Avatar -->
                <v-col cols="auto">
                  <v-avatar>
                    <v-img :src="tutor.avatar"></v-img>
                  </v-avatar>
                </v-col>
                <v-col>
                  <div>
                    <h3>{{ tutor.firstname }} {{ tutor.lastname }}</h3>
                    <p>{{ tutor.occupation }}</p>
                  </div>
                </v-col>

                <!-- Social Media Icons -->
                <v-col cols="auto" class="d-flex justify-end">
                  <v-btn
                    icon="mdi-gmail"
                    text
                    color="#05161a"
                    density="compact"
                    @click="openLink(tutor.email)"
                  ></v-btn>
                  <v-btn
                    icon="mdi-facebook"
                    text
                    color="#05161a"
                    density="compact"
                    @click="openLink(tutor.social_links1)"
                  ></v-btn>
                  <v-btn
                    icon="mdi-linkedin"
                    text
                    color="#05161a"
                    density="compact"
                    @click="openLink(tutor.social_links2)"
                  ></v-btn>
                </v-col>
              </v-row>

              <!-- Description Section -->
              <v-container class="mt-2">
                <p>
                  {{ tutor.bio }}
                </p>
              </v-container>
              <v-row class="mx-2" align="center">
                <v-col cols="auto">
                  <v-chip-group column>
                    <v-chip
                      v-for="(item, index) in tutor.expertise"
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
              <!-- Button and Rating Section -->
              <v-row class="mx-2 mb-2" align="center">
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
                    style="border-radius: 30px"
                    height="40px"
                    append-icon="mdi-phone-plus"
                    @click="openChat(tutor)"
                  >
                    Contact Tutor
                  </v-btn>
                </v-col>

                <v-col cols="auto" class="d-flex justify-end">
                  <v-rating
                    hover
                    :length="5"
                    :size="32"
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
