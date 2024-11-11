import { isAuthenticated } from '@/utils/supabase'
import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/auth/LoginView.vue'
import RegisterView from '@/views/auth/RegisterView.vue'
import HomeView from '@/views/system/HomeView.vue'
import ProfileView from '@/views/system/ProfileView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'index'
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView
    }
  ]
})

router.beforeEach(async (to) => {
  const isLoggedIn = await isAuthenticated()

  // If navigating to the homepage (index), redirect based on authentication status
  if (to.name === 'index') {
    return isLoggedIn ? { name: 'home' } : { name: 'login' }
  }

  // If logged in, prevent access to login or register pages
  if (isLoggedIn && (to.name === 'login' || to.name === 'register')) {
    return { name: 'home' }
  }

  // If not logged in and trying to access any /system page, redirect to login
  if (!isLoggedIn && to.path.startsWith('/system')) {
    return { name: 'login' }
  }

  // Handle any 404 or undefined routes
  if (!router.resolve(to).matched.length) {
    return { name: 'not-found' }
  }
})

export default router
