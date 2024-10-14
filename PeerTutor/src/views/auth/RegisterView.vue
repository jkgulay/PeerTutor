<script setup>


</script>

<script>


</script>

<template>
  <v-responsive class="border rounded">
    <v-app :theme="theme">
        <v-app-bar
        color="teal-darken-4"
        image="https://picsum.photos/1920/1080?random"
      >
        <template v-slot:image>
          <v-img
            gradient="to top right, rgba(19,84,122,.8), rgba(128,208,199,.8)"
          ></v-img>
        </template>

        <template v-slot:prepend>
          <v-app-bar-nav-icon></v-app-bar-nav-icon>
        </template>

        <v-app-bar-title>PeerTutor</v-app-bar-title>

        <v-spacer></v-spacer>

        <v-btn icon>
          <v-icon>mdi-magnify</v-icon>
        </v-btn>

        <v-btn icon>
          <v-icon>mdi-heart</v-icon>
        </v-btn>

        <v-btn icon>
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </v-app-bar>

      <v-main>
        <v-container>
          <v-row class="dflex justify-center">
            <v-col>
              <v-card
                class="mx-auto px-6 py-8"
                max-width="450"
                subtitle="Register Form"
                style="margin: 30px; border-radius: 10%"
                elevatio="8"
              >
                <template v-slot:title>
                  <v-img class="mx-auto" max-width="228" src="/logo/try.png"></v-img>
                  <v-divider class="my-2" color="black"></v-divider>
                  <span class="font-weight-black">PeerTutor</span>
                </template>

                <v-form fast-fail @submit.prevent>
                  <v-text-field
                    class="mx-3 my-2"
                    variant="outlined"
                    prepend-inner-icon="mdi-clipboard-account"
                    density="compact"
                    v-model="userName"
                    :rules="userNameRules"
                    placeholder="user2"
                    label="User Name"
                    type="userName"
                    hide-details="auto"
                    clearable
                  ></v-text-field>

                  <v-text-field
                    class="mx-3 my-2"
                    variant="outlined"
                    prepend-inner-icon="mdi-account"
                    density="compact"
                    v-model="email"
                    :rules="emailRules"
                    placeholder="user@gmail.com"
                    label="Email"
                    type="email"
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
                    v-model="password"
                    :rules="passwordRules"
                    label="Password"
                    type="password"
                    hint="Always remember your password!"
                    placeholder="Enter your password"
                  ></v-text-field>

                  <v-select
                    v-model="select"
                    :items="items"
                    :rules="[(v) => !!v || 'Item is required']"
                    label="Role"
                    required
                  ></v-select>

                  <v-container width="200">
                    <v-btn
                      class="my-2"
                      :loading="loading"
                      color="light-green-darken-1"
                      size="large"
                      type="submit"
                      variant="elevated"
                      block
                    >
                      Register
                    </v-btn></v-container
                  >
                </v-form>
                <v-divider class="my-2"></v-divider>
                <h5 class="mx-auto">
                  <RouterLink to="/login">Back</RouterLink>
                </h5>
              </v-card></v-col
            >
          </v-row>
        </v-container>
      </v-main>

      <v-footer color="grey-darken-3" border app class="dflex">
        <v-row justify="center" no-gutters>
          <v-col class="text-center mt-4" cols="12">
            {{ new Date().getFullYear() }} — <strong>Kayel</strong>
          </v-col>
        </v-row>
      </v-footer>
    </v-app>
  </v-responsive>
</template>
