<script setup>
import AlertNotification from '@/components/common/AlertNotification.vue'
import { supabase, formActionDefault } from '@/utils/supabase'
import { ref } from 'vue'
import { requiredValidator, emailValidator } from '@/utils/validators'
import { useRouter } from 'vue-router'

const router = useRouter()
const formData = ref({
  email: '',
  password: ''
})

const formAction = ref({ ...formActionDefault })
const isPasswordVisible = ref(false)
const refVForm = ref()

const onSubmit = async () => {
  formAction.value = { ...formActionDefault }
  formAction.value.formProcess = true

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: formData.value.email,
      password: formData.value.password
    })

    if (error) {
      formAction.value.formErrorMessage = error.message || 'An error occurred during login.'
      console.error('Login error:', error)
      return
    }

    if (data) {
      // Fetch user role from the database
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('role')
        .eq('user_id', data.user.id) // Ensure this matches the correct column name and type
        .single()

      if (userError) {
        console.error('Error fetching user role:', userError)
        formAction.value.formErrorMessage = 'Error fetching user data.'
        return
      }

      localStorage.setItem('user_id', userData.id)
      console.log(userData.id)

      formAction.value.formSuccessMessage = 'Successfully Logged In!'
      if (userData.role === 'Admin') {
        router.push({ name: 'admin' }) 
      } else {
        router.push({ name: 'home' }) 
      }
    } else {
      console.error('User  data not available')
      formAction.value.formErrorMessage = 'No user data returned.'
    }
  } catch (error) {
    console.error('Unexpected error during login:', error)
    formAction.value.formErrorMessage = 'An unexpected error occurred.'
  } finally {
    refVForm.value?.reset()
    formAction.value.formProcess = false
  }
}
const onFormSubmit = () => {
  refVForm.value?.validate().then(({ valid }) => {
    if (valid) onSubmit()
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
