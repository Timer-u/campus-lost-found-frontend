<template>
  <div class="dashboard">
    <h2>数据总览</h2>

    <el-row :gutter="20" style="margin-top: 16px;">
      <el-col :span="4" v-for="card in cards" :key="card.label">
        <el-card shadow="hover">
          <div class="stat-num">{{ card.value }}</div>
          <div class="stat-label">{{ card.label }}</div>
        </el-card>
      </el-col>
    </el-row>

    <div class="charts">
      <div ref="pieRef" class="chart"></div>
      <div ref="barRef" class="chart"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import * as echarts from 'echarts'
import request from '@/utils/request'
const pieRef = ref<HTMLElement>()
const barRef = ref<HTMLElement>()
const stats = ref<any>({})

const cards = computed(() => [
  { label: '注册用户', value: stats.value.userCount ?? '-' },
  { label: '物品总数', value: stats.value.itemCount ?? '-' },
  { label: '待审核物品', value: stats.value.pendingItemCount ?? '-' },
  { label: '认领申请', value: stats.value.claimCount ?? '-' },
  { label: '已解决物品', value: stats.value.resolvedItemCount ?? '-' },
])

const categoryText: Record<string, string> = {
  lost:'失物', found:'招领', id_card: '证件卡类', wallet: '钱包', phone: '手机/耳机', computer: '电脑/平板',
  book: '书籍', clothing: '衣物', key: '钥匙', daily: '日用品', other: '其他',
}

const fetchStats = async () => {
  try {
    // 文档：GET /api/v1/admin/statistics/overview，两级管理员均可
    stats.value = await request.get('/admin/statistics/overview')
  } catch (error) {
    console.error('获取统计数据失败:', error)
  }
}

const initCharts = () => {
  const byType = stats.value.itemsByType || {}

  const pie = echarts.init(pieRef.value!)
  pie.setOption({
    title: { text: '失物 / 招领比例', left: 'center' },
    tooltip: { trigger: 'item' },
    legend: { bottom: 0 },
    series: [
      {
        type: 'pie',
        radius: '60%',
        data: [
          { value: byType.lost || 0, name: '失物' },
          { value: byType.found || 0, name: '招领' },
        ],
        emphasis: {
          itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0,0,0,0.5)' },
        },
      },
    ],
  })

  // 物品分类分布（后端按 type 分组返回）
  const entries = Object.entries(byType)
  const bar = echarts.init(barRef.value!)
  bar.setOption({
    title: { text: '物品分类分布', left: 'center' },
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: entries.map(([k]) => categoryText[k] || k) },
    yAxis: { type: 'value', minInterval: 1 },
    series: [
      {
        type: 'bar',
        data: entries.map(([, v]) => v),
        itemStyle: { color: '#409eff' },
        barWidth: '40%',
      },
    ],
  })

  window.addEventListener('resize', () => {
    pie.resize()
    bar.resize()
  })
}
onMounted(async () => {
  await fetchStats()
  initCharts()
})
</script>
<style scoped>
.dashboard {
  padding: 20px;
}
.stat-num {
  font-size: 28px;
  font-weight: bold;
  color: #303133;
}
.stat-label {
  color: #909399;
  font-size: 13px;
  margin-top: 4px;
}
.charts {
  display: flex;
  gap: 20px;
  margin-top: 20px;
}
.chart {
  flex: 1;
  height: 400px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}
</style>
