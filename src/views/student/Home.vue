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
//const list = ref([])
/*const fetchData = async () => {
  try {
    const response = await request.get('/api/items') // 假设后端接口为 /api/items
    list.value = response.data
  } catch (error) {
    console.error('获取数据失败:', error)
  }
}后端，有了后端把下面list删掉
onMounted(() => {
  fetchData()
})*/
const router = useRouter()
import {computed} from 'vue'
const category = ref("lost")
const list = computed(() => {
  return [
    { id: 1, title: '丢失一把黑色雨伞', description: '在图书馆门口丢失，伞柄有刻字', type: 'lost', location: '图书馆', image: '' },
    { id: 2, title: '捡到一张校园卡', description: '在第三食堂三楼捡到，姓名李某某', type: 'found', location: '第三食堂', image: '' },
    { id: 3, title: '丢失一个蓝色水杯', description: '在操场看台丢失，杯身有贴纸', type: 'lost', location: '操场', image: '' },
  { id: 4, title: '捡到一副黑色耳机', description: '在自习室捡到，充电盒上有划痕', type: 'found', location: '图书馆自习室', image: '' },
  { id: 5, title: '丢失一串钥匙', description: '在宿舍楼下丢失，挂着一个小熊挂件', type: 'lost', location: '6号宿舍楼', image: '' },
  { id: 6, title: '捡到一本专业书', description: '在教三楼302捡到，封面上有名字', type: 'found', location: '教三楼', image: '' },
  { id: 7, title: '丢失一个粉色保温杯', description: '在操场跑步时落下的，杯身上有卡通图案', type: 'lost', location: '操场', image: '' },
  { id: 8, title: '捡到一个黑色钱包', description: '在食堂门口捡到，内有少量现金和一张饭卡', type: 'found', location: '第一食堂', image: '' },
  { id: 9, title: '丢失一副眼镜', description: '在图书馆二楼靠窗位置丢失，黑色框架', type: 'lost', location: '图书馆', image: '' },
  { id: 10, title: '捡到一个U盘', description: '在机房捡到，银色，上面有个红色挂绳', type: 'found', location: '计算机机房', image: '' },
]
})
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
