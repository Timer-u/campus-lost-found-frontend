<template>
  <div class="home">
    <h1>物品广场</h1>
  </div>
  <div style="margin: 0 20px;">
    <el-input
      v-model="keyword"
      placeholder="搜索标题 / 描述 / 地点"
      clearable
      style="width: 260px; margin-right: 12px;"
      @keyup.enter="fetchData"
      @clear="fetchData"
    />
    <el-button type="primary" @click="fetchData">搜索</el-button>
  </div>
  <el-tabs v-model="category" type="card" style="margin: 20px;">
    <el-tab-pane label="丢失物品" name="lost"></el-tab-pane>
    <el-tab-pane label="捡到物品" name="found"></el-tab-pane>
  </el-tabs>
  <div class="grid" v-loading="loading">
    <el-card v-for="item in filteredList" :key="item.id" class="card" shadow="hover" @click="router.push(`/home/detail/${item.id}`)">
      <h3>{{ item.title }}</h3>
      <p class="desc">{{ item.description }}</p>
      <p class="meta">
        <el-tag size="small" :type="item.type === 'lost' ? 'danger' : 'success'">
          {{ item.type === 'lost' ? '失物' : '招领' }}
        </el-tag>
        <span>{{ item.location }}</span>
        <span>{{ item.publisherName }}</span>
      </p>
    </el-card>
    <el-empty v-if="!loading && filteredList.length === 0" description="暂无物品信息" style="grid-column: 1 / -1;" />
  </div>
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
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import request from '@/utils/request'

const router = useRouter()
const list = ref<any[]>([])
const loading = ref(false)
const keyword = ref('')
const page = ref(1)
const meta = ref({ page: 1, pageSize: 10, total: 0, totalPages: 1 })

const fetchData = async () => {
  loading.value = true
  try {
    const res: any = await request.get('/items', {
      params: { page: page.value, pageSize: 10, keyword: keyword.value || undefined },
    })
    // 后端返回 {items, meta}
    list.value = res.items
    meta.value = res.meta
  } catch (error) {
    console.error('获取数据失败:', error)
  } finally {
    loading.value = false
  }
}
const handlePageChange = (p: number) => {
  page.value = p
  fetchData()
}
onMounted(() => {
  fetchData()
})
const category = ref('lost')
const filteredList = computed(() => {
  return list.value.filter((item) => item.type === category.value)
})
</script>
<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  padding: 20px;
}
.card {
  cursor: pointer;
}
.desc {
  color: #606266;
  font-size: 13px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.meta {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #909399;
  font-size: 12px;
  margin: 0;
}
</style>
