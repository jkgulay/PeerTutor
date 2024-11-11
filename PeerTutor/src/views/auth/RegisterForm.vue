<script setup>
import { ref } from 'vue'
import {
  requiredValidator,
  emailValidator,
  passwordValidator,
  confirmedValidator
} from '@/utils/validators'

const formDataDefault = {
  firstname: '',
  lastname: '',
  email: '',
  password: '',
  repeatPassword: '',
  role: '',
  occupation: ''
}

const formData = ref({
  ...formDataDefault
})
const onSubmit = () => {
  alert(formData.value.email)
}

const isPasswordVisible = ref(false)
const isRepeatPasswordVisible = ref(false)
const refVForm = ref()

const onFormSubmit = () => {
  refVForm.value?.validate().then(({ valid }) => {
    if (valid) onSubmit()
  })
}
</script>

<template>
  <v-form ref="refVForm" @submit.prevent="onFormSubmit">
    <v-row class="d-flex mx-auto" align="center" justify="center">
      <!-- First Name and Last Name Fields -->
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
          :rules="[requiredValidator]"
          variant="outlined"
          density="compact"
          clearable
        ></v-text-field>
      </v-col>

      <!-- Email Field -->
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

      <!-- Password Fields -->
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

      <!-- Occupation and Role Fields -->
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

      <!-- Submit Button -->
      <v-container width="200" class="mb-3">
        <v-btn
          color="teal-darken-2"
          size="large"
          type="submit"
          variant="elevated"
          block
          elevation="10"
          style="border-radius: 30px"
        >
          <span style="color: #80cbc4">Create</span>
        </v-btn>
      </v-container>
    </v-row>
  </v-form>
</template>
