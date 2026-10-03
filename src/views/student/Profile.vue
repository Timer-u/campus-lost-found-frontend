<template>
  <div style="padding: 20px;">
    <h2>个人中心</h2>
  </div>
  <el-tabs v-model="activeTab" type="card" style="margin: 20px;">
    <el-tab-pane label="我发布的记录" name="published">
      <el-table :data="myItems">
        <el-table-column prop="title" label="标题" />
        <el-table-column prop="type" label="类型" />  
        <el-table-column prop="status" label="状态" />
        <el-table-column prop="createTime" label="发布时间" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button type="primary" size="small">编辑</el-button>
            <el-button type="danger" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-tab-pane>
   
    <el-tab-pane label="认领申请" name="claims">
      <el-table :data="myClaims">
        <el-table-column prop="itemTitle" label="物品标题" />
        <el-table-column prop="reason" label="认领理由" />
        <el-table-column prop="status" label="状态" />
        <el-table-column prop="applyTime" label="申请时间" />
      </el-table>
    </el-tab-pane>
  </el-tabs>
  
</template>

<script setup lang="ts">
import { ref } from 'vue'
const activeTab = ref('myItems')

const myItems = ref([
  { id: 1, title: '丢失一把黑色雨伞', type: 'lost', status: '已通过', createTime: '2026-09-20 10:30' },
  { id: 2, title: '捡到一张校园卡', type: 'found', status: '待审核', createTime: '2026-09-22 14:20' },
  { id: 3, title: '丢失一个蓝色水杯', type: 'lost', status: '已认领', createTime: '2026-09-23 09:10' },
  { id: 4, title: '捡到一副黑色耳机', type: 'found', status: '已驳回', createTime: '2026-09-24 16:45' },
])

const myClaims = ref([
  { id: 1, itemTitle: '捡到一张校园卡', reason: '卡面姓名和我的名字一致', status: '待审核', applyTime: '2026-09-23 11:00' },
  { id: 2, itemTitle: '捡到一副黑色耳机', reason: '耳机盒侧面有我的贴纸', status: '已通过', applyTime: '2026-09-25 15:30' },
  { id: 3, itemTitle: '捡到一个U盘', reason: 'U盘里有我的课程作业文件', status: '已驳回', applyTime: '2026-09-26 09:20' },
])

</script>