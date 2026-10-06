<template>
  <div style="padding: 20px;">
    <h2>账号管理</h2>
    <div style="margin-top: 12px;">
      <el-input
        v-model="keyword"
        placeholder="按学号或姓名搜索"
        clearable
        style="width: 240px; margin-right: 12px;"
        @keyup.enter="fetchUsers"
        @clear="fetchUsers"
      />
      <el-button type="primary" @click="fetchUsers">搜索</el-button>
    </div>
    <el-table :data="users" v-loading="loading" style="margin-top: 20px;">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="username" label="学号" width="160" />
      <el-table-column prop="name" label="姓名" width="120" />
      <el-table-column label="角色" width="180">
        <template #default="scope">
          <el-tag
            :type="scope.row.role === 'system_admin' ? 'danger' : scope.row.role === 'lost_admin' ? 'warning' : 'info'"
          >
            {{ roleLabel(scope.row.role) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="110">
        <template #default="scope">
          <el-tag size="small" :type="scope.row.status === 'active' ? 'success' : 'danger'">
            {{ scope.row.status === 'active' ? '正常' : '已禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="注册时间" width="190">
        <template #default="scope">
          {{ formatTime(scope.row.createdAt) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="220">
        <template #default="scope">
          <el-button type="primary" size="small" @click="handleChangeRole(scope.row)">切换角色</el-button>
          <el-button
            :type="scope.row.status === 'active' ? 'danger' : 'success'"
            size="small"
            @click="handleToggleStatus(scope.row)"
          >
            {{ scope.row.status === 'active' ? '禁用' : '启用' }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import request from '@/utils/request'

const users = ref<any[]>([])
const loading = ref(false)
const keyword = ref('')

const roleLabel = (role: string) => {
  if (role === 'system_admin') return '系统管理员'
  if (role === 'lost_admin') return '失物招领管理员'
  return '学生'
}
const formatTime = (v: string) => (v ? new Date(v).toLocaleString() : '')

const fetchUsers = async () => {
  loading.value = true
  try {
    const res: any = await request.get('/admin/users', {
      params: { page: 1, pageSize: 50, keyword: keyword.value || undefined },
    })
    // 后端返回 {users, meta}
    users.value = res.users
  } catch (e: any) {
    ElMessage.error(e.message || '获取用户列表失败')
  } finally {
    loading.value = false
  }
}

const handleChangeRole = async (row: any) => {
  // 循环切换：学生 → 失物招领管理员 → 系统管理员 → 学生
  const order: string[] = ['student', 'lost_admin', 'system_admin']
  const next: string = order[(order.indexOf(row.role) + 1) % order.length] ?? 'student'
  try {
    await ElMessageBox.confirm(
      `确定将 ${row.username}（${row.name}）的角色改为「${roleLabel(next)}」吗？`,
      '切换角色',
      { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
    )
  } catch {
    return
  }
  try {
    // 文档：PATCH /api/v1/admin/users/{userId}/role
    const res: any = await request.patch(`/admin/users/${row.id}/role`, { role: next })
    row.role = res.role
    ElMessage.success(`已将 ${row.username} 的角色改为 ${roleLabel(next)}`)
  } catch (e: any) {
    ElMessage.error(e.message || '修改角色失败')
  }
}

const handleToggleStatus = async (row: any) => {
  const next = row.status === 'active' ? 'disabled' : 'active'
  try {
    await ElMessageBox.confirm(
      next === 'disabled'
        ? `确定禁用 ${row.username} 吗？禁用后该账号将无法登录。`
        : `确定恢复 ${row.username} 为正常状态吗？`,
      next === 'disabled' ? '禁用账号' : '启用账号',
      { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
    )
  } catch {
    return
  }
  try {
    // 文档：PATCH /api/v1/admin/users/{userId}/status
    const res: any = await request.patch(`/admin/users/${row.id}/status`, { status: next })
    row.status = res.status
    ElMessage.success(next === 'disabled' ? '已禁用' : '已启用')
  } catch (e: any) {
    ElMessage.error(e.message || '操作失败')
  }
}

onMounted(() => {
  fetchUsers()
})
</script>
