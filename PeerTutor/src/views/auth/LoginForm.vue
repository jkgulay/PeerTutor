<script setup>
import AlertNotification from '@/components/common/AlertNotification.vue'

import { supabase, formActionDefault } from '@/utils/supabase'
import { ref } from 'vue'
import { requiredValidator, emailValidator } from '@/utils/validators'
import { useRouter } from 'vue-router'

const router = useRouter()

// Default form data
const formDataDefault = {
  email: '',
  password: ''
}
const formData = ref({
  ...formDataDefault
})
const formAction = ref({
  ...formActionDefault
})

const isPasswordVisible = ref(false)
const refVForm = ref()

// Login function
const onSubmit = async () => {
  //Reset Form Action utils
  formAction.value = { ...formActionDefault }
  // Turn on processing
  formAction.value.formProcess = true

  const { data, error } = await supabase.auth.signInWithPassword({
    email: formData.value.email,
    password: formData.value.password
  })

  if (error) {
    formAction.value.formErrorMessage = error.message
    formAction.value.formStatus = error.status
  } else if (data) {
    formAction.value.formSuccessMessage = 'Sucessfully Login!'
    router.replace('/home')
  }

  //Reset Form
  refVForm.value?.reset()

  //Turn off processing
  formAction.value.formProcess = false


const isPasswordVisible = ref(false)
const refVForm = ref()

// Default form data
const formData = ref({
  email: '',
  password: ''
})

// Login function
const onLogin = () => {
  alert(formData.value.password)
}

// Form submit handler
const onFormSubmit = () => {
  refVForm.value?.validate().then(({ valid }) => {
    if (valid) onSubmit()

    if (valid) onLogin()
  })
}
</script>

<template>
  <AlertNotification
    :form-success-message="formAction.formSuccessMessage"
    :form-error-message="formAction.formErrorMessage"
  ></AlertNotification>
  <v-form class="mt-5" ref="refVForm" @submit.prevent="onFormSubmit">
    <!-- Email Field -->
    <v-text-field
      v-model="formData.email"
      label="Email"

  <v-form ref="refVForm" @submit.prevent="onFormSubmit">
    <!-- Email Field -->

    <v-text-field
      v-model="formData.email"
      label="Email"
      variant="outlined"
      density="compact"
      prepend-inner-icon="mdi-account"
      :rules="[requiredValidator, emailValidator]"
    ></v-text-field>

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

    <!-- Submit Button -->
    <v-container width="200">
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
  </v-form>
</template>
