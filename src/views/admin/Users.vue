<template>
  <div style="padding: 20px;">
    <h2>账号管理</h2>
    <el-table :data="users" v-loading="loading" style="margin-top: 20px;">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="username" label="用户名" />
      <el-table-column label="角色" width="180">
        <template #default="scope">
          <el-tag
            :type="scope.row.role === 'sys_admin' ? 'danger' : scope.row.role === 'lost_admin' ? 'warning' : 'info'"
          >
            {{ roleLabel(scope.row.role) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="注册时间" width="200" />
      <el-table-column label="操作" width="160">
        <template #default="scope">
          <el-button type="primary" size="small" @click="handleChangeRole(scope.row)">
            切换角色
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import request from '@/utils/request'
const users = ref([])
const loading = ref(false)
const roleLabel = (role: string) => {
  if (role === 'sys_admin') return '系统管理员'
  if (role === 'lost_admin') return '失物招领管理员'
  return '学生'
}
const fetchUsers = async () => {
  loading.value = true
  try {
    const res: any = await request.get('/admin/users')
    users.value = res
  } catch (e: any) {
    ElMessage.error(e.message || '获取用户列表失败')
  } finally {
    loading.value = false
  }
}
const handleChangeRole = async (row: any) => {
  const order = ['student', 'lost_admin', 'sys_admin']
  const nextIndex = (order.indexOf(row.role) + 1) % order.length
  const newRole = order[nextIndex] as string
  try {
    await request.put(`/admin/users/${row.id}/role`, { role: newRole })
    row.role = newRole
    ElMessage.success(`已将 ${row.username} 的角色改为 ${roleLabel(newRole)}`)
  } catch (e: any) {
    ElMessage.error(e.message || '修改角色失败')
  }
}
onMounted(() => {
  fetchUsers()
})
</script>
