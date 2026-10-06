<template>
  <div style="padding: 20px;">
    <h2>个人中心</h2>
  </div>
  <el-tabs v-model="activeTab" type="card" style="margin: 20px;">
    <el-tab-pane label="我发布的记录" name="published">
      <el-table :data="myItems" v-loading="loading" style="width: 100%;">
        <el-table-column prop="title" label="标题" />
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
        <el-table-column label="物品状态" width="100">
          <template #default="scope">
            {{ itemStatusText[scope.row.itemStatus] || scope.row.itemStatus }}
          </template>
        </el-table-column>
        <el-table-column label="发布时间" width="180">
          <template #default="scope">
            {{ formatTime(scope.row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160">
          <template #default="scope">
            <el-button type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-tab-pane>

    <el-tab-pane label="认领申请" name="claims">
      <el-table :data="myClaims" v-loading="loading" style="width: 100%;">
        <el-table-column label="物品" width="200">
          <template #default="scope">
            <el-link type="primary" @click="router.push(`/home/detail/${scope.row.itemId}`)">
              {{ itemTitle(scope.row.itemId) }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="认领描述" />
        <el-table-column label="状态" width="110">
          <template #default="scope">
            <el-tag size="small" :type="reviewTagType(scope.row.status)">
              {{ claimText[scope.row.status] || scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="申请时间" width="180">
          <template #default="scope">
            {{ formatTime(scope.row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template #default="scope">
            <el-button
              v-if="scope.row.status === 'pending'"
              type="warning"
              size="small"
              @click="handleCancel(scope.row)"
            >
              取消申请
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-tab-pane>
  </el-tabs>

  <el-dialog v-model="dialogvisible" title="编辑信息" width="500px">
    <el-form :model="editform" label-width="80px">
      <el-form-item label="标题">
        <el-input v-model="editform.title" maxlength="100" />
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="editform.description" type="textarea" maxlength="2000" />
      </el-form-item>
      <el-form-item label="地点">
        <el-input v-model="editform.location" maxlength="100" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogvisible = false">取消</el-button>
      <el-button type="primary" :loading="saving" @click="handleSave">保存</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import request from '@/utils/request'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const activeTab = ref('published')
const myItems = ref<any[]>([])
const myClaims = ref<any[]>([])
const allItems = ref<any[]>([])
const loading = ref(false)
const saving = ref(false)

const reviewText: Record<string, string> = {
  pending: '待审核',
  approved: '已通过',
  rejected: '已驳回',
  offline: '已下架',
}
const itemStatusText: Record<string, string> = {
  open: '开放中',
  claimed: '已认领',
  resolved: '已解决',
  closed: '已关闭',
}
const claimText: Record<string, string> = {
  pending: '待审核',
  approved: '已通过',
  rejected: '未通过',
  cancelled: '已取消',
}
const reviewTagType = (status: string) =>
  status === 'approved' ? 'success' : status === 'pending' ? 'warning' : 'danger'

const formatTime = (v: string) => (v ? new Date(v).toLocaleString() : '')

// 物品标题映射：认领申请里只有 itemId，用公开列表把标题查出来
const itemTitle = (itemId: number) => {
  const item = allItems.value.find((i) => i.id === itemId)
  return item ? item.title : `物品 #${itemId}`
}

const fetchMyItems = async () => {
  loading.value = true
  try {
    const res: any = await request.get('/me/items', { params: { page: 1, pageSize: 50 } })
    myItems.value = res.items
  } catch (error) {
    ElMessage.error('获取我发布的记录失败')
  } finally {
    loading.value = false
  }
}

const fetchMyClaims = async () => {
  try {
    const res: any = await request.get('/me/claims', { params: { page: 1, pageSize: 50 } })
    myClaims.value = res.claims
  } catch (error) {
    ElMessage.error('获取认领申请失败')
  }
}

const fetchAllItems = async () => {
  try {
    const res: any = await request.get('/items', { params: { page: 1, pageSize: 50 } })
    allItems.value = res.items
  } catch (error) {
    // 公开列表失败不影响页面其余部分
    console.error('获取物品列表失败:', error)
  }
}

onMounted(() => {
  fetchMyItems()
  fetchMyClaims()
  fetchAllItems()
})

const dialogvisible = ref(false)
const editform = ref<any>({})
let editId = 0
const handleEdit = (row: any) => {
  editId = row.id
  editform.value = { title: row.title, description: row.description, location: row.location }
  dialogvisible.value = true
}
const handleSave = async () => {
  saving.value = true
  try {
    // 文档：PATCH /api/v1/items/{itemId}，修改后物品回到待审核
    await request.patch(`/items/${editId}`, {
      title: editform.value.title,
      description: editform.value.description,
      location: editform.value.location,
    })
    ElMessage.success('保存成功，物品已回到待审核状态')
    dialogvisible.value = false
    fetchMyItems()
  } catch (e: any) {
    ElMessage.error(e.message || '保存失败')
  } finally {
    saving.value = false
  }
}
const handleDelete = (row: any) => {
  ElMessageBox.confirm('确定删除该发布吗？删除后不可恢复。', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      try {
        await request.delete(`/items/${row.id}`)
        ElMessage.success('删除成功')
        fetchMyItems()
      } catch (e: any) {
        ElMessage.error(e.message || '删除失败')
      }
    })
    .catch(() => {
      ElMessage.info('已取消删除')
    })
}
const handleCancel = (row: any) => {
  ElMessageBox.confirm('确定取消该认领申请吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      try {
        // 文档：POST /api/v1/claims/{claimId}/cancel，仅 pending 可取消
        await request.post(`/claims/${row.id}/cancel`)
        ElMessage.success('已取消申请')
        fetchMyClaims()
      } catch (e: any) {
        ElMessage.error(e.message || '取消失败')
      }
    })
    .catch(() => {
      ElMessage.info('已取消操作')
    })
}
</script>
