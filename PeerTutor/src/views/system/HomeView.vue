<script setup>
import HomeLayout from '@/components/layout/HomeLayout.vue'
</script>

<script>
export default {
  data() {
    return {
      loading: false,
      newMessage: '',
      messages: [
        { text: 'Hello! How can I help you today?', isUser: false },
        { text: 'Can we discuss the project details?', isUser: true }
      ],
      dialog: false
    }
  },

  methods: {
    sendMessage() {
      if (this.newMessage.trim()) {
        // Push new message to the array
        this.messages.push({ text: this.newMessage, isUser: true })
        // Clear input field
        this.newMessage = ''
        // Simulate a response (optional)
        this.simulateResponse()
      }
    },
    simulateResponse() {
      setTimeout(() => {
        this.messages.push({ text: 'Sure! Let me know the specifics.', isUser: false })
      }, 1000) // Simulate delay
    }
  }
}
</script>
<template>
  <HomeLayout>
    <template #content>
      <v-container fluid>
        <v-row class="py-10"
          ><v-col cols="12" md="6" class="d-flex mx-auto ">
            <v-card color="#05161a" style="border-radius: 20px">
              <!-- Tutor Information and Social Media Icons -->
              <v-row class="mx-2 mt-2" align="center">
                <!-- Avatar -->
                <v-col cols="auto">
                  <v-avatar>
                    <v-img src="https://randomuser.me/api/portraits/men/21.jpg"></v-img>
                  </v-avatar>
                </v-col>

                <!-- Tutor Name and Subtitle -->
                <v-col>
                  <div>
                    <h3>Jun Kyle</h3>
                    <p>Software Engineer</p>
                  </div>
                </v-col>

                <!-- Social Media Icons -->
                <v-col cols="auto" class="d-flex justify-end">
                  <v-btn icon="mdi-gmail" text color="#05161a" density="compact"></v-btn>
                  <v-btn icon="mdi-facebook" text color="#05161a" density="compact"></v-btn>
                  <v-btn icon="mdi-linkedin" text color="#05161a" density="compact"></v-btn>
                </v-col>
              </v-row>

              <!-- Description Section -->
              <v-container class="mt-2">
                <p>
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptates sed vero
                  mollitia nesciunt tenetur quaerat tempore possimus modi velit accusamus
                  dignissimos quae illo, sequi libero blanditiis error earum. Praesentium,
                  accusamus?
                </p>
              </v-container>

              <!-- Button and Rating Section -->
              <v-row class="mx-2 mb-2" align="center">
                <!-- Contact Tutor Button -->
                <v-col cols="auto">
                  <v-btn
                    class="text-white"
                    :loading="loading"
                    color="teal-darken-2"
                    size="small"
                    type="submit"
                    variant="elevated"
                    block
                    elevation="10"
                    style="border-radius: 30px"
                    height="40px"
                    href=""
                    append-icon="mdi-phone-plus"
                    @click="dialog = true"
                  >
                    Contact Tutor
                  </v-btn>
                  <v-dialog v-model="dialog" max-width="550">
                    <v-card :disabled="loading" :loading="loading" class="mb-4">
                      <template v-slot:loader="{ isActive }">
                        <v-progress-linear
                          :active="isActive"
                          color="deep-purple"
                          height="4"
                          indeterminate
                        ></v-progress-linear>
                      </template>

                      <!-- Header Section -->
                      <v-card-title class="text-h5">Chat with Jun Kyle</v-card-title>
                      <v-divider class="mx-4 mb-2"></v-divider>

                      <!-- Messages Section -->
                      <v-container class="py-2" style="max-height: 400px; overflow-y: auto">
                        <v-row v-for="(msg, index) in messages" :key="index" class="mb-2">
                          <v-col :class="msg.isUser ? 'text-end' : 'text-start'" cols="12">
                            <v-chip
                              :color="msg.isUser ? 'blue lighten-4' : 'grey lighten-3'"
                              class="text-body-1"
                              :text-color="msg.isUser ? 'blue--text' : 'grey--text'"
                              label
                            >
                              {{ msg.text }}
                            </v-chip>
                          </v-col>
                        </v-row>
                      </v-container>

                      <!-- Message Input Section -->
                      <v-divider class="mx-4 mb-2"></v-divider>
                      <v-container>
                        <v-row>
                          <v-col cols="12">
                            <v-text-field
                              v-model="newMessage"
                              :append-icon="newMessage ? 'mdi-send' : 'mdi-microphone'"
                              clear-icon="mdi-close-circle"
                              label="Type a message..."
                              variant="outlined"
                              clearable
                              @click:append="sendMessage"
                            ></v-text-field>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-card>
                  </v-dialog>
                </v-col>

                <!-- Rating Section -->
                <v-col cols="auto" class="d-flex justify-end">
                  <v-rating
                    hover
                    :length="5"
                    :size="32"
                    :model-value="4"
                    active-color="teal-darken-2"
                  />
                </v-col>
              </v-row>
            </v-card> </v-col
          ><v-col cols="12" md="6">
            <v-card color="#05161a" style="border-radius: 20px">
              <!-- Tutor Information and Social Media Icons -->
              <v-row class="mx-2 mt-2" align="center">
                <!-- Avatar -->
                <v-col cols="auto">
                  <v-avatar>
                    <v-img src="https://randomuser.me/api/portraits/men/5.jpg"></v-img>
                  </v-avatar>
                </v-col>

                <!-- Tutor Name and Subtitle -->
                <v-col>
                  <div>
                    <h3>Wolberine</h3>
                    <p>College Student</p>
                  </div>
                </v-col>

                <!-- Social Media Icons -->
                <v-col cols="auto" class="d-flex justify-end">
                  <v-btn icon="mdi-gmail" text color="#05161a" density="compact"></v-btn>
                  <v-btn icon="mdi-facebook" text color="#05161a" density="compact"></v-btn>
                  <v-btn icon="mdi-linkedin" text color="#05161a" density="compact"></v-btn>
                </v-col>
              </v-row>

              <!-- Description Section -->
              <v-container class="mt-2">
                <p>
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptates sed vero
                  mollitia nesciunt tenetur quaerat tempore possimus modi velit accusamus
                  dignissimos quae illo, sequi libero blanditiis error earum. Praesentium,
                  accusamus?
                </p>
              </v-container>

              <!-- Button and Rating Section -->
              <v-row class="mx-2 mb-2" align="center">
                <!-- Contact Tutor Button -->
                <v-col cols="auto">
                  <v-btn
                    class="text-white"
                    :loading="loading"
                    color="teal-darken-2"
                    size="small"
                    type="submit"
                    variant="elevated"
                    block
                    elevation="10"
                    style="border-radius: 30px"
                    height="40px"
                    href=""
                    append-icon="mdi-phone-plus"
                    @click="dialog = true"
                  >
                    Contact Tutor
                  </v-btn>
                  <v-dialog v-model="dialog" max-width="550">
                    <v-card :disabled="loading" :loading="loading" class="mb-4">
                      <template v-slot:loader="{ isActive }">
                        <v-progress-linear
                          :active="isActive"
                          color="deep-purple"
                          height="4"
                          indeterminate
                        ></v-progress-linear>
                      </template>

                      <!-- Header Section -->
                      <v-card-title class="text-h5">Chat with Wolberine</v-card-title>
                      <v-divider class="mx-4 mb-2"></v-divider>

                      <!-- Messages Section -->
                      <v-container class="py-2" style="max-height: 400px; overflow-y: auto">
                        <v-row v-for="(msg, index) in messages" :key="index" class="mb-2">
                          <v-col :class="msg.isUser ? 'text-end' : 'text-start'" cols="12">
                            <v-chip
                              :color="msg.isUser ? 'blue lighten-4' : 'grey lighten-3'"
                              class="text-body-1"
                              :text-color="msg.isUser ? 'blue--text' : 'grey--text'"
                              label
                            >
                              {{ msg.text }}
                            </v-chip>
                          </v-col>
                        </v-row>
                      </v-container>

                      <!-- Message Input Section -->
                      <v-divider class="mx-4 mb-2"></v-divider>
                      <v-container>
                        <v-row>
                          <v-col cols="12">
                            <v-text-field
                              v-model="newMessage"
                              :append-icon="newMessage ? 'mdi-send' : 'mdi-microphone'"
                              clear-icon="mdi-close-circle"
                              label="Type a message..."
                              variant="outlined"
                              clearable
                              @click:append="sendMessage"
                            ></v-text-field>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-card>
                  </v-dialog>
                </v-col>

                <!-- Rating Section -->
                <v-col cols="auto" class="d-flex justify-end">
                  <v-rating
                    hover
                    :length="5"
                    :size="32"
                    :model-value="4"
                    active-color="teal-darken-2"
                  />
                </v-col>
              </v-row>
            </v-card>
          </v-col>
          <v-col cols="12" md="6">
            <v-card color="#05161a" style="border-radius: 20px">
              <!-- Tutor Information and Social Media Icons -->
              <v-row class="mx-2 mt-2" align="center">
                <!-- Avatar -->
                <v-col cols="auto">
                  <v-avatar>
                    <v-img src="https://randomuser.me/api/portraits/men/53.jpg"></v-img>
                  </v-avatar>
                </v-col>

                <!-- Tutor Name and Subtitle -->
                <v-col>
                  <div>
                    <h3>Drunk It</h3>
                    <p>Lawyer</p>
                  </div>
                </v-col>

                <!-- Social Media Icons -->
                <v-col cols="auto" class="d-flex justify-end">
                  <v-btn icon="mdi-gmail" text color="#05161a" density="compact"></v-btn>
                  <v-btn icon="mdi-facebook" text color="#05161a" density="compact"></v-btn>
                  <v-btn icon="mdi-linkedin" text color="#05161a" density="compact"></v-btn>
                </v-col>
              </v-row>

              <!-- Description Section -->
              <v-container class="mt-2">
                <p>
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptates sed vero
                  mollitia nesciunt tenetur quaerat tempore possimus modi velit accusamus
                  dignissimos quae illo, sequi libero blanditiis error earum. Praesentium,
                  accusamus?
                </p>
              </v-container>

              <!-- Button and Rating Section -->
              <v-row class="mx-2 mb-2" align="center">
                <!-- Contact Tutor Button -->
                <v-col cols="auto">
                  <v-btn
                    class="text-white"
                    :loading="loading"
                    color="teal-darken-2"
                    size="small"
                    type="submit"
                    variant="elevated"
                    block
                    elevation="10"
                    style="border-radius: 30px"
                    height="40px"
                    href=""
                    append-icon="mdi-phone-plus"
                  >
                    Contact Tutor
                  </v-btn>
                </v-col>

                <!-- Rating Section -->
                <v-col cols="auto" class="d-flex justify-end">
                  <v-rating
                    hover
                    :length="5"
                    :size="32"
                    :model-value="4"
                    active-color="teal-darken-2"
                  />
                </v-col>
              </v-row>
            </v-card>
          </v-col>

          <v-col cols="12" md="6">
            <v-card color="#05161a" style="border-radius: 20px">
              <!-- Tutor Information and Social Media Icons -->
              <v-row class="mx-2 mt-2" align="center">
                <!-- Avatar -->
                <v-col cols="auto">
                  <v-avatar>
                    <v-img src="https://randomuser.me/api/portraits/men/53.jpg"></v-img>
                  </v-avatar>
                </v-col>

                <!-- Tutor Name and Subtitle -->
                <v-col>
                  <div>
                    <h3>Drunk It</h3>
                    <p>Lawyer</p>
                  </div>
                </v-col>

                <!-- Social Media Icons -->
                <v-col cols="auto" class="d-flex justify-end">
                  <v-btn icon="mdi-gmail" text color="#05161a" density="compact"></v-btn>
                  <v-btn icon="mdi-facebook" text color="#05161a" density="compact"></v-btn>
                  <v-btn icon="mdi-linkedin" text color="#05161a" density="compact"></v-btn>
                </v-col>
              </v-row>

              <!-- Description Section -->
              <v-container class="mt-2">
                <p>
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptates sed vero
                  mollitia nesciunt tenetur quaerat tempore possimus modi velit accusamus
                  dignissimos quae illo, sequi libero blanditiis error earum. Praesentium,
                  accusamus?
                </p>
              </v-container>

              <!-- Button and Rating Section -->
              <v-row class="mx-2 mb-2" align="center">
                <!-- Contact Tutor Button -->
                <v-col cols="auto">
                  <v-btn
                    class="text-white"
                    :loading="loading"
                    color="teal-darken-2"
                    size="small"
                    type="submit"
                    variant="elevated"
                    block
                    elevation="10"
                    style="border-radius: 30px"
                    height="40px"
                    href=""
                    append-icon="mdi-phone-plus"
                  >
                    Contact Tutor
                  </v-btn>
                </v-col>

                <!-- Rating Section -->
                <v-col cols="auto" class="d-flex justify-end">
                  <v-rating
                    hover
                    :length="5"
                    :size="32"
                    :model-value="4"
                    active-color="teal-darken-2"
                  />
                </v-col>
              </v-row>
            </v-card> </v-col
          ><v-col cols="12" md="6">
            <v-card color="#05161a" style="border-radius: 20px">
              <!-- Tutor Information and Social Media Icons -->
              <v-row class="mx-2 mt-2" align="center">
                <!-- Avatar -->
                <v-col cols="auto">
                  <v-avatar>
                    <v-img src="https://randomuser.me/api/portraits/men/95.jpg"></v-img>
                  </v-avatar>
                </v-col>

                <!-- Tutor Name and Subtitle -->
                <v-col>
                  <div>
                    <h3>James Bravo</h3>
                    <p>Goat</p>
                  </div>
                </v-col>

                <!-- Social Media Icons -->
                <v-col cols="auto" class="d-flex justify-end">
                  <v-btn icon="mdi-gmail" text color="#05161a" density="compact"></v-btn>
                  <v-btn icon="mdi-facebook" text color="#05161a" density="compact"></v-btn>
                  <v-btn icon="mdi-linkedin" text color="#05161a" density="compact"></v-btn>
                </v-col>
              </v-row>

              <!-- Description Section -->
              <v-container class="mt-2">
                <p>
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptates sed vero
                  mollitia nesciunt tenetur quaerat tempore possimus modi velit accusamus
                  dignissimos quae illo, sequi libero blanditiis error earum. Praesentium,
                  accusamus?
                </p>
              </v-container>

              <!-- Button and Rating Section -->
              <v-row class="mx-2 mb-2" align="center">
                <!-- Contact Tutor Button -->
                <v-col cols="auto">
                  <v-btn
                    class="text-white"
                    :loading="loading"
                    color="teal-darken-2"
                    size="small"
                    type="submit"
                    variant="elevated"
                    block
                    elevation="10"
                    style="border-radius: 30px"
                    height="40px"
                    href=""
                    append-icon="mdi-phone-plus"
                  >
                    Contact Tutor
                  </v-btn>
                </v-col>

                <!-- Rating Section -->
                <v-col cols="auto" class="d-flex justify-end">
                  <v-rating
                    hover
                    :length="5"
                    :size="32"
                    :model-value="4"
                    active-color="teal-darken-2"
                  />
                </v-col>
              </v-row>
            </v-card>
          </v-col>
          <v-col cols="12" md="6">
            <v-card color="#05161a" style="border-radius: 20px">
              <!-- Tutor Information and Social Media Icons -->
              <v-row class="mx-2 mt-2" align="center">
                <!-- Avatar -->
                <v-col cols="auto">
                  <v-avatar>
                    <v-img src="https://randomuser.me/api/portraits/men/53.jpg"></v-img>
                  </v-avatar>
                </v-col>

                <!-- Tutor Name and Subtitle -->
                <v-col>
                  <div>
                    <h3>Drunk It</h3>
                    <p>Lawyer</p>
                  </div>
                </v-col>

                <!-- Social Media Icons -->
                <v-col cols="auto" class="d-flex justify-end">
                  <v-btn icon="mdi-gmail" text color="#05161a" density="compact"></v-btn>
                  <v-btn icon="mdi-facebook" text color="#05161a" density="compact"></v-btn>
                  <v-btn icon="mdi-linkedin" text color="#05161a" density="compact"></v-btn>
                </v-col>
              </v-row>

              <!-- Description Section -->
              <v-container class="mt-2">
                <p>
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptates sed vero
                  mollitia nesciunt tenetur quaerat tempore possimus modi velit accusamus
                  dignissimos quae illo, sequi libero blanditiis error earum. Praesentium,
                  accusamus?
                </p>
              </v-container>

              <!-- Button and Rating Section -->
              <v-row class="mx-2 mb-2" align="center">
                <!-- Contact Tutor Button -->
                <v-col cols="auto">
                  <v-btn
                    class="text-white"
                    :loading="loading"
                    color="teal-darken-2"
                    size="small"
                    type="submit"
                    variant="elevated"
                    block
                    elevation="10"
                    style="border-radius: 30px"
                    height="40px"
                    href=""
                    append-icon="mdi-phone-plus"
                  >
                    Contact Tutor
                  </v-btn>
                </v-col>

                <!-- Rating Section -->
                <v-col cols="auto" class="d-flex justify-end">
                  <v-rating
                    hover
                    :length="5"
                    :size="32"
                    :model-value="4"
                    active-color="teal-darken-2"
                  />
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row> </v-container></template
  ></HomeLayout>
</template>
