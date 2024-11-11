<script setup>
import {
  requiredValidator,
  emailValidator,
  passwordValidator,
  confirmedValidator
} from '@/utils/validators'
import { ref } from 'vue'
import AlertNotification from '@/components/common/AlertNotification.vue'
import { supabase, formActionDefault } from '@/utils/supabase'
import { useRouter } from 'vue-router'

const router = useRouter()

// Default form data
const formDataDefault = {
  firstname: '',
  lastname: '',
  email: '',
  password: '',
  repeatPassword: '',
  role: '',
  occupation: ''
}

// Reactive form data and action state
const formData = ref({ ...formDataDefault })
const formAction = ref({ ...formActionDefault })

// Password visibility states
const isPasswordVisible = ref(false)
const isRepeatPasswordVisible = ref(false)

// Reference to the form
const refVForm = ref()

// Main submission function
const onSubmit = async () => {
  // Reset form action state
  formAction.value = { ...formActionDefault }
  formAction.value.formProcess = true

  try {
    // Sign up with Supabase
    const { data: signupData, error: signupError } = await supabase.auth.signUp({
      email: formData.value.email,
      password: formData.value.password,
      options: {
        data: {
          firstname: formData.value.firstname,
          lastname: formData.value.lastname,
          role: formData.value.role,
          occupation: formData.value.occupation
        }
      }
    })

    // Handle errors and success
    if (signupError) {
      console.error('Signup error:', signupError)
      formAction.value.formErrorMessage = signupError.message || 'An error occurred. Please try again.'
      formAction.value.formStatus = signupError.status
    } else if (signupData) {
      // Determine the target table based on the role
      const tableName = formData.value.role === 'Student' ? 'students' : 'tutors'

      // Insert user profile data into the appropriate table
      const { error: profileError } = await supabase
        .from(tableName)
        .insert([{
          user_id: signupData.user.id,  // Link to Auth ID
          firstname: formData.value.firstname,
          email: formData.value.email,
          lastname: formData.value.lastname,
          occupation: formData.value.occupation,
          role: formData.value.role
        }])

      if (profileError) {
        console.error('Profile insertion error:', profileError)
        formAction.value.formErrorMessage = profileError.message || 'An error occurred while creating the profile.'
      } else {
        console.log('Sign Up successful:', signupData)
        formAction.value.formSuccessMessage = 'Check your email to confirm registration!'
        refVForm.value?.reset() // Reset the form
        setTimeout(() => {
          router.replace('/') // Redirect to home
        }, 2000)
      }
    }
  } catch (err) {
    console.error('Unexpected error during signup:', err)
    formAction.value.formErrorMessage = 'An unexpected error occurred. Please try again.'
  } finally {
    // Turn off processing
    formAction.value.formProcess = false
  }
}

// Function to validate and submit the form
const onFormSubmit = () => {
  refVForm.value?.validate().then(({ valid }) => {
    if (valid) {
      onSubmit()
    } else {
      // Handle validation errors if needed
      formAction.value.formErrorMessage = 'Please fix the validation errors.'
    }
  }).catch(err => {
    console.error('Validation error:', err)
    formAction.value.formErrorMessage = 'An error occurred while validating the form.'
  })
}
</script>


<template>
  <AlertNotification
    :form-success-message="formAction.formSuccessMessage"
    :form-error-message="formAction.formErrorMessage"
  ></AlertNotification>
  
  <v-form ref="refVForm" @submit.prevent="onFormSubmit">
    <!-- Name Fields -->
    <v-row class="d-flex mx-auto" align="center" justify="center">
      <v-col cols="12" md="6">
        <v-text-field
          v-model="formData.firstname"
          label="First Name"
          prepend-inner-icon="mdi-badge-account-outline"
          :rules="[requiredValidator]"
          variant="outlined"
          density="compact"
          clearable
        ></v-text-field>
      </v-col>

      <v-col cols="12" md="6">
        <v-text-field
          v-model="formData.lastname"
          label="Last Name"
          prepend-inner-icon="mdi-account-outline"
          :rules="[requiredValidator]"
          variant="outlined"
          density="compact"
          clearable
        ></v-text-field>
      </v-col>
    </v-row>

    <!-- Contact Information Field -->
    <v-row class="d-flex mx-auto" align="center" justify="center">
      <v-col cols="12">
        <v-text-field
          v-model="formData.email"
          label="Email"
          prepend-inner-icon="mdi-email"
          :rules="[requiredValidator, emailValidator]"
          variant="outlined"
          density="compact"
          clearable
        ></v-text-field>
      </v-col>
    </v-row>

    <!-- Password Fields -->
    <v-row class="d-flex mx-auto" align="center" justify="center">
      <v-col cols="12" md="6">
        <v-text-field
          v-model="formData.password"
          label="Password"
          prepend-inner-icon="mdi-lock"
          :type="isPasswordVisible ? 'text' : 'password'"
          :append-inner-icon="isPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
          @click:append-inner="isPasswordVisible = !isPasswordVisible"
          :rules="[requiredValidator, passwordValidator]"
          variant="outlined"
          density="compact"
          clearable
        ></v-text-field>
      </v-col>

      <v-col cols="12" md="6">
        <v-text-field
          v-model="formData.repeatPassword"
          label="Repeat Password"
          prepend-inner-icon="mdi-lock-check"
          :type="isRepeatPasswordVisible ? 'text' : 'password'"
          :append-inner-icon="isRepeatPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
          @click:append-inner="isRepeatPasswordVisible = !isRepeatPasswordVisible"
          :rules="[
            requiredValidator,
            confirmedValidator(formData.repeatPassword, formData.password)
          ]"
          variant="outlined"
          density="compact"
          clearable
        ></v-text-field>
      </v-col>
    </v-row>

    <!-- Occupation and Role Fields -->
    <v-row class="d-flex mx-auto" align="center" justify="center">
      <v-col cols="12" md="7">
        <v-select
          v-model="formData.occupation"
          label="Occupation"
          :items="[
            'Teacher',
            'Tutor',
            'Student',
            'Professor',
            'Online Instructor',
            'Education Consultant',
            'School Administrator',
            'Curriculum Developer',
            'Learning Facilitator',
            'Private Tutor',
            'Training Specialist',
            'Subject Matter Expert',
            'Mentor',
            'Coach',
            'Librarian',
            'Research Assistant',
            'Guidance Counselor',
            'Special Education Teacher',
            'Vocational Trainer',
            'Child Care Worker',
            'Other'
          ]"
          :rules="[requiredValidator]"
          variant="outlined"
          density="compact"
        ></v-select>
      </v-col>

      <v-col cols="12" md="5">
        <v-select
          v-model="formData.role"
          label="Role"
          :items="['Student', 'Tutor']"
          :rules="[requiredValidator]"
          variant="outlined"
          density="compact"
        ></v-select>
      </v-col>
    </v-row>

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
        Create
      </v-btn>
    </v-container>
  </v-form>
</template>
