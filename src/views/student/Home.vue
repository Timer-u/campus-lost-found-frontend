<template>
  <div class="home">
    <h1>物品广场</h1>
  </div>
  <div class="filter">
    <el-input
      v-model="keyword"
      placeholder="搜索标题 / 描述 / 地点"
      clearable
      style="width: 240px;"
      @keyup.enter="handleSearch"
      @clear="handleSearch"
    />
    <el-select
      v-model="category"
      placeholder="全部分类"
      clearable
      style="width: 150px;"
      @change="handleSearch"
    >
      <el-option v-for="opt in CATEGORY_OPTIONS" :key="opt.value" :label="opt.label" :value="opt.value" />
    </el-select>
    <el-select
      v-model="itemStatus"
      placeholder="全部状态"
      clearable
      style="width: 140px;"
      @change="handleSearch"
    >
      <el-option v-for="opt in ITEM_STATUS_OPTIONS" :key="opt.value" :label="opt.label" :value="opt.value" />
    </el-select>
    <el-input
      v-model="location"
      placeholder="地点"
      clearable
      style="width: 160px;"
      @keyup.enter="handleSearch"
      @clear="handleSearch"
    />
    <el-select v-model="sort" style="width: 130px;" @change="handleSearch">
      <el-option label="最新发布" value="latest" />
      <el-option label="最早发布" value="oldest" />
    </el-select>
    <el-button type="primary" @click="handleSearch">搜索</el-button>
    <el-button @click="handleReset">重置</el-button>
  </div>
  <el-tabs v-model="itemType" type="card" style="margin: 20px;">
    <el-tab-pane label="丢失物品" name="lost" />
    <el-tab-pane label="捡到物品" name="found" />
  </el-tabs>
  <div class="grid" v-loading="loading">
    <el-card
      v-for="item in list"
      :key="item.id"
      class="card"
      shadow="hover"
      @click="router.push(`/home/detail/${item.id}?type=${item.type}`)"
    >
      <h3>{{ item.title }}</h3>
      <p class="desc">{{ item.description }}</p>
      <p class="meta">
        <el-tag size="small" :type="item.type === 'lost' ? 'danger' : 'success'">
          {{ item.type === 'lost' ? '失物' : '招领' }}
        </el-tag>
        <span>{{ CATEGORY_TEXT[item.category] || item.category }}</span>
        <span>{{ item.location }}</span>
        <span>{{ item.publisherName }}</span>
      </p>
    </el-card>
    <el-empty v-if="!loading && list.length === 0" description="暂无物品信息" style="grid-column: 1 / -1;" />
  </div>
  <div class="pager">
    <el-pagination
      background
      layout="prev, pager, next, total"
      :total="meta.total"
      :page-size="meta.pageSize"
      :current-page="meta.page"
      @current-change="handlePageChange"
    />
  </div>
</template>
<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import request from '@/utils/request'
import { CATEGORY_OPTIONS, CATEGORY_TEXT, ITEM_STATUS_OPTIONS } from '@/constants/item'
import type { Item, ItemListQuery, ItemListResult, ItemStatus, ItemType, PageMeta } from '@/types/api'

const route = useRoute()
const router = useRouter()
const list = ref<Item[]>([])
const loading = ref(false)
const keyword = ref('')
const category = ref('')
const itemStatus = ref<ItemStatus | ''>('')
const location = ref('')
const sort = ref<'latest' | 'oldest'>('latest')
// 从详情页返回会带着 type，按它初始化，避免跳回默认的失物
const itemType = ref<ItemType>(route.query.type === 'found' ? 'found' : 'lost')
const page = ref(1)
const meta = ref<PageMeta>({ page: 1, pageSize: 10, total: 0, totalPages: 1 })

const fetchData = async () => {
  loading.value = true
  try {
    const params: ItemListQuery = {
      page: page.value,
      pageSize: 10,
      type: itemType.value,
      sort: sort.value,
      keyword: keyword.value || undefined,
      category: category.value || undefined,
      itemStatus: itemStatus.value || undefined,
      location: location.value || undefined,
    }
    // 筛选、排序、分页都交给后端，避免本地过滤后与分页数据对不上
    const res = await request.get<unknown, ItemListResult>('/items', { params })
    list.value = res.items
    meta.value = res.meta
  } catch (error) {
    console.error('获取数据失败:', error)
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  page.value = 1
  fetchData()
}

const handlePageChange = (p: number) => {
  page.value = p
  fetchData()
}

const handleReset = () => {
  keyword.value = ''
  category.value = ''
  itemStatus.value = ''
  location.value = ''
  sort.value = 'latest'
  handleSearch()
}

watch(itemType, handleSearch)

onMounted(() => {
  fetchData()
})
</script>
<style scoped>
.filter {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin: 0 20px;
}
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
.pager {
  display: flex;
  justify-content: center;
  margin: 20px;
}
</style>
