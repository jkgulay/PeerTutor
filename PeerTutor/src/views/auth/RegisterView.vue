<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import { ref } from 'vue'
import { useField, useForm } from 'vee-validate'

const { handleSubmit } = useForm({
  validationSchema: {
    userName(value) {
      return value?.length >= 2 || 'User Name needs to be at least 2 characters.'
    },
    password(value) {
      return /^[0-9-]{7,}$/.test(value) || 'Password needs to be at least 7 digits.'
    },
    email(value) {
      return /^[a-z.-]+@[a-z.-]+\.[a-z]+$/i.test(value) || 'Must be a valid e-mail.'
    },
    role(value) {
      return value || 'Select a role.'
    }
  }
})

// Form fields
const visible = ref(false)
const repeatVisible = ref(false)

const userName = useField('userName')
const password = useField('password')
const email = useField('email')
const role = useField('role')

const items = ref(['Student', 'Tutor'])
const loading = ref(false)
const repeatPassword = ref('')

// Form submission
const submit = handleSubmit((values) => {
  alert(JSON.stringify(values, null, 2))
})
</script>

<template>
  <AppLayout
    ><template #content
      ><v-row class="dflex justify-center">
        <v-col>
          <v-card
            class="mx-auto px-6"
            max-width="450"
            subtitle="Register Form"
            style="margin: 30px; border-radius: 30px"
            elevation="20"
            color="#294D61"
          >
            <template v-slot:title>
              <v-img class="mx-auto" max-width="228" src="/logo/try2.png"></v-img>

              <span class="font-weight-black" style="color: #80cbc4">PeerTutor</span>
              <v-divider class="my-2" color="black"></v-divider>
            </template>

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
                variant="outlined"
                prepend-inner-icon="mdi-badge-account-outline"
                density="compact"
                :error-messages="userName.errorMessage"
                placeholder="Enter Name"
                label="User Name"
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

              <v-text-field
                class="mx-3 my-2"
                density="compact"
                variant="outlined"
                prepend-inner-icon="mdi-lock-check"
                :append-inner-icon="repeatVisible ? 'mdi-eye-off' : 'mdi-eye'"
                :type="repeatVisible ? 'text' : 'password'"
                @click:append-inner="repeatVisible = !repeatVisible"
                label="Repeat Password"
                placeholder="Repeat your password"
                hide-details="auto"
                clearable
              ></v-text-field>

              <v-select
                class="mx-3 my-2"
                :error-messages="role.errorMessage"
                :items="items"
                label="Role"
              ></v-select>

              <v-container width="200">
                <v-btn
                  :loading="loading"
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
            </v-form>
            <v-divider class=""></v-divider>
            <v-card-text class="text-center">
              <a class="text-white text-decoration-none" rel="noopener noreferrer" target="_blank">
                Already have an account?<v-icon icon="mdi-chevron-left"></v-icon>
                <RouterLink to="/login">Sign In</RouterLink>
              </a>
            </v-card-text>
          </v-card></v-col
        >
      </v-row></template
    >
  </AppLayout>
</template>
