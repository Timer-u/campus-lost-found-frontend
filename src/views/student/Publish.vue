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
        <el-input v-model="form.title" placeholder="如：丢失一把黑色雨伞" maxlength="100" show-word-limit />
      </el-form-item>
      <el-form-item label="分类" prop="category">
        <el-select v-model="form.category" placeholder="请选择物品分类" style="width: 100%;">
          <el-option label="证件卡类" value="id_card" />
          <el-option label="钱包" value="wallet" />
          <el-option label="手机/耳机" value="phone" />
          <el-option label="电脑/平板" value="computer" />
          <el-option label="书籍" value="book" />
          <el-option label="衣物" value="clothing" />
          <el-option label="钥匙" value="key" />
          <el-option label="日用品" value="daily" />
          <el-option label="其他" value="other" />
        </el-select>
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input
          v-model="form.description"
          type="textarea"
          :rows="4"
          placeholder="请描述物品的特征、丢失/捡到的经过"
          maxlength="2000"
          show-word-limit
        />
      </el-form-item>
      <el-form-item label="地点" prop="location">
        <el-input v-model="form.location" placeholder="如：图书馆三楼" maxlength="100" />
      </el-form-item>
      <el-form-item label="联系方式" prop="contact">
        <el-input v-model="form.contact" placeholder="手机号或微信号" maxlength="100" />
      </el-form-item>
      <el-form-item label="物品图片">
        <el-upload
          class="uploader"
          :show-file-list="false"
          :http-request="handleUpload"
          accept="image/*"
        >
          <img v-if="form.image" :src="form.image" class="preview" />
          <el-icon v-else v-loading="uploading" class="uploader-icon"><Plus /></el-icon>
        </el-upload>
        <p class="tip">支持 jpg/png/gif/webp，单张不超过 5MB，发布后立即公开需等待审核</p>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="loading" @click="handleSubmit">发布</el-button>
        <el-button @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script setup lang="ts">
import request from '@/utils/request'
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules, type UploadRequestOptions } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
const router = useRouter()
const formRef = ref<FormInstance>()
const loading = ref(false)
const uploading = ref(false)
const form = reactive({
  type: 'lost',
  title: '',
  description: '',
  category: '',
  location: '',
  contact: '',
  image: '',
  imageUrls: [] as string[],
})
const rules: FormRules = {
  type: [{ required: true, message: '请选择类型', trigger: 'change' }],
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  category: [{ required: true, message: '请选择分类', trigger: 'change' }],
  description: [{ required: true, message: '请输入描述', trigger: 'blur' }],
  location: [{ required: true, message: '请输入地点', trigger: 'blur' }],
  contact: [{ required: true, message: '请输入联系方式', trigger: 'blur' }],
}
// 选择图片后立即上传到后端，拿到 URL 再随发布一起提交
const handleUpload = async (options: UploadRequestOptions) => {
  const raw = options.file as File
  if (raw.size > 5 * 1024 * 1024) {
    ElMessage.warning('图片不能超过 5MB')
    return
  }
  uploading.value = true
  try {
    const fd = new FormData()
    fd.append('file', raw)
    const res: any = await request.post('/uploads/images', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    form.imageUrls = [res.url]
    form.image = res.url // 走 Nginx/Gin 静态托管，本地预览与线上一致
    ElMessage.success('图片上传成功')
  } catch (e: any) {
    ElMessage.error(e.message || '图片上传失败')
  } finally {
    uploading.value = false
  }
}
const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    loading.value = true
    try {
      // 文档：POST /api/v1/items，成功返回 201 与物品信息
      const res: any = await request.post('/items', {
        type: form.type,
        title: form.title,
        description: form.description,
        category: form.category,
        location: form.location,
        contact: form.contact,
        imageUrls: form.imageUrls,
      })
      ElMessage.success('发布成功，等待管理员审核后公开')
      router.push(`/home/detail/${res.id}`)
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
  form.imageUrls = []
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
