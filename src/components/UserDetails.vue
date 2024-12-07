<template>
  <div v-if="selectedContact" class="user-details">
    <div class="profile-header">
      <h2>{{ selectedContact.name }}</h2>
    </div>
    <div class="profile-body">
      <p><strong>Last Message:</strong> {{ selectedContact.lastMessage }}</p>
      <p><strong>Last Active:</strong> {{ selectedContact.time }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: ['selectedContact']
}
</script>

<style scoped>
.user-details {
  flex: 1;
  background: linear-gradient(#072e33, #05161a); /* Apply gradient background */
  color: white; /* Ensure text is readable */
  padding: 10px;
  display: flex;
  flex-direction: column;
}

.profile-header {
  padding: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.profile-body {
  margin-top: 10px;
}

.profile-body p {
  margin: 5px 0;
  color: #ddd;
}
</style>
