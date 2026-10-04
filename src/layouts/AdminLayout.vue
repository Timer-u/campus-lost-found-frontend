<template>
  <el-container>
    <el-header class="header">
      <div class="logo">后台管理</div>
      <div class="user-name">管理员</div>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-menu router>
          <el-menu-item index="/admin/audit">信息审核</el-menu-item>
          <el-menu-item index="/admin/users">账号管理</el-menu-item>
          <el-menu-item index="/admin/dashboard">数据总览</el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

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