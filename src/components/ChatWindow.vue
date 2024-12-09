<template>
  <div v-if="selectedContact" class="chat-window">
    <div class="chat-header">
      <h2>{{ selectedContact.name }}</h2>
    </div>
    <div class="chat-body">
      <div
        v-for="(message, index) in messages"
        :key="index"
        :class="['message', message.sender === 'user' ? 'sent' : 'received']"
      >
        <p>{{ message.text }}</p>
      </div>
    </div>
    <div class="chat-footer">
      <input v-model="newMessage" type="text" placeholder="Write Something..." />
      <button @click="sendMessage">Send</button>
    </div>
  </div>
</template>

<script>
export default {
  props: ['selectedContact'],
  data() {
    return {
      messages: [
        { sender: 'contact', text: 'Hi, have you got the project report PDF?' },
        { sender: 'user', text: 'Yes, I’ll send it to you shortly.' }
      ],
      newMessage: ''
    }
  },
  methods: {
    sendMessage() {
      if (this.newMessage.trim()) {
        this.messages.push({ sender: 'user', text: this.newMessage })

        setTimeout(() => {
          this.messages.push({
            sender: 'contact',
            text: 'Got it! Thanks for the update.'
          })
        }, 1000)

        this.newMessage = '' 
      }
    }
  }
}
</script>

<style scoped>
.chat-window {
  flex: 2;
  display: flex;
  flex-direction: column;
}

.chat-header {
  background: linear-gradient(#072e33, #05161a);
  color: white;
  padding: 10px;
}

.chat-body {
  flex: 1;
  padding: 10px;
  overflow-y: auto;
  background: linear-gradient(#072e33, #05161a);
  color: white;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.message {
  padding: 10px;
  border-radius: 8px;
  max-width: 60%;
}

.sent {
  align-self: flex-end;
  background: rgba(0, 123, 255, 0.6);
  color: white;
}

.received {
  align-self: flex-start;
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.chat-footer {
  padding: 10px;
  display: flex;
  gap: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  background: linear-gradient(#072e33, #05161a);
}

.chat-footer input {
  flex: 1;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.1);
  color: white;
  outline: none;
  font-size: 14px;
}

.chat-footer input::placeholder {
  color: rgba(255, 255, 255, 0.7);
}

.chat-footer button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.chat-footer button:hover {
  background-color: #0056b3;
}
</style>
