<script setup>
import { ref } from 'vue'
import { useField, useForm } from 'vee-validate'

const { handleSubmit } = useForm({
  validationSchema: {
    password(value) {
      return /^[0-9-]{7,}$/.test(value) || 'Password needs to be at least 7 digits.'
    },
    email(value) {
      return /^[a-z.-]+@[a-z.-]+\.[a-z]+$/i.test(value) || 'Must be a valid e-mail.'
    }
  }
})

// Form fields
const visible = ref(false)
const password = useField('password')
const email = useField('email')
const loading = ref(false)
const submit = handleSubmit((values) => {
  alert(JSON.stringify(values, null, 2))
})
</script>

<template>
  <v-form @submit.prevent="submit" fast-fail>
    <v-text-field
      class="mx-3 my-2"
      variant="outlined"
      prepend-inner-icon="mdi-account"
      density="compact"
      :error-messages="email.errorMessage"
      placeholder="user@gmail.com"
      label="Email"
      hide-details="auto"
      clearable
    ></v-text-field>

    <v-text-field
      class="mx-3 my-2"
      density="compact"
      variant="outlined"
      prepend-inner-icon="mdi-lock"
      :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
      :type="visible ? 'text' : 'password'"
      @click:append-inner="visible = !visible"
      :error-messages="password.errorMessage"
      label="Password"
      placeholder="Enter your password"
      hide-details="auto"
      clearable
    ></v-text-field>

    <v-container width="200">
      <v-btn
        class=""
        :loading="loading"
        color="teal-darken-2"
        size="large"
        type="submit"
        variant="elevated"
        block
        elevation="10"
        style="border-radius: 30px"
      >
      <RouterLink class="text-teal-lighten-3 text-decoration-none" to="/home">Sign In</RouterLink>
        
      </v-btn></v-container
    >
  </v-form>
</template>
