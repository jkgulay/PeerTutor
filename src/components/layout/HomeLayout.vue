<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/utils/supabase'

const searchQuery = ref('')
const drawer = ref(false)
const toggleDrawer = () => {
  drawer.value = !drawer.value
}
const searchVisible = ref(false)
const loadingContacts = ref(false)
const contacts = ref([])
const filteredContacts = ref([])

const openChatDialog = async () => {
  dialog.value = true
  await fetchContacts()
}

const toggleSearch = () => {
  searchVisible.value = !searchVisible.value
}

const filterContacts = () => {
  if (!searchQuery.value) {
    filteredContacts.value = contacts.value
  } else {
    filteredContacts.value = contacts.value.filter((contact) =>
      contact.firstname.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }
}

const startChat = (contact) => {
  // Close the dialog
  dialog.value = false

  // Navigate to ChatView with the selected contact
  router.push({
    name: 'messages',
    params: {
      contactId: contact.id,
      contactName: contact.firstname
    }
  })
}

const fetchContacts = async () => {
  loadingContacts.value = true

  const senderId = parseInt(localStorage.getItem('sender_id'))

  if (!senderId) {
    console.error('Sender ID not found in localStorage')
    loadingContacts.value = false
    return
  }

  try {
    // Fetch all messages involving the sender with latest message details
    const { data: messages, error: messagesError } = await supabase
      .from('messages')
      .select(
        `
            id, 
            sender_id, 
            recipient_id, 
            content, 
            created_at
          `
      )
      .or(`sender_id.eq.${senderId},recipient_id.eq.${senderId}`)
      .order('created_at', { ascending: false })

    if (messagesError) {
      console.error('Error fetching messages:', messagesError)
      loadingContacts.value = false
      return
    }

    // Create a map to store the latest message for each contact
    const contactLatestMessages = new Map()

    messages.forEach((message) => {
      // Determine the other user in the conversation
      const otherUserId = message.sender_id === senderId ? message.recipient_id : message.sender_id

      // Store the latest message for this contact if not already stored
      if (!contactLatestMessages.has(otherUserId)) {
        contactLatestMessages.set(otherUserId, {
          content: message.content,
          created_at: message.created_at
        })
      }
    })

    // Get unique user IDs who have messaged
    const uniqueUserIds = [
      ...new Set(messages.map((m) => (m.sender_id === senderId ? m.recipient_id : m.sender_id)))
    ].filter((id) => id !== senderId)

    if (uniqueUserIds.length === 0) {
      console.warn('No contacts found who have messaged you.')
      contacts.value = []
      filteredContacts.value = []
      loadingContacts.value = false
      return
    }

    // Fetch user details for these contacts
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, firstname, avatar')
      .in('id', uniqueUserIds)

    if (usersError) {
      console.error('Error fetching users:', usersError)
      loadingContacts.value = false
      return
    }

    // Attach latest message to each contact
    const processedContacts = users.map((user) => ({
      ...user,
      latestMessage: contactLatestMessages.get(user.id)?.content || 'No messages yet',
      lastMessageTime: contactLatestMessages.get(user.id)?.created_at
    }))

    // Sort contacts by most recent message
    processedContacts.sort((a, b) => {
      if (!a.lastMessageTime) return 1
      if (!b.lastMessageTime) return -1
      return new Date(b.lastMessageTime) - new Date(a.lastMessageTime)
    })

    contacts.value = processedContacts
    filteredContacts.value = processedContacts
  } catch (err) {
    console.error('An unexpected error occurred:', err)
  } finally {
    loadingContacts.value = false
  }
}



const dialog = ref(false)
const router = useRouter()

const onLogout = async () => {
  try {
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error('Error during logout:', error.message)
      return
    }

    localStorage.clear()
    sessionStorage.clear()

    router.replace({ name: 'login' })
  } catch (err) {
    console.error('Unexpected error during logout:', err)
  }
}

const userProfile = ref({
  user_id: '',
  firstname: '',
  lastname: '',
  email: '',
  avatar: '',
  role: '',
  bio: '',
  expertise: [],
  availability: ''
})

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
      .select('user_id, firstname, lastname, email, avatar, role, bio, expertise, availability')
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
        avatar: data.avatar || 'https://randomuser.me/api/portraits/lego/1.jpg',
        role: data.role || '',
        bio: data.bio || '',
        expertise: data.expertise || '',
        availability: data.availability || ''
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
  <v-responsive>
    <v-app>
      <!-- App Bar -->
      <v-app-bar
        style="background: linear-gradient(#05161a, #072e33)"
        elevation="8"
        app
        color="primary"
      >
        <v-app-bar-nav-icon @click="toggleDrawer"></v-app-bar-nav-icon>

        <v-col class="d-flex align-center">
      <v-img src="/logo/try2.png" max-width="50"></v-img>
      <v-app-bar-title class="pl-2">
        <RouterLink to="/home" style="text-decoration: none">
          <span class="font-weight-bold" style="color: #80cbc4">PeerTutor</span>
        </RouterLink>
      </v-app-bar-title>
    </v-col>

    <v-col cols="5" class="d-flex justify-center">
      <v-text-field
        v-model="searchQuery"
        append-inner-icon="mdi-magnify"
        density="compact"
        label="Search"
        variant="solo"
        hide-details
        single-line
        class="mx-4"
        style="max-width: 400px; width: 100%"
        @input="$emit('search-query', searchQuery)"
      ></v-text-field>
    </v-col>

    <v-spacer></v-spacer>

    <v-btn icon @click="openChatDialog">
      <v-icon>mdi-chat</v-icon>
    </v-btn>
    <v-dialog v-model="dialog" max-width="450" scrollable>
      <v-card class="elevation-2 rounded-lg" >
        <v-card-title class="d-flex align-center pa-4">
          <h2 class="text-h5 font-weight-bold">Chats</h2>
          <v-spacer />
          <v-btn icon @click="toggleSearch">
            <v-icon>mdi-magnify</v-icon>
          </v-btn>
        </v-card-title>

        <v-divider></v-divider>

        <!-- Search Input -->
        <v-expand-transition>
          <div v-if="searchVisible" class="px-4 pb-2">
            <v-text-field
              v-model="searchQuery"
              variant="outlined"
              density="compact"
              placeholder="Search contacts"
              prepend-inner-icon="mdi-magnify"
              hide-details
              clearable
              @input="filterContacts"
            ></v-text-field>
          </div>
        </v-expand-transition>

        <v-list class="py-0">
          <template v-if="loadingContacts">
            <v-list-item v-for="n in 5" :key="n">
              <v-list-item-avatar>
                <v-skeleton-loader type="avatar"></v-skeleton-loader>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-skeleton-loader type="text"></v-skeleton-loader>
              </v-list-item-content>
            </v-list-item>
          </template>
          <template v-else-if="filteredContacts.length">
            <v-list-item
              v-for="contact in filteredContacts"
              :key="contact.id"
              @click="startChat(contact)"
              class="contact-item"
            >
              <template #prepend>
                <v-avatar size="48" class="mr-3">
                  <v-img
                    :src="contact.avatar || '/default-avatar.png'"
                    :alt="contact.firstname"
                    cover
                  />
                </v-avatar>
              </template>

              <v-list-item-title class="font-weight-medium">
                {{ contact.firstname }}
              </v-list-item-title>
              <v-list-item-subtitle class="text-truncate">
                {{ contact.latestMessage || 'No recent messages' }}
              </v-list-item-subtitle>

              <template #append>
                <v-chip v-if="contact.unreadCount" size="small" color="primary">
                  {{ contact.unreadCount }}
                </v-chip>
              </template>
            </v-list-item>
          </template>
          <v-alert v-else type="info" class="ma-3"> No conversations yet </v-alert>
        </v-list>
      </v-card>
    </v-dialog>
  </v-app-bar>

      <!-- Main Content Layout -->
      <v-layout row>
        <v-navigation-drawer
          v-model="drawer"
          app
          permanent
          expand-on-hover
          rail
          class="py-14 text-white"
          style="
            background-color: #05161a;
            position: fixed;
            top: 0;
            left: 0;
            height: 100vh;
            z-index: 1000;
          "
        >
          <v-list>
            <v-list-item
              :prepend-avatar="
                userProfile.avatar || 'https://randomuser.me/api/portraits/men/91.jpg'
              "
              :title="
                userProfile.firstname
                  ? `${userProfile.firstname} ${userProfile.lastname}`
                  : 'Anonymous User'
              "
              :subtitle="userProfile.email || 'No email provided'"
            ></v-list-item>
          </v-list>

          <v-divider></v-divider>

          <v-list density="compact" nav>
            <v-list-item prepend-icon="mdi-home" class="clickable">
              <RouterLink class="text-white text-decoration-none" to="/home">Home</RouterLink>
            </v-list-item>
            <v-list-item prepend-icon="mdi-account-box" class="clickable">
              <RouterLink class="text-white text-decoration-none" to="/profile">Profile</RouterLink>
            </v-list-item>
            <v-list-item prepend-icon="mdi-message" class="clickable">
              <RouterLink class="text-white text-decoration-none" to="/messages"
                >Messages</RouterLink
              >
            </v-list-item>
            <!-- Logout Button -->
            <v-list-item prepend-icon="mdi-logout" @click="onLogout" class="clickable">
              <span class="text-white">Logout</span>
            </v-list-item>
          </v-list>
        </v-navigation-drawer>

        <!-- Content and Card Section -->
        <v-main>
          <v-container>
            <slot name="content"></slot>
          </v-container>
        </v-main>
      </v-layout>

      <!-- Footer -->
      <v-footer
        position="relative"
        height="auto"
        style="background: linear-gradient(#072e33, #05161a)"
      >
        <v-row justify="center">
          <v-col class="text-center mt-4" cols="12" style="color: #26a69a">
            {{ new Date().getFullYear() }} — <strong>Kayel</strong>
          </v-col>
        </v-row>
      </v-footer>
    </v-app>
  </v-responsive>
</template>

<style scoped>
.clickable {
  cursor: pointer;
  transition: color 0.3s ease;
}

.clickable:hover {
  color: #80cbc4 !important;
}


</style>
