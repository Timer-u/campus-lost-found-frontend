<template>
  <div style="padding: 20px;">
    <h2>认领申请审核</h2>
    <el-table :data="claims" v-loading="loading" style="margin-top: 20px;">
      <el-table-column prop="username" label="申请人" width="120" />
      <el-table-column prop="itemTitle" label="物品标题" />
      <el-table-column prop="reason" label="认领理由" show-overflow-tooltip />
      <el-table-column prop="createTime" label="申请时间" width="180" />
      <el-table-column prop="status" label="状态" width="100" />
      <el-table-column label="操作" width="200">
        <template #default="scope">
          <el-button type="success" size="small" @click="handleAudit(scope.row, 'approved')">通过</el-button>
          <el-button type="danger" size="small" @click="handleAudit(scope.row, 'rejected')">驳回</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import request from '@/utils/request'

const claims = ref([])
const loading = ref(false)
const fetchClaims = async () => {
  loading.value = true
  try {
    const res: any = await request.get('/admin/claims')
    claims.value = res
  } catch (e: any) {
    ElMessage.error(e.message || '获取认领申请失败')
  } finally {
    loading.value = false
  }
}
const handleAudit = async (row: any, status: string) => {
  try {
    let reviewReason = ''
    if (status === 'rejected') {
      const { value } = await ElMessageBox.prompt('请输入驳回理由', '驳回申请', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      })
      reviewReason = value
    }
    await request.patch(`/admin/claims/${row.id}/status`, {
      status,
      reviewReason,
    })
    ElMessage.success('操作成功')
    fetchClaims()
  } catch (e: any) {
    if (e !== 'cancel') {
      ElMessage.error(e.message || '操作失败')
    }
  }
}
onMounted(() => {
  fetchClaims()
})
</script>
