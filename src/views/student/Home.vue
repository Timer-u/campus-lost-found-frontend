<template>
  <div class="home">
    <h1>学生首页</h1>
    <p>欢迎来到学生首页！</p>
    
  </div>
  <el-tabs v-model="category" type="card" style="margin: 20px;">
    <el-tab-pane label="丢失物品" name="lost"></el-tab-pane>
    <el-tab-pane label="捡到物品" name="found"></el-tab-pane>
  </el-tabs>
  <div class="grid">
    <el-card v-for="item in filteredList" :key="item.id" class="card" shadow="hover" @click="router.push(`/detail/${item.id}`)">
      <h3>{{ item.title }}</h3>
      <p>{{ item.description }}</p>
    </el-card>
  </div>
</template>
<script setup lang="ts">
import { ref,onMounted } from 'vue'
import { useRouter } from 'vue-router'
import request from '@/utils/request'
const list = ref<any[]>([])
const fetchData = async () => {
  try {
    const response = await request.get('/api/items') // 假设后端接口为 /api/items
    list.value = response.data
  } catch (error) {
    console.error('获取数据失败:', error)
  }
}
onMounted(() => {
  fetchData()
})
const router = useRouter()
import {computed} from 'vue'
const category = ref("lost")
const filteredList = computed(() => {
  return list.value.filter(item => item.type === category.value)
})
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  padding: 20px;
}
</style>
