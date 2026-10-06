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
            <el-button type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
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

  <el-dialog v-model="dialogvisible" title="编辑信息" width="500px">
    <el-form :model="editform" label-width="80px">
      <el-form-item label="标题">
        <el-input v-model="editform.title"/>
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="editform.description" type="textarea"/>
      </el-form-item>
      <el-form-item label="地点">
        <el-input v-model="editform.location"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogvisible = false">取消</el-button>
      <el-button type="primary" @click="handleSave">保存</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import request from '@/utils/request'
import { ElDescriptions, ElMessage, ElMessageBox } from 'element-plus'
const activeTab = ref('published')
const myItems = ref<any[]>([])
const myClaims = ref<any[]>([])
const fetchMyItems = async () => {
  try {
    const response = await request.get('/student/my-items')
    myItems.value = response.data
  } catch (error) {
    ElMessage.error('获取我发布的记录失败')
  }
}

const fetchMyClaims = async () => {
  try {
    const response = await request.get('/student/my-claims')
    myClaims.value = response.data
  } catch (error) {
    ElMessage.error('获取认领申请失败')
  }
}
onMounted(() => {
  fetchMyItems()
  fetchMyClaims()
})
const dialogvisible = ref(false)
const editform = ref<any>({})
let editindex=-1
const handleEdit=(row:any) => {
  editform.value={...row}
  editindex=myItems.value.findIndex(item=>item.id===row.id)
  dialogvisible.value=true
}
const handleSave=() => {
  if(editindex!==-1){
    myItems.value[editindex]={...editform.value}
    ElMessage.success('保存成功')
    dialogvisible.value=false
  }
}
const handleDelete=(row:any) => {
  ElMessageBox.confirm('确定删除该记录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    const index=myItems.value.findIndex(item=>item.id===row.id)
    if(index!==-1){
      myItems.value.splice(index,1)
      ElMessage.success('删除成功')
    }
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}
</script>