<script setup>
import HomeLayout from '@/components/layout/HomeLayout.vue'
</script>

<template>
  <HomeLayout>
    <template #content>
      <v-container fluid>
        <v-row
          ><v-col cols="12" md="6" class="py-16">
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
                  <v-icon icon="mdi-gmail" class="mx-1"></v-icon>
                  <v-icon icon="mdi-facebook" class="mx-1"></v-icon>
                  <v-icon icon="mdi-twitter" class="mx-1"></v-icon>
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
                  <v-rating hover :length="5" :size="32" :model-value="4" active-color="teal-darken-2" />
                </v-col>
              </v-row>
            </v-card> 
            
            </v-col
        ><v-col cols="12" md="6" class="py-16">
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
                  <v-icon icon="mdi-gmail" class="mx-1"></v-icon>
                  <v-icon icon="mdi-facebook" class="mx-1"></v-icon>
                  <v-icon icon="mdi-twitter" class="mx-1"></v-icon>
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
                  <v-rating hover :length="5" :size="32" :model-value="4" active-color="teal-darken-2" />
                </v-col>
              </v-row>
            </v-card> 
            </v-col>
      </v-row>
    <v-row>
      <v-col cols="12" md="6" class="">
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
                  <v-icon icon="mdi-gmail" class="mx-1"></v-icon>
                  <v-icon icon="mdi-facebook" class="mx-1"></v-icon>
                  <v-icon icon="mdi-twitter" class="mx-1"></v-icon>
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
                  <v-rating hover :length="5" :size="32" :model-value="4" active-color="teal-darken-2" />
                </v-col>
              </v-row>
            </v-card> 
            
            </v-col
        ><v-col cols="12" md="6" class="">
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
                  <v-icon icon="mdi-gmail" class="mx-1"></v-icon>
                  <v-icon icon="mdi-facebook" class="mx-1"></v-icon>
                  <v-icon icon="mdi-twitter" class="mx-1"></v-icon>
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
                  <v-rating hover :length="5" :size="32" :model-value="4" active-color="teal-darken-2" />
                </v-col>
              </v-row>
            </v-card> 
            </v-col>
    </v-row>
    </v-container></template
  ></HomeLayout>
</template>
