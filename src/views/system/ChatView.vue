<script setup>
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { supabase } from '@/utils/supabase'
import HomeLayout from '@/components/layout/HomeLayout.vue'

const contacts = ref([])
const filteredContacts = ref([])
const messages = ref([])
const newMessage = ref('')
const selectedContact = ref(null)
const loadingContacts = ref(true)
const loadingMessages = ref(false)

const unreadMessages = ref(0)
const chatMessagesRef = ref(null)
const searchVisible = ref(false)
const searchQuery = ref('')

const notification = ref({
  message: '',
  type: '', // 'success', 'error', 'warning'
  show: false
})

const showNotification = (message, type = 'info') => {
  notification.value = {
    message,
    type,
    show: true
  }

  // Auto-hide notification after 3 seconds
  setTimeout(() => {
    notification.value.show = false
  }, 3000)
}

const scrollToBottom = async () => {
  await nextTick()
  if (chatMessagesRef.value) {
    const lastMessage = chatMessagesRef.value.lastElementChild
    if (lastMessage) {
      lastMessage.scrollIntoView({
        behavior: 'smooth',
        block: 'end'
      })
    }
  }
}

watch(messages, () => {
  scrollToBottom()
})

const initializeScroll = async () => {
  await nextTick()
  scrollToBottom()
}

const senderId = parseInt(localStorage.getItem('sender_id'))

const fetchMessages = async () => {
  if (!selectedContact.value || !senderId) {
    return
  }

  loadingMessages.value = true

  const recipientId = selectedContact.value.id
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .or(`sender_id.eq.${senderId},recipient_id.eq.${senderId}`)
    .or(`sender_id.eq.${recipientId},recipient_id.eq.${recipientId}`)
    .order('created_at', { descending: false })
    .limit(50)

  loadingMessages.value = false

  if (error) {
    console.error('Error fetching messages:', error)
  } else {
    messages.value = data
  }
}

const sendMessage = async () => {
  if (!selectedContact.value) {
    showNotification('Please select a contact before sending a message.', 'warning')
    return
  }

  if (selectedContact.value && selectedContact.value.id && newMessage.value && senderId) {
    try {
      const recipientId = selectedContact.value.id
      const { error } = await supabase.from('messages').insert([
        {
          sender_id: senderId,
          recipient_id: recipientId,
          content: newMessage.value
        }
      ])

      if (error) throw error

      showNotification('Message sent successfully!', 'success')
      newMessage.value = ''
      await fetchMessages()
    } catch (error) {
      console.error('Error sending message:', error)
      showNotification('Failed to send message. Please try again.', 'error')
    }
  } else {
    showNotification('Unable to send message. Please check your input.', 'warning')
  }
}

const isMyMessage = (senderId, messageSenderId) => {
  return senderId === messageSenderId
}

const setupRealtimeSubscription = () => {
  const channel = supabase
    .channel('custom-all-channel')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, (payload) => {
      if (payload.new.recipient_id === senderId) {
        if (!selectedContact.value || payload.new.sender_id !== selectedContact.value.id) {
          unreadMessages.value += 1
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('New Message', {
              body: `You have a new message from ${payload.new.sender_firstname}`,
              icon: payload.new.sender_avatar
            })
          }
        }
        fetchContacts()
      }
      if (
        selectedContact.value &&
        (payload.new.sender_id === selectedContact.value.id ||
          payload.new.recipient_id === selectedContact.value.id)
      ) {
        fetchMessages()
      }
    })
    .subscribe()

  return channel
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

    const contactLatestMessages = new Map()

    messages.forEach((message) => {
      const otherUserId = message.sender_id === senderId ? message.recipient_id : message.sender_id

      if (!contactLatestMessages.has(otherUserId)) {
        contactLatestMessages.set(otherUserId, {
          content: message.content,
          created_at: message.created_at
        })
      }
    })

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

    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, firstname, avatar, lastname')
      .in('id', uniqueUserIds)

    if (usersError) {
      console.error('Error fetching users:', usersError)
      loadingContacts.value = false
      return
    }

    const processedContacts = users.map((user) => ({
      ...user,
      latestMessage: contactLatestMessages.get(user.id)?.content || 'No messages yet',
      lastMessageTime: contactLatestMessages.get(user.id)?.created_at
    }))

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

const filterContacts = () => {
  if (!searchQuery.value) {
    filteredContacts.value = contacts.value
  } else {
    filteredContacts.value = contacts.value.filter((contact) =>
      contact.firstname.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }
}

watch(searchQuery, (newValue) => {
  if (!newValue) {
    filteredContacts.value = contacts.value
  }
})

const toggleSearch = () => {
  searchVisible.value = !searchVisible.value
}

onMounted(async () => {
  await fetchContacts()
  fetchMessages()
  const channel = setupRealtimeSubscription()

  onUnmounted(() => {
    if (channel) {
      supabase.removeChannel(channel)
    }
  })
  if ('Notification' in window) {
    Notification.requestPermission()
  }
})

const selectContact = (contact) => {
  selectedContact.value = contact
  fetchMessages()
  initializeScroll()
}
</script>

<template>
  <HomeLayout>
    <template #content>
      <v-container fluid class="chat-container">
        <v-row class="full-height py-10">
          <!-- Contacts Column -->
          <v-col cols="12" sm="4" class="contacts-column">
            <v-card class="contacts-card elevation-2 rounded-lg">
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
                    @click="selectContact(contact)"
                    :class="{
                      'active-contact': selectedContact && selectedContact.id === contact.id
                    }"
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
                      {{ contact.firstname }} {{ contact.lastname }}
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
          </v-col>

          <!-- Chat Window Column -->
          <v-col cols="12" sm="8" class="chat-window-column">
            <v-card v-if="selectedContact" class="chat-card elevation-1 d-flex flex-column">
              <!-- Chat Header -->
              <v-card-title class="chat-header py-3 d-flex align-center">
                <v-avatar size="40" class="mr-3">
                  <v-img
                    :src="selectedContact.avatar || '/default-avatar.png'"
                    :alt="selectedContact.firstname"
                    cover
                  />
                </v-avatar>
                <div class="d-flex flex-column">
                  <div class="font-weight-bold text-h6">
                    {{ selectedContact.firstname }} {{ selectedContact.lastname }}
                  </div>
                </div>
                <v-spacer />
              </v-card-title>

              <!-- Chat Messages -->
              <v-card-text
                ref="chatMessagesRef"
                class="chat-messages flex-grow-1 overflow-y-auto pa-4"
                style="max-height: calc(100vh - 250px); overflow-y: auto"
              >
                <div class="messages-container">
                  <template v-if="loadingMessages">
                    <v-skeleton-loader
                      v-for="n in 5"
                      :key="n"
                      type="list-item-avatar-two-line"
                      class="mb-2"
                    />
                  </template>
                  <template v-else-if="messages.length">
                    <div
                      v-for="message in messages"
                      :key="message.id"
                      class="message-wrapper"
                      :class="{
                        'message-sent': isMyMessage(senderId, message.sender_id),
                        'message-received': !isMyMessage(senderId, message.sender_id)
                      }"
                    >
                      <v-avatar
                        v-if="!isMyMessage(senderId, message.sender_id)"
                        size="32"
                        class="mr-2"
                      >
                        <v-img
                          :src="selectedContact.avatar || '/default-avatar.png'"
                          :alt="selectedContact.firstname"
                        />
                      </v-avatar>
                      <div class="message-bubble">
                        <div class="message-content">
                          {{ message.content }}
                        </div>
                        <div class="message-time">
                          {{
                            new Date(message.created_at).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })
                          }}
                        </div>
                      </div>
                    </div>
                  </template>
                  <v-alert v-else type="info" class="text-center">
                    No messages in this conversation
                  </v-alert>
                </div>
              </v-card-text>
              <!-- Message Input -->
              <v-card-actions class="message-input-area py-2 px-4">
                <v-text-field
                  v-model="newMessage"
                  placeholder="Type a message"
                  single-line
                  hide-details
                  class="flex-grow-1"
                  @keyup.enter="sendMessage"
                >
                  <template #append>
                    <v-btn icon :disabled="!newMessage" @click="sendMessage">
                      <v-icon>mdi-send</v-icon>
                    </v-btn>
                  </template>
                </v-text-field>
              </v-card-actions>
            </v-card>

            <v-sheet v-else class="d-flex flex-column align-center justify-center full-height">
              <v-icon size="100" color="grey lighten-2">mdi-message-outline</v-icon>
              <h3 class="text-h6 mt-4 grey--text text--darken-1">
                Select a chat to start messaging
              </h3>
            </v-sheet>
          </v-col>
        </v-row>
      </v-container>

      <!-- Notification Component -->
      <v-snackbar
        v-model="notification.show"
        :color="
          notification.type === 'success'
            ? 'green'
            : notification.type === 'error'
              ? 'red'
              : notification.type === 'warning'
                ? 'orange'
                : 'info'
        "
        timeout="3000"
      >
        {{ notification.message }}
        <template v-slot:action="{ attrs }">
          <v-btn text v-bind="attrs" @click="notification.show = false"> Close </v-btn>
        </template>
      </v-snackbar>
    </template>
  </HomeLayout>
</template>

<style scoped>
.chat-container {
  height: 100vh;
  max-height: 100vh;
  overflow: hidden;
}

.full-height {
  height: 100%;
}

.contacts-column {
  border-right: 1px solid rgba(0, 0, 0, 0.1);
}

.contacts-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.chat-window-column {
  display: flex;
  flex-direction: column;
}

.chat-card {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.chat-header {
  background-color: #f5f5f5;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.chat-messages {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
}

.chat-messages::-webkit-scrollbar {
  width: 6px;
}

.chat-messages::-webkit-scrollbar-track {
  background: transparent;
}

.chat-messages::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
}

.messages-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-bottom: 20px;
}

.message-wrapper {
  display: flex;
  width: 100%;
  align-items: flex-end;
}

.message-bubble {
  max-width: 70%;
  padding: 10px;
  border-radius: 15px;
  position: relative;
}

.message-sent {
  justify-content: flex-end;
}

.message-sent .message-bubble {
  background-color: #d1f7d6;
  margin-left: auto;
}

.message-received {
  justify-content: flex-start;
}

.message-received .message-bubble {
  background-color: #f1f1f1;
  margin-right: auto;
}

.message-content {
  word-wrap: break-word;
}

.message-time {
  font-size: 0.75rem;
  color: #888;
  margin-top: 5px;
  text-align: right;
}

.active-contact {
  background-color: #e0f7fa;
}

.v-list-item {
  transition: background-color 0.3s;
}

.v-list-item:hover {
  background-color: #f0f0f0;
}

.v-btn {
  transition: background-color 0.3s;
}

.v-btn:hover {
  background-color: #1976d2;
}
</style>
