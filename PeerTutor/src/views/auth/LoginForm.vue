<script setup>
import AlertNotification from '@/components/common/AlertNotification.vue'
import { supabase, formActionDefault } from '@/utils/supabase'
import { ref } from 'vue'
import { requiredValidator, emailValidator } from '@/utils/validators'
import { useRouter } from 'vue-router'

// Router instance
const router = useRouter()

// Default form data
const formDataDefault = {
  email: '',
  password: ''
}

// Reactive form data and action state
const formData = ref({ ...formDataDefault })
const formAction = ref({ ...formActionDefault })

// Password visibility state
const isPasswordVisible = ref(false)

// Reference to the form
const refVForm = ref()

const onSubmit = async () => {
  formAction.value = { ...formActionDefault }

  formAction.value.formProcess = true

  const { data, error } = await supabase.auth.signInWithPassword({
    email: formData.value.email,
    password: formData.value.password
  })

  // Handle response
  if (error) {
    formAction.value.formErrorMessage = error.message || 'An error occurred during login.'
    formAction.value.formStatus = error.status
    console.error('Login error:', error) // Log the error for debugging
  } else if (data) {
    formAction.value.formSuccessMessage = 'Successfully Logged In!'
    router.replace('/home') // Redirect to home
  }

  // Reset form
  refVForm.value?.reset()

  // Turn off processing
  formAction.value.formProcess = false
}

// Form submit handler
const onFormSubmit = () => {
  refVForm.value?.validate().then(({ valid }) => {
    if (valid) onSubmit() // Call onSubmit if the form is valid
  })
}
</script>

<template>
  <AlertNotification
    :form-success-message="formAction.formSuccessMessage"
    :form-error-message="formAction.formErrorMessage"
  ></AlertNotification>

  <v-form ref="refVForm" @submit.prevent="onFormSubmit">
    <v-card-text>
      <v-row dense class="d-flex justify-center">
        <!-- Email Field -->
        <v-text-field
          v-model="formData.email"
          label="Email"
          variant="outlined"
          density="compact"
          prepend-inner-icon="mdi-account"
          :rules="[requiredValidator, emailValidator]"
        ></v-text-field>
      </v-row>
      <v-row dense class="d-flex justify-center">
        <!-- Password Field -->
        <v-text-field
          v-model="formData.password"
          prepend-inner-icon="mdi-lock"
          label="Password"
          variant="outlined"
          density="compact"
          :type="isPasswordVisible ? 'text' : 'password'"
          :append-inner-icon="isPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
          @click:append-inner="isPasswordVisible = !isPasswordVisible"
          :rules="[requiredValidator]"
        ></v-text-field>
      </v-row>
      <!-- Submit Button -->
      <v-container dense class="d-flex justify-center">
        <v-btn
          color="teal-darken-2"
          size="large"
          type="submit"
          variant="elevated"
          block
          elevation="10"
          style="border-radius: 30px"
        >
          Sign In
        </v-btn>
      </v-container>
    </v-card-text>
  </v-form>
</template>
