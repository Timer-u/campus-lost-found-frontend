<template>
  <div class="publish">
    <h2 class="page-title">发布失物 / 招领信息</h2>
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="100px"
      class="form"
    >
      <el-form-item label="类型" prop="type">
        <el-radio-group v-model="form.type">
          <el-radio label="lost">失物</el-radio>
          <el-radio label="found">招领</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="标题" prop="title">
        <el-input v-model="form.title" placeholder="如：丢失一把黑色雨伞" maxlength="50" show-word-limit />
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input
          v-model="form.description"
          type="textarea"
          :rows="4"
          placeholder="请描述物品的特征、丢失/捡到的经过"
          maxlength="200"
          show-word-limit
        />
      </el-form-item>
      <el-form-item label="地点" prop="location">
        <el-input v-model="form.location" placeholder="如：图书馆三楼" />
      </el-form-item>
      <el-form-item label="联系方式" prop="contact">
        <el-input v-model="form.contact" placeholder="手机号或微信号" />
      </el-form-item>
      <el-form-item label="物品图片">
        <el-upload
          class="uploader"
          :show-file-list="false"
          :auto-upload="false"
          :on-change="handleImageChange"
          accept="image/*"
        >
          <img v-if="form.image" :src="form.image" class="preview" />
          <el-icon v-else class="uploader-icon"><Plus /></el-icon>
        </el-upload>
        <p class="tip">支持 jpg/png，建议小于 2MB</p>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="loading" @click="handleSubmit">
        </el-button>
        <el-button @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script setup lang="ts">
import request from '@/utils/request'
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules, type UploadFile } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
const router = useRouter()
const formRef = ref<FormInstance>()
const loading = ref(false)
const form = reactive({
  type: 'lost',
  title: '',
  description: '',
  location: '',
  contact: '',
  image: '',
})
const rules: FormRules = {
  type: [{ required: true, message: '请选择类型', trigger: 'change' }],
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  description: [{ required: true, message: '请输入描述', trigger: 'blur' }],
  location: [{ required: true, message: '请输入地点', trigger: 'blur' }],
  contact: [
    { required: true, message: '请输入联系方式', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$|^[a-zA-Z0-9_-]{5,20}$/, message: '手机号或微信号格式不正确', trigger: 'blur' },
  ],
}
const handleImageChange = (file: UploadFile) => {
  const raw = file.raw
  if (!raw) return
  if (raw.size > 2 * 1024 * 1024) {
    ElMessage.warning('图片不能超过 2MB')
    return
  }
  const reader = new FileReader()
  reader.onload = (e) => {
    form.image = e.target?.result as string
  }
  reader.readAsDataURL(raw)
}
const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    loading.value = true
    try {
      const res = await request.post('/items', form)
      ElMessage.success('发布成功')
      router.push(`/detail/${res.data.id}`)
      router.push('/home')
    } catch (e: any) {
      ElMessage.error(e.message || '发布失败')
    } finally {
      loading.value = false
    }
  })
}
const handleReset = () => {
  formRef.value?.resetFields()
  form.image = ''
}
</script>
<style scoped>
.publish {
  padding: 20px;
  max-width: 700px;
  margin: 0 auto;
}
.page-title {
  text-align: center;
  margin-bottom: 24px;
}
.form {
  background: #fff;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}
.uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  width: 150px;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.2s;
}
.uploader:hover {
  border-color: #409eff;
}
.uploader-icon {
  font-size: 32px;
  color: #909399;
}
.preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 6px;
}
.tip {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}
</style>