<script setup>
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { ref, onMounted, computed } from 'vue'
import { supabase } from '@/utils/supabase'
import { useRouter } from 'vue-router'

const router = useRouter()
const searchQuery = ref('')
const users = ref([]) 
const loading = ref(false)


const fetchUsers = async () => {
  loading.value = true
  try {
    const { data: usersData, error: usersError } = await supabase
      .from('users')
      .select('*') 
      .is('availability', true) 

    if (usersError) {
      console.error('Error fetching users:', usersError)
      return
    }

    users.value = usersData
  } catch (error) {
    console.error('Unexpected error:', error)
  } finally {
    loading.value = false
  }
}

const filteredUsers = computed(() =>
  users.value.filter((user) =>
    `${user.firstname} ${user.lastname} ${user.bio} ${user.expertise}`
      .toLowerCase()
      .includes(searchQuery.value.toLowerCase())
  )
)

const sendEmail = (recipientEmail, user) => {
  const subject = encodeURIComponent('Connection Request')
  const body = encodeURIComponent(`Hi ${user.firstname},

I'm interested in connecting with you.

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

const navigateToUserProfile = (userId) => {
  router.push({
    name: 'user-profile', 
    params: { userId: userId }
  })
}

onMounted(() => {
  fetchUsers()
})

const openChat = async (user) => {
  try {
    const userId = localStorage.getItem('user_id')

    if (!userId) {
      console.error('User  ID not found in local storage.')
      return
    }

    localStorage.setItem('sender_id', userId)
    localStorage.setItem('recipient_id', user.id)

    const { error: messageError } = await supabase
      .from('messages')
      .insert({
        sender_id: userId,
        recipient_id: user.id,
        content: `Hello ${user.firstname}, I would like to connect with you.` 
      })
      .select()
      .single()

    if (messageError) {
      console.error('Error sending message:', messageError)
      return
    }

    router.push('/adminchat')
  } catch (error) {
    console.error('Unexpected error:', error)
  }
}
</script>

<template>
  <AdminLayout @search-query="searchQuery=$event">
    <template #content>
      <v-container fluid class="d-flex flex-column">
        <v-row class="py-10">
          <v-col
            v-for="user in filteredUsers"
            :key="user.user_id"
            cols="12"
            md="6"
            class="d-flex"
          >
            <v-card
              color="#004D40"
              class="user-card d-flex flex-column"
              style="border-radius: 20px; padding: 16px; width: 100%"
            >
              <v-row class="mb-4" align="center">
                <v-col cols="auto">
                  <v-avatar size="64">
                    <v-img
                      :src="user.avatar"
                      class="clickable"
                      @click="navigateToUserProfile(user.user_id)"
                    ></v-img>
                  </v-avatar>
                </v-col>
                <v-col>
                  <div>
                    <h3
                      class="text-h5 text-white mb-1 clickable"
                      @click="navigateToUserProfile(user.user_id)"
                    >
                      {{ user.firstname }} {{ user.lastname }}
                    </h3>
                    <p class="text-body-2 text-grey-400">{{ user.role }}</p>
                  </div>
                </v-col>

                <v-col cols="auto" class="d-flex justify-end">
                  <v-btn
                    icon="mdi-email"
                    text
                    color="teal-lighten-3"
                    density="compact"
                    @click="sendEmail(user.email, user)"
                    class="ma-1"
                  ></v-btn>
                  <v-btn
                    icon="mdi-facebook"
                    text
                    color="teal-lighten-3"
                    density="compact"
                    @click="openLink(user.social_links1)"
                    class="ma-1"
                  ></v-btn>
                  <v-btn
                    icon="mdi-linkedin"
                    text
                    color="teal-lighten-3"
                    density="compact"
                    @click="openLink(user.social_links2)"
                    class="ma-1"
                  ></v-btn>
                </v-col>
              </v-row>

              <v-container class="py-2 px-0 flex-grow-1">
                <p class="text-body-1 text-grey-300 mb-3" style="min-height: 60px">
                  {{ user.bio || 'No bio available' }}
                </p>
              </v-container>

              <v-row class="mb-3" justify="start">
                <v-col cols="12">
                  <v-chip-group column>
                    <v-chip
                      v-for="(item, index) in user.expertise"
                      :key="index"
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

              <v-row align="center" class="mt-auto">
                <v-col cols="auto">
                  <v-btn
                    class="text-white"
                    color="teal-darken-2"
                    size="small"
                    variant="elevated"
                    block
                    elevation="10"
                    style="border-radius: 30px; height: 40px"
                    append-icon="mdi-phone-plus"
                    @click="openChat(user)"
                  >
                    Contact User
                  </v-btn>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </AdminLayout>
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
  color: #e3f2fd;
}

.text-white {
  color: white;
}

.v-avatar {
  border-radius: 50%;
}

.user-card {
  display: flex;
  flex-direction: column;
}
</style>