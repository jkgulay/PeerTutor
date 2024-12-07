<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { supabase } from '@/utils/supabase' // Supabase is preconfigured

// Reactive state variables
const contacts = ref([]) // To store the list of users (contacts)
const messages = ref([]) // To store the messages for the selected contact
const newMessage = ref('') // To hold the input value for the new message
const selectedContact = ref(null) // To track the currently selected contact

// Get the sender's ID from localStorage
const senderId = parseInt(localStorage.getItem('sender_id'))

// Method to fetch messages for the selected contact
const fetchMessages = async () => {
  const recipientId = localStorage.getItem('recipient_id')
  if (selectedContact.value && senderId && recipientId) {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('sender_id', senderId)
      .eq('recipient_id', selectedContact.value.id)

    if (error) {
      console.error('Error fetching messages:', error)
    } else {
      messages.value = data
    }
  }
}

// Method to send a new message
const sendMessage = async () => {
  const recipientId = selectedContact.value.id
  if (newMessage.value && senderId && recipientId) {
    // Insert message into the database
    const { error } = await supabase.from('messages').insert([
      {
        sender_id: senderId,
        recipient_id: recipientId,
        content: newMessage.value
      }
    ])

    if (error) {
      console.error('Error sending message:', error)
    } else {
      // Clear the input field
      newMessage.value = ''
    }
  }
}

// Computed property to determine if the message is from the current user
const isMyMessage = (senderId, messageSenderId) => {
  return senderId === messageSenderId
}

// Set up real-time subscription to listen for changes in the 'messages' table for the selected contact
const setupRealtimeSubscription = () => {
  const channel = supabase
    .channel('custom-all-channel')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, (payload) => {
      if (
        payload.new.sender_id === selectedContact.value.id ||
        payload.new.recipient_id === selectedContact.value.id
      ) {
        console.log('Change received!', payload)
        fetchMessages() // Fetch messages again when a change occurs for the selected contact
      }
    })
    .subscribe()

  // Return the channel so we can unsubscribe later
  return channel
}

// Method to fetch contacts (users) and the latest message for each contact
const fetchContacts = async () => {
  const recipientId = localStorage.getItem('recipient_id')

  // Fetch contacts (users) where sender_id matches recipient_id (the logged-in user's contacts)
  const { data, error } = await supabase
    .from('messages')
    .select('sender_id')
    .eq('recipient_id', recipientId)

  if (error) {
    console.error('Error fetching contacts:', error)
  } else {
    // Fetch user data (name, avatar) for each unique sender_id
    const senderIds = data.map((message) => message.sender_id)
    const { data: users, error: userError } = await supabase
      .from('users')
      .select('id, firstname, avatar')

    if (userError) {
      console.error('Error fetching users:', userError)
    } else {
      contacts.value = users // Set the contacts (users) array
    }
  }
}

// Fetch the list of contacts and set up real-time subscription when the component mounts
onMounted(async () => {
  const { data, error } = await supabase.from('users').select('*')
  if (error) {
    console.error('Error fetching contacts:', error)
  } else {
    contacts.value = data
  }

  // Fetch messages initially for the selected contact
  fetchMessages()

  // Fetch contacts (inbox) based on the logged-in user's recipient_id
  fetchContacts()

  // Set up real-time subscription for messages
  const channel = setupRealtimeSubscription()

  // Soft reload every 1 second (optional)
  const reloadInterval = setInterval(fetchMessages, 1000)

  // Clean up the real-time subscription and interval when the component unmounts
  onUnmounted(() => {
    if (channel) {
      supabase.removeChannel(channel) // Unsubscribe from the channel
    }
    clearInterval(reloadInterval) // Clear the reload interval
  })
})

// Method to handle when a contact is clicked (selected)
const selectContact = (contact) => {
  selectedContact.value = contact
  fetchMessages() // Fetch messages for the selected contact
}
</script>

<template>
  <v-container fluid>
    <v-row>
      <!-- Contact list column -->
      <v-col cols="12" sm="4">
        <v-card>
          <v-card-title>
            <h3>Inbox</h3>
          </v-card-title>
          <v-list>
            <v-list-item
              v-for="contact in contacts"
              :key="contact.id"
              @click="selectContact(contact)"
              :class="{ selected: selectedContact && selectedContact.id === contact.id }"
            >
              <v-list-item-avatar>
                <v-img :src="contact.avatar" alt="Contact Avatar" />
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>{{ contact.firstname }}</v-list-item-title>
                <v-list-item-subtitle>
                  Latest message: {{ messages.length > 0 ? messages[0].content : 'No messages' }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>

      <!-- Chat window column -->
      <v-col cols="12" sm="8">
        <v-card>
          <v-card-title>
            <h3 v-if="selectedContact">Chat with {{ selectedContact.firstname }}</h3>
          </v-card-title>
          <v-card-text>
            <div v-if="messages.length > 0">
              <v-list>
                <v-list-item
                  v-for="message in messages"
                  :key="message.id"
                  :class="{ 'my-message': isMyMessage(senderId, message.sender_id) }"
                >
                  <v-list-item-content>
                    <v-list-item-title>
                      <strong
                        >{{
                          isMyMessage(senderId, message.sender_id)
                            ? 'You'
                            : selectedContact.firstname
                        }}:</strong
                      >
                    </v-list-item-title>
                    <v-list-item-subtitle>{{ message.content }}</v-list-item-subtitle>
                    <v-list-item-subtitle class="text-right">
                      {{ new Date(message.created_at).toLocaleTimeString() }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </div>
            <v-alert v-else>No messages to display.</v-alert>
          </v-card-text>
          <v-card-actions>
            <v-text-field v-model="newMessage" label="Type a message" />
            <v-btn @click="sendMessage">Send</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.my-message {
  background-color: #d1f7d6;
  align-self: flex-end;
}

.selected {
  background-color: #ddd;
}
</style>
