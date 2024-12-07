<script setup>
import ContactList from '@/components/ContactList.vue'
import ChatWindow from '@/components/ChatWindow.vue'
import UserDetails from '@/components/UserDetails.vue'
import HomeLayout from '@/components/layout/HomeLayout.vue'
</script>

<template>
  <HomeLayout>
    <template #content>
      <br /><br />
      <div class="app-container">
        <ContactList :contacts="contacts" @selectContact="selectContact" />
        <ChatWindow :selectedContact="selectedContact" />
        <UserDetails :selectedContact="selectedContact" />
      </div>
    </template>
  </HomeLayout>
</template>

<script>
export default {
  data() {
    return {
      contacts: [
        { id: 1, name: 'Christ Charl', lastMessage: 'Nice one!', time: '10:25 AM' },
        { id: 2, name: 'Jun Kyle', lastMessage: 'Nice two!', time: '10:35 AM' },
        { id: 2, name: 'James Ohaha', lastMessage: 'Nice three!', time: '10:35 AM' }
        // Add more contacts
      ],
      selectedContact: null
    }
  },
  methods: {
    selectContact(contact) {
      this.selectedContact = contact
    }
  }
}
</script>

<style>
.app-container {
  display: flex;
  height: 100vh;
}
</style>
