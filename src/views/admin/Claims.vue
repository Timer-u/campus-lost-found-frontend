<template>
  <div style="padding: 20px;">
    <h2>认领申请审核</h2>
    <div style="margin-top: 12px;">
      <el-radio-group v-model="status" @change="handleStatusChange">
        <el-radio-button label="">全部</el-radio-button>
        <el-radio-button label="pending">待审核</el-radio-button>
        <el-radio-button label="approved">已通过</el-radio-button>
        <el-radio-button label="rejected">未通过</el-radio-button>
        <el-radio-button label="cancelled">已取消</el-radio-button>
      </el-radio-group>
    </div>
    <el-table :data="claims" v-loading="loading" style="width: 100%; margin-top: 20px;">
      <el-table-column prop="applicantName" label="申请人" width="120" />
      <el-table-column prop="itemTitle" label="物品标题" min-width="140" />
      <el-table-column prop="description" label="认领描述" show-overflow-tooltip />
      <el-table-column prop="contact" label="联系方式" width="140" />
      <el-table-column label="状态" width="100">
        <template #default="scope">
          <el-tag size="small" :type="claimTagType(scope.row.status)">
            {{ claimText[scope.row.status] || scope.row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="申请时间" width="180">
        <template #default="scope">
          {{ formatTime(scope.row.createdAt) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template #default="scope">
          <el-button
            type="success"
            size="small"
            :disabled="scope.row.status !== 'pending'"
            @click="handleAudit(scope.row, 'approved')"
          >
            通过
          </el-button>
          <el-button
            type="danger"
            size="small"
            :disabled="scope.row.status !== 'pending'"
            @click="handleReject(scope.row)"
          >
            驳回
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="display: flex; justify-content: center; margin: 20px;">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="meta.total"
        :page-size="meta.pageSize"
        :current-page="meta.page"
        @current-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import request from '@/utils/request'

const claims = ref<any[]>([])
const loading = ref(false)
const status = ref('')
const page = ref(1)
const meta = ref({ page: 1, pageSize: 10, total: 0, totalPages: 1 })

const claimText: Record<string, string> = {
  pending: '待审核',
  approved: '已通过',
  rejected: '未通过',
  cancelled: '已取消',
}
const claimTagType = (status: string) =>
  status === 'approved' ? 'success' : status === 'pending' ? 'warning' : 'danger'

const formatTime = (v: string) => (v ? new Date(v).toLocaleString() : '')

const fetchClaims = async () => {
  loading.value = true
  try {
    // 文档：GET /api/v1/admin/claims（system_admin/lost_admin），返回 {claims, meta}，含 itemTitle/applicantName
    const res: any = await request.get('/admin/claims', {
      params: { page: page.value, pageSize: 10, status: status.value || undefined },
    })
    claims.value = res.claims
    meta.value = res.meta
  } catch (e: any) {
    ElMessage.error(e.message || '获取认领申请失败')
  } finally {
    loading.value = false
  }
}
const handleStatusChange = () => {
  page.value = 1
  fetchClaims()
}
const handlePageChange = (p: number) => {
  page.value = p
  fetchClaims()
}

const handleAudit = async (row: any, reviewStatus: string) => {
  try {
    await request.patch(`/admin/claims/${row.id}/status`, { status: reviewStatus })
    ElMessage.success(`已通过：${row.applicantName} 对「${row.itemTitle}」的申请`)
    fetchClaims()
  } catch (e: any) {
    ElMessage.error(e.message || '操作失败')
  }
}

const handleReject = (row: any) => {
  ElMessageBox.prompt('请填写未通过原因（会展示给申请人）', `驳回：${row.applicantName}`, {
    confirmButtonText: '确定驳回',
    cancelButtonText: '取消',
    inputType: 'textarea',
  })
    .then(async ({ value }) => {
      try {
        await request.patch(`/admin/claims/${row.id}/status`, {
          status: 'rejected',
          reviewReason: value || '',
        })
        ElMessage.success(`已驳回：${row.applicantName}`)
        fetchClaims()
      } catch (e: any) {
        ElMessage.error(e.message || '驳回失败')
      }
    })
    .catch(() => {
      ElMessage.info('已取消驳回')
    })
}

onMounted(() => {
  fetchClaims()
})
</script>
