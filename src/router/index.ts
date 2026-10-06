import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/login' },

    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/login/index.vue'),
    },

    {
      path: '/home',
      component: () => import('@/layouts/StudentLayout.vue'),
      children: [
        { path: '', name: 'Home', component: () => import('@/views/student/Home.vue') },
        { path: 'publish', name: 'Publish', component: () => import('@/views/student/Publish.vue') },
        { path: 'detail/:id', name: 'Detail', component: () => import('@/views/student/Detail.vue') },
        { path: 'profile', name: 'Profile', component: () => import('@/views/student/Profile.vue') },
      ],
    },

    {
      path: '/admin',
      component: () => import('@/layouts/AdminLayout.vue'),
      meta: { requiresAdmin: true },
      redirect: '/admin/audit',
      children: [
        {
          path: 'audit',
          name: 'Audit',
          component: () => import('@/views/admin/Audit.vue'),
        },
        {
          path: 'users',
          name: 'Users',
          component: () => import('@/views/admin/Users.vue'),
          meta: { requiresSysAdmin: true },
        },
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: () => import('@/views/admin/Dashboard.vue'),
          meta: { requiresSysAdmin: true },
        },
      ],
    },
  ],
})

router.beforeEach((to, _from, next) => {
  const userStore = useUserStore()
  const role = userStore.userInfo?.role

  if (to.path === '/login') {
    next()
    return
  }

  if (!userStore.token) {
    next('/login')
    return
  }

  if (to.meta.requiresAdmin) {
    if (role !== 'lost_admin' && role !== 'sys_admin') {
      next('/home')
      return
    }
  }

  if (to.meta.requiresSysAdmin) {
    if (role !== 'sys_admin') {
      next('/admin/audit')
      return
    }
  }

  next()
})

export default router
