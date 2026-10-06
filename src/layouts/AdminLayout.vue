<template>
  <el-container class="layout">
    <el-header class="header">
      <div class="logo">后台管理 - 失物招领</div>
      <div class="user">
        <el-button size="small" style="margin-right: 12px;" @click="router.push('/home')">
        返回学生端
        </el-button>
        <el-dropdown>
          <span class="user-name">{{ userStore.userInfo?.username || '管理员' }}</span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-menu router :default-active="$route.path">
          <el-menu-item index="/admin/audit">信息审核</el-menu-item>
          <template v-if="userStore.userInfo?.role === 'system_admin'">
            <el-menu-item index="/admin/users">账号管理</el-menu-item>
            <el-menu-item index="/admin/dashboard">数据总览</el-menu-item>
          </template>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
const router = useRouter()
const userStore = useUserStore()
const handleLogout = () => {
  userStore.logout()
  router.push('/login')
}
</script>
<style scoped>
.layout {
  height: 100vh;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #67c23a;
  color: #fff;
}
.logo {
  font-size: 18px;
  font-weight: bold;
}
.user-name {
  color: #fff;
  cursor: pointer;
}
</style>