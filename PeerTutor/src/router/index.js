import { isAuthenticated, supabase } from '@/utils/supabase';
import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '@/views/auth/LoginView.vue';
import RegisterView from '@/views/auth/RegisterView.vue';
import HomeView from '@/views/system/HomeView.vue';
import ProfileView from '@/views/system/ProfileView.vue';


const routes = [
  {
    path: '/',
    name: 'index',
    redirect: () => {
      return isAuthenticated() ? { name: 'home' } : { name: 'login' };
    },
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { requiresAuth: false },
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView,
    meta: { requiresAuth: false },
  },
  {
    path: '/home',
    name: 'home',
    component: HomeView,
    meta: { requiresAuth: true },
  },
  {
    path: '/profile',
    name: 'profile',
    component: ProfileView,
    meta: { requiresAuth: true },
  },

  {
    path: '/tutor-profile/:userId',
    name: 'tutor-profile',
    component: () => import('@/views/system/TutorProfileView.vue'),
    props: true,
    meta: { requiresAuth: true }
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to) => {
  const isLoggedIn = await isAuthenticated();

  if (to.meta.requiresAuth && !isLoggedIn) {
    return { name: 'login' };
  }

  if (isLoggedIn && (to.name === 'login' || to.name === 'register')) {
    return { name: 'home' };
  }
});

router.beforeEach(async (to, from, next) => {
  const { data: { session } } = await supabase.auth.getSession()
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  if (requiresAuth && !session) {
    next({ name: 'login' })
  } else if (!requiresAuth && session) {
    next({ name: 'home' })
  } else {
    next()
  }
})

export default router;