<script setup>
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { ref, onMounted, computed } from 'vue'
import { supabase } from '@/utils/supabase'

const searchQuery = ref('')
const users = ref([])
const loading = ref(false)
const reviews = ref([])
const subjects = ref([])

const totalUsers = ref(0)
const totalTutors = ref(0)
const totalStudents = ref(0)
const averageRating = ref(0)

const editUserDialog = ref(false)
const currentUser  = ref(null)

const fetchUsers = async () => {
  loading.value = true
  try {
    const { data: usersData, error: usersError } = await supabase
      .from('users')
      .select('*')

    if (usersError) {
      console.error('Error fetching users:', usersError)
      return
    }

    users.value = usersData
    totalUsers.value = usersData.length
    totalTutors.value = usersData.filter(user => user.role === 'Tutor').length
    totalStudents.value = usersData.filter(user => user.role === 'Student').length
  } catch (error) {
    console.error('Unexpected error:', error)
  } finally {
    loading.value = false
  }
}

const fetchReviews = async () => {
  try {
    const { data: reviewsData, error: reviewsError } = await supabase
      .from('reviews')
      .select('*')

    if (reviewsError) {
      console.error('Error fetching reviews:', reviewsError)
      return
    }

    reviews.value = reviewsData
    if (reviewsData.length > 0) {
      const totalRating = reviewsData.reduce((sum, review) => sum + review.rating, 0)
      averageRating.value = (totalRating / reviewsData.length).toFixed(1)
    } else {
      averageRating.value = 0
    }
  } catch (error) {
    console.error('Unexpected error:', error)
  }
}

const fetchSubjects = async () => {
  try {
    const { data: subjectsData, error: subjectsError } = await supabase
      .from('subjects')
      .select('id, subject_name')

    if (subjectsError) {
      console.error('Error fetching subjects:', subjectsError)
      return
    }

    subjects.value = subjectsData
  } catch (error) {
    console.error('Unexpected error:', error)
  }
}

const filteredUsers = computed(() =>
  users.value.filter((user) =>
    `${user.firstname} ${user.lastname} ${user.email}`
      .toLowerCase()
      .includes(searchQuery.value.toLowerCase())
  )
)

// Delete user
const deleteUser  = async (userId) => {
  try {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', userId)

    if (error) {
      console.error('Error deleting user:', error)
      return
    }

    // Refresh the user list after deletion
    fetchUsers()
  } catch (error) {
    console.error('Unexpected error:', error)
  }
}

// Open edit user dialog
const openEditUserDialog = (user) => {
  currentUser.value = { ...user } // Clone user data for editing
  editUserDialog.value = true
}

// Save edited user
const saveUser  = async () => {
  try {
    const { error } = await supabase
      .from('users')
      .update(currentUser .value)
      .eq('id', currentUser .value.id)

    if (error) {
      console.error('Error updating user:', error)
      return
    }

    editUserDialog.value = false
    fetchUsers()
  } catch (error) {
    console.error('Unexpected error:', error)
  }
}

onMounted(async () => {
  await Promise.all([fetchUsers(), fetchReviews(), fetchSubjects()])
})
</script>

<template>
  <AdminLayout>
    <template #content>
      <v-container fluid class="d-flex flex-column" style="background-color: #1E1E2F; color: white;">
        <v-row class="py-10">
          <v-col cols="12">
            <h2 class="text-h5">User  Statistics</h2>
            <v-row>
              <v-col cols="4">
                <v-card color="#2E2E3A" class="text-white">
                  <v-card-title>Total Users</v-card-title>
                  <v-card-subtitle>{{ totalUsers }}</v-card-subtitle>
                </v-card>
              </v-col>
              <v-col cols="4">
                <v-card color="#2E2E3A" class="text-white">
                  <v-card-title>Total Tutors</v-card-title>
                  <v-card-subtitle>{{ totalTutors }}</v-card-subtitle>
                </v-card>
              </v-col>
              <v-col cols="4">
                <v-card color="#2E2E3A" class="text-white">
                  <v-card-title>Total Students</v-card-title>
                  <v-card-subtitle>{{ totalStudents }}</v-card-subtitle>
                </v-card>
              </v-col>
              <v-col cols="4">
                <v-card color="#2E2E3A" class="text-white">
                  <v-card-title>Average Rating</v-card-title>
                  <v-card-subtitle>{{ averageRating }} / 5</v-card-subtitle>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <v-row class="py-10">
          <v-col>
            <v-text-field
              v-model="searchQuery"
              label="Search Users"
              append-icon="mdi-magnify"
              class="mb-4"
              outlined
              color="white"
            />
          </v-col>
        </v-row>

        <v-row class="py-10">
          <v-col
            v-for="user in filteredUsers"
            :key="user.id"
            cols="12"
            md="6"
            class="d-flex"
          >
            <v-card
              color="#2E2E3A"
              class="user-card d-flex flex-column"
              style="border-radius: 20px; padding: 16px; width: 100%"
            >
              <v-row class="mb-4" align="center">
                <v-col>
                  <h3 class="text-h5 mb-1">
                    {{ user.firstname }} {{ user.lastname }}
                  </h3>
                  <p class="text-body-2">{{ user.email }}</p>
                </v-col>
                <v-col cols="auto" class="d-flex justify-end">
                  <v-btn
                    icon="mdi-pencil"
                    text
                    color="yellow"
                    @click="openEditUserDialog(user)"
                  ></v-btn>
                  <v-btn
                    icon="mdi-delete"
                    text
                    color="red"
                    @click="deleteUser (user.id)"
                  ></v-btn>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>

        <!-- Reviews Section -->
        <v-row class="py-10">
          <v-col cols="12">
            <h2 class="text-h5">Reviews</h2>
            <v-list>
              <v-list-item-group>
                <v-list-item
                  v-for="review in reviews"
                  :key="review.id"
                >
                  <v-list-item-content>
                    <v-list-item-title>{{ review.content }}</v-list-item-title>
                    <v-list-item-subtitle>
                      Rated by: {{ review.user_id }} - Rating: {{ review.rating }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-col>
        </v-row>

        

        <!-- Edit User Dialog -->
        <v-dialog v-model="editUserDialog" max-width="600px ">
          <v-card>
            <v-card-title>
              <span class="text-h5">Edit User</span>
            </v-card-title>
            <v-card-text>
              <v-text-field
                v-model="currentUser .firstname"
                label="First Name"
                outlined
                color="primary"
              />
              <v-text-field
                v-model="currentUser .lastname"
                label="Last Name"
                outlined
                color="primary"
              />
              <v-text-field
                v-model="currentUser .email"
                label="Email"
                outlined
                color="primary"
              />
              <v-select
                v-model="currentUser .role"
                :items="['Admin', 'Tutor', 'Student']"
                label="Role"
                outlined
                color="primary"
              />
            </v-card-text>
            <v-card-actions>
              <v-btn color="green" @click="saveUser ">Save</v-btn>
              <v-btn color="red" @click="editUserDialog = false">Cancel</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-container>
    </template>
  </AdminLayout>
</template>

<style scoped>
.user-card {
  display: flex;
  flex-direction: column;
}

.v-btn {
  text-transform: none;
  font-weight: 500;
}

.clickable {
  cursor: pointer;
  transition: color 0.3s ease;
}

.clickable:hover {
  color: #e3f2fd;
}

.text-white {
  color: white;
}

.v-avatar {
  border-radius: 50%;
}

.tutor-card {
  display: flex;
  flex-direction: column;
}

.expertise-chip {
  margin-right: 5px;
}

.selected {
  background-color: #4caf50 !important;
}

.v-card {
  transition: transform 0.2s;
}

.v-card:hover {
  transform: scale(1.02);
}
</style>