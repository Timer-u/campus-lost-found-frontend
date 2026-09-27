<template>
  <el-container class="layout">
    <el-header class="header">
      <div class="logo">校园失物招领</div>
      <div class="user">
        <el-dropdown>
          <span class="user-name">{{ userStore.userInfo?.username || '用户' }}</span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="router.push('/profile')">个人中心</el-dropdown-item>
              <el-dropdown-item divided @click="handleLogout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-header>

    <el-container>
      <el-aside width="200px">
        <el-menu router :default-active="$route.path">
          <el-menu-item index="/home">
            <el-icon><HomeFilled /></el-icon>首页
          </el-menu-item>
          <el-menu-item index="/publish">
            <el-icon><Plus /></el-icon>发布信息
          </el-menu-item>
          <el-menu-item index="/profile">
            <el-icon><User /></el-icon>个人中心
          </el-menu-item>
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
import { HomeFilled, Plus, User } from '@element-plus/icons-vue'

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
  background: #409eff;
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
