import { isAuthenticated, supabase } from '@/utils/supabase'
import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/auth/LoginView.vue'
import RegisterView from '@/views/auth/RegisterView.vue'
import HomeView from '@/views/system/HomeView.vue'
import ProfileView from '@/views/system/ProfileView.vue'
import ChatView from '@/views/system/ChatView.vue'
import AdminDashboard from '@/views/system/AdminDashboard.vue'
import AdminChat from '@/views/system/AdminChat.vue'
import AdminUsers from '@/views/system/AdminUsers.vue'
import TutorProfile from '@/views/system/TutorProfileView.vue'

const routes = [
  {
    path: '/',
    name: 'index',
    redirect: () => {
      return isAuthenticated() ? { name: 'home' } : { name: 'login' }
    }
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { requiresAuth: false }
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView,
    meta: { requiresAuth: false }
  },
  {
    path: '/home',
    name: 'home',
    component: HomeView,
    meta: { requiresAuth: true }
  },
  {
    path: '/messages',
    name: 'messages',
    component: ChatView,
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'profile',
    component: ProfileView,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin',
    name: 'admin',
    component: AdminDashboard,
    meta: { requiresAuth: true, role: 'Admin' }
  },
  {
    path: '/adminchat',
    name: 'adminchat',
    component: AdminChat,
    meta: { requiresAuth: true, role: 'Admin' }
  },
  {
    path: '/adminuser',
    name: 'adminuser',
    component: AdminUsers,
    meta: { requiresAuth: true, role: 'Admin' }
  },
  {
    path: '/tutor-profile/:userId',
    name: 'tutor-profile',
    component: TutorProfile
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach(async (to) => {
  const {
    data: { session }
  } = await supabase.auth.getSession()
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)

  if (requiresAuth && !session) {
    return { name: 'login' }
  }

  if (session && (to.name === 'login' || to.name === 'register')) {
    return { name: 'home' }
  }

  if (to.meta.role) {
    const {
      data: { user },
      error
    } = await supabase.auth.getUser()
    if (error || !user) {
      return { name: 'login' }
    }

    const { data: userData, error: roleError } = await supabase
      .from('users')
      .select('role')
      .eq('user_id', user.id)
      .single()

    if (roleError || !userData) {
      return { name: 'login' }
    }

    const userRole = userData.role

    if (userRole !== to.meta.role) {
      if (userRole === 'Tutor' || userRole === 'Student') {
        return { name: 'home' }
      }
      return { name: 'login' }
    }
  }
})

export default router
