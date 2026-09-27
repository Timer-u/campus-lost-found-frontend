import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // 登录页（不需要登录就能访问）
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/login/index.vue'),
    },
    // 学生端（需要登录）
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
    // 管理员端（需要管理员权限）
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

// ========== 全局路由守卫（拦截权限） ==========
router.beforeEach((to, _from, next) => {
  const userStore = useUserStore()

  // 1. 如果访问的是登录页，直接放行
  if (to.path === '/login') {
    next()
    return
  }

  // 2. 如果没登录，强制跳登录页
  if (!userStore.token) {
    next('/login')
    return
  }

  // 3. 如果访问的是管理员页面，但当前用户不是管理员
  if (to.meta.requiresAdmin && userStore.userInfo?.role !== 'admin') {
    next('/home') // 踢回学生首页
    return
  }

  // 4. 一切正常，放行
  next()
})

export default router
