<template>
  <div style="padding: 20px;">
    <h2>信息审核</h2>
    <div style="margin-top: 12px;">
      <el-radio-group v-model="reviewStatus" @change="fetchAuditList">
        <el-radio-button label="">全部</el-radio-button>
        <el-radio-button label="pending">待审核</el-radio-button>
        <el-radio-button label="approved">已通过</el-radio-button>
        <el-radio-button label="rejected">已驳回</el-radio-button>
        <el-radio-button label="offline">已下架</el-radio-button>
      </el-radio-group>
    </div>
    <el-table :data="auditList" v-loading="loading" style="width: 100%; margin-top: 20px;">
      <el-table-column type="expand">
        <template #default="scope">
          <div class="detail">
            <p><span>描述</span>{{ scope.row.description }}</p>
            <p><span>地点</span>{{ scope.row.location }}</p>
            <p><span>联系方式</span>{{ scope.row.contact }}</p>
            <div class="pics" v-if="scope.row.imageUrls?.length">
              <el-image
                v-for="url in scope.row.imageUrls"
                :key="url"
                :src="url"
                :preview-src-list="scope.row.imageUrls"
                preview-teleported
                fit="cover"
              />
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="id" label="ID" width="70" />
      <el-table-column prop="title" label="标题" />
      <el-table-column prop="publisherName" label="发布人" width="120" />
      <el-table-column label="类型" width="90">
        <template #default="scope">
          <el-tag size="small" :type="scope.row.type === 'lost' ? 'danger' : 'success'">
            {{ scope.row.type === 'lost' ? '失物' : '招领' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="审核状态" width="110">
        <template #default="scope">
          <el-tag size="small" :type="reviewTagType(scope.row.reviewStatus)">
            {{ reviewText[scope.row.reviewStatus] || scope.row.reviewStatus }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="rejectReason" label="驳回原因" width="160" show-overflow-tooltip />
      <el-table-column label="更新时间" width="180">
        <template #default="scope">
          {{ formatTime(scope.row.updatedAt) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="220">
        <template #default="scope">
          <el-button
            type="success"
            size="small"
            :disabled="scope.row.reviewStatus === 'approved'"
            @click="handleReview(scope.row, 'approved')"
          >
            通过
          </el-button>
          <el-button
            type="danger"
            size="small"
            :disabled="scope.row.reviewStatus === 'rejected'"
            @click="handleReject(scope.row)"
          >
            驳回
          </el-button>
          <el-button
            type="warning"
            size="small"
            :disabled="scope.row.reviewStatus === 'offline'"
            @click="handleReview(scope.row, 'offline')"
          >
            下架
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

const auditList = ref<any[]>([])
const loading = ref(false)
const reviewStatus = ref('pending')

const reviewText: Record<string, string> = {
  pending: '待审核',
  approved: '已通过',
  rejected: '已驳回',
  offline: '已下架',
}
const reviewTagType = (status: string) =>
  status === 'approved' ? 'success' : status === 'pending' ? 'warning' : 'danger'

const formatTime = (v: string) => (v ? new Date(v).toLocaleString() : '')

const fetchAuditList = async () => {
  loading.value = true
  try {
    const res: any = await request.get('/admin/items', {
      params: { page: 1, pageSize: 50, reviewStatus: reviewStatus.value || undefined },
    })
    // 后端返回 {items, meta}，待审核优先
    auditList.value = res.items
  } catch (error) {
    ElMessage.error('获取审核列表失败')
  } finally {
    loading.value = false
  }
}

const handleReview = async (row: any, status: string) => {
  try {
    await request.patch(`/admin/items/${row.id}/review`, { reviewStatus: status })
    ElMessage.success(`已${reviewText[status]}：${row.title}`)
    fetchAuditList()
  } catch (e: any) {
    ElMessage.error(e.message || '审核失败')
  }
}

const handleReject = (row: any) => {
  ElMessageBox.prompt('请填写驳回原因（会展示给发布者）', `驳回：${row.title}`, {
    confirmButtonText: '确定驳回',
    cancelButtonText: '取消',
    inputType: 'textarea',
  })
    .then(async ({ value }) => {
      try {
        await request.patch(`/admin/items/${row.id}/review`, {
          reviewStatus: 'rejected',
          rejectReason: value || '',
        })
        ElMessage.success(`已驳回：${row.title}`)
        fetchAuditList()
      } catch (e: any) {
        ElMessage.error(e.message || '驳回失败')
      }
    })
    .catch(() => {
      ElMessage.info('已取消驳回')
    })
}

onMounted(() => {
  fetchAuditList()
})
</script>
<style scoped>
.detail {
  padding: 4px 48px 12px;
  color: #606266;
  font-size: 14px;
  line-height: 1.8;
}
.detail span {
  display: inline-block;
  width: 70px;
  color: #909399;
}
.pics {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}
.pics .el-image {
  width: 90px;
  height: 90px;
  border-radius: 4px;
}
</style>
