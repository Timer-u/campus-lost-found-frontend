<template>
  <div class="detail" v-loading="loading">
    <el-page-header @back="router.back()" content="物品详情" class="header" />
    <template v-if="item">
      <el-card class="card">
        <div class="top">
          <div class="gallery">
            <img :src="imageList[current] || defaultImg" alt="物品图片" class="cover" />
            <div v-if="imageList.length > 1" class="thumbs">
              <img
                v-for="(url, index) in imageList"
                :key="url"
                :src="url"
                class="thumb"
                :class="{ active: index === current }"
                @click="current = index"
              />
            </div>
          </div>
          <div class="info">
            <div class="title-row">
              <h2>{{ item.title }}</h2>
              <el-tag :type="item.type === 'lost' ? 'danger' : 'success'">
                {{ item.type === 'lost' ? '失物' : '招领' }}
              </el-tag>
              <el-tag size="small" type="info">{{ ITEM_STATUS_TEXT[item.itemStatus] || item.itemStatus }}</el-tag>
            </div>
            <p class="desc">{{ item.description }}</p>
            <div class="meta">
              <div><el-icon><Location /></el-icon> {{ item.location }}</div>
              <div><el-icon><User /></el-icon> {{ item.publisherName || '匿名' }}</div>
              <div><el-icon><Clock /></el-icon> {{ formatTime(item.createdAt) }}</div>
            </div>
            <div class="contact">
              <span class="label">联系方式：</span>
              <span class="value">{{ item.contact }}</span>
            </div>
            <div class="actions">
              <el-button
                v-if="item.type === 'found' && item.itemStatus === 'open'"
                type="primary"
                :icon="ChatLineSquare"
                @click="dialogVisible = true"
              >
                申请认领
              </el-button>
              <el-tag v-else-if="item.type === 'lost'" type="info">捡到请联系发布者</el-tag>
            </div>
          </div>
        </div>
      </el-card>
    </template>
    <el-empty v-else-if="!loading" description="信息不存在或已删除" />
    <el-dialog v-model="dialogVisible" title="提交认领申请" width="460px">
      <el-form :model="claimForm" :rules="claimRules" ref="claimFormRef" label-width="80px">
        <el-form-item label="认领描述" prop="description">
          <el-input
            v-model="claimForm.description"
            type="textarea"
            :rows="4"
            placeholder="请描述物品特征、丢失经过等，以便发布者核实"
          />
        </el-form-item>
        <el-form-item label="联系方式" prop="contact">
          <el-input v-model="claimForm.contact" placeholder="手机号或微信号" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="submitClaim">提交申请</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import request from '@/utils/request'
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { Location, User, Clock, ChatLineSquare } from '@element-plus/icons-vue'
import { ITEM_STATUS_TEXT } from '@/constants/item'
import type { Item } from '@/types/api'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const item = ref<Item | null>(null)
const current = ref(0)
const imageList = computed(() => item.value?.imageUrls ?? [])
const defaultImg = 'https://via.placeholder.com/400x300?text=No+Image'
const dialogVisible = ref(false)
const submitting = ref(false)
const claimFormRef = ref<FormInstance>()
const claimForm = ref({ description: '', contact: '' })
const claimRules: FormRules = {
  description: [{ required: true, message: '请填写认领描述', trigger: 'blur' }],
  contact: [{ required: true, message: '请填写联系方式', trigger: 'blur' }],
}
const formatTime = (v: string) => (v ? new Date(v).toLocaleString() : '')
const fetchDetail = async () => {
  const id = route.params.id
  loading.value = true
  try {
    // 拦截器已返回 data（物品对象）
    item.value = await request.get<unknown, Item>(`/items/${id}`)
    current.value = 0
  } finally {
    loading.value = false
  }
}
const submitClaim = async () => {
  const target = item.value
  if (!claimFormRef.value || !target) return
  await claimFormRef.value.validate(async (valid) => {
    if (!valid) return
    submitting.value = true
    try {
      await request.post(`/items/${target.id}/claims`, {
        description: claimForm.value.description,
        contact: claimForm.value.contact,
      })
      ElMessage.success('申请已提交，等待管理员审核')
      dialogVisible.value = false
      claimForm.value = { description: '', contact: '' }
    } catch (e: any) {
      ElMessage.error(e.message || '提交失败')
    } finally {
      submitting.value = false
    }
  })
}
onMounted(() => {
  fetchDetail()
})
</script>
<style scoped>
.detail {
  padding: 20px;
  max-width: 900px;
  margin: 0 auto;
}
.header {
  margin-bottom: 20px;
}
.card {
  padding: 8px;
}
.top {
  display: flex;
  gap: 24px;
}
.gallery {
  width: 360px;
  flex-shrink: 0;
}
.cover {
  width: 360px;
  height: 280px;
  object-fit: cover;
  border-radius: 8px;
  background: #f0f2f5;
  display: block;
}
.thumbs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}
.thumb {
  width: 56px;
  height: 56px;
  object-fit: cover;
  border-radius: 4px;
  cursor: pointer;
  border: 2px solid transparent;
}
.thumb.active {
  border-color: #409eff;
}
.info {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.title-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}
.title-row h2 {
  margin: 0;
}
.desc {
  color: #606266;
  line-height: 1.5;
  margin: 8px 0 16px;
}
.meta {
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: #909399;
  font-size: 14px;
  margin-bottom: 16px;
  align-items:center;
}
.meta div {
  display: flex;
  align-items: center;
  gap: 4px;
}
.contact {
  font-size: 14px;
  margin-bottom: 16px;
}
.contact .label {
  color: #909399;
}
.contact .value {
  color: #409eff;
  font-weight: bold;
}
.actions {
  margin-top: auto;
}
</style>
