<template>
  <div v-if="selectedContact" class="chat-window">
    <div class="chat-header">
      <h2>{{ selectedContact.name }}</h2>
    </div>
    <div class="chat-body">
      <!-- Add chat messages dynamically -->
      <div class="message">
        <p>Hi, have you got the project report PDF?</p>
      </div>
    </div>
    <div class="chat-footer">
      <input type="text" placeholder="Write Something..." />
    </div>
  </div>
</template>

<script>
export default {
  props: ['selectedContact']
}
</script>

<style scoped>
.chat-window {
  flex: 2;
  display: flex;
  flex-direction: column;
}

.chat-header {
  background: linear-gradient(#072e33, #05161a); /* Same as chat body */
  color: white;
  padding: 10px;
}

.chat-body {
  flex: 1;
  padding: 10px;
  overflow-y: auto;
  background: linear-gradient(#072e33, #05161a); /* Consistent background */
  color: white;
}

.message {
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1); /* Translucent background for messages */
  color: white;
  max-width: 60%;
}

.chat-footer {
  padding: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.2); /* Subtle border for separation */
  background: linear-gradient(#072e33, #05161a); /* Same gradient as header and body */
}

.chat-footer input {
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid rgba(255, 255, 255, 0.3); /* Subtle border */
  background: rgba(255, 255, 255, 0.1); /* Translucent background matching theme */
  color: white;
  outline: none;
  font-size: 14px;
}

.chat-footer input::placeholder {
  color: rgba(255, 255, 255, 0.7); /* Placeholder color for readability */
}
</style>
