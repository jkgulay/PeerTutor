<template>
  <div class="contact-list">
    <div
      v-for="contact in contacts"
      :key="contact.id"
      class="contact-item"
      @click="$emit('selectContact', contact)"
    >
      <h3>{{ contact.name }}</h3>
      <p>{{ contact.lastMessage }}</p>
      <span class="time">{{ contact.time }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: ['contacts']
}
</script>

<style scoped>
.contact-list {
  flex: 1;
  background: linear-gradient(#072e33, #05161a); /* Apply gradient background */
  color: white; /* Ensure text is readable */
  overflow-y: auto;
  padding: 10px;
}

.contact-item {
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1); /* Slightly translucent background */
  cursor: pointer;
}

.contact-item:hover {
  background: rgba(255, 255, 255, 0.2); /* Highlight on hover */
}

.time {
  display: block;
  font-size: 0.8em;
  color: #bbb;
  margin-top: 5px;
}
</style>
