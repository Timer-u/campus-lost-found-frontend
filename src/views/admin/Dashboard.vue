<template>
  <div class="dashboard">
    <h2>数据总览</h2>

    <div class="charts">
      <div ref="pieRef" class="chart"></div>
      <div ref="barRef" class="chart"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
import request from '@/utils/request'
const pieRef = ref<HTMLElement>()
const barRef = ref<HTMLElement>()
const stats = ref<any>({})

const fetchStats = async () => {
  try {
    const response = await request.get('/admin/stats')
    stats.value = response.data
  } catch (error) {
    console.error('获取统计数据失败:', error)
  }
}

const initCharts = () => {
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
          { value: stats.value.lostCount, name: '失物' },
          { value: stats.value.foundCount, name: '招领' },
        ],
        emphasis: {
          itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0,0,0,0.5)' },
        },
      },
    ],
  })
  const bar = echarts.init(barRef.value!)
  bar.setOption({
    title: { text: '每月发布数量', left: 'center' },
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: stats.value.months },
    yAxis: { type: 'value' },
    series: [
      {
        type: 'bar',
        data: stats.value.monthCounts,
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
onMounted(() => {
  fetchStats().then(() => {
    initCharts()
  })
})
</script>
<style scoped>
.dashboard {
  padding: 20px;
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
