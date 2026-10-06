<template>
  <div style="padding: 20px;">
    <h2>信息审核</h2>
    <el-table :data="auditList" style="width: 100%; margin-top: 20px;">
      <el-table-column prop="title" label="标题" />
      <el-table-column prop="username" label="发布人" />
      <el-table-column prop="type" label="类型" />
      <el-table-column prop="status" label="状态" />
      <el-table-column prop="createTime" label="发布时间" />
      <el-table-column label="操作">
        <template #default="scope">
          <el-button type="success" size="small" @click="handleApprove(scope.row)">通过</el-button>
          <el-button type="danger" size="small" @click="handleReject(scope.row)">驳回</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import request from '@/utils/request'
const auditList = ref([])
const loading = ref(false)
const fetchAuditList = async () => {
  try {
    const response = await request.get('/admin/audit')
    auditList.value = response.data
  } catch (error) {
    ElMessage.error('获取审核列表失败')
  }
  finally {
    loading.value = false
  }
}
onMounted(() => {
  fetchAuditList()
})
const handleApprove = (row: any) => {
  row.status = '已通过'
  ElMessage.success(`已通过：${row.title}`)
}

const handleReject = (row: any) => {
  row.status = '已驳回'
  ElMessage.warning(`已驳回：${row.title}`)
}

</script>