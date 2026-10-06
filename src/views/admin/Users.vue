<template>
  <div style="padding: 20px;">
    <h2>账号管理</h2>
    <el-table :data="users">
      <el-table-column prop="username" label="用户名"/>
      <el-table-column prop="role" label="角色"/>
      <el-table-column prop="createTime" label="创建时间"/>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button type="primary" size="small" @click="handleToggleRole(scope.row)">
            {{ scope.row.role === 'admin' ? '降为学生' : '升为管理员' }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

const users = ref([])
const fetchUsers = async () => {
  try {
    const response = await fetch('/api/admin/users')
    users.value = await response.json()
  } catch (error) {
    ElMessage.error('获取用户列表失败')
  }
}
onMounted(() => {
  fetchUsers()
})

const handleToggleRole = (row: any) => {
  row.role = row.role === 'admin' ? 'student' : 'admin'
  ElMessage.success(`已将 ${row.username} 的角色改为 ${row.role === 'admin' ? '管理员' : '学生'}`)
}
</script>