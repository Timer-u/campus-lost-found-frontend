import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/login/index.vue'),
    },
    {
      path: '/',
      component: () => import('@/layouts/StudentLayout.vue'),
      redirect: '/home',
      children: [
        {
          path: 'home',
          name: 'Home',
          component: () => import('@/views/student/Home.vue'),
        },
        {
          path: 'publish',
          name: 'Publish',
          component: () => import('@/views/student/Publish.vue'),
        },
        {
          path: 'detail/:id',
          name: 'Detail',
          component: () => import('@/views/student/Detail.vue'),
        },
        {
          path: 'profile',
          name: 'Profile',
          component: () => import('@/views/student/Profile.vue'),
        },
      ],
    },
    {
      path: '/admin',
      component: () => import('@/layouts/AdminLayout.vue'),
      meta: { requiresAdmin: true },
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: () => import('@/views/admin/Dashboard.vue'),
        },
        {
          path: 'audit',
          name: 'Audit',
          component: () => import('@/views/admin/Audit.vue'),
        },
        {
          path: 'users',
          name: 'Users',
          component: () => import('@/views/admin/Users.vue'),
        },
      ],
    },
  ],
})

router.beforeEach((to, _from, next) => {
  const userStore = useUserStore()
  if (to.path === '/login') {
    next()
    return
  }
  if (!userStore.token) {
    next('/login')
    return
  }
  if (to.meta.requiresAdmin && userStore.userInfo?.role !== 'admin') {
    next('/home')
    return
  }
  next()
})
export default router
