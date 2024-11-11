<script setup>
defineProps({
  formSuccessMessage: String,
  formErrorMessage: String
})
</script>

<template>
  <!-- Success Alert -->
  <v-alert
    v-if="formSuccessMessage"
    :text="formSuccessMessage"
    title="Success!"
    type="success"
    variant="tonal"
    density="compact"
    border="start"
    closable
  ></v-alert>

  <!-- Error Alert -->
  <v-alert
    v-if="formErrorMessage"
    :text="formErrorMessage"
    title="Oops!"
    type="error"
    variant="tonal"
    density="compact"
    border="start"
    closable
  ></v-alert>
</template>
