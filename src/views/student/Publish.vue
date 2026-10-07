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
          <el-option v-for="opt in CATEGORY_OPTIONS" :key="opt.value" :label="opt.label" :value="opt.value" />
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
        <div class="pics">
          <div v-for="(url, index) in form.imageUrls" :key="url" class="pic">
            <img :src="url" />
            <el-icon class="del" @click="removeImage(index)"><Close /></el-icon>
          </div>
          <el-upload
            v-if="form.imageUrls.length + uploadingCount < 6"
            class="uploader"
            :show-file-list="false"
            :http-request="handleUpload"
            accept="image/*"
            multiple
          >
            <el-icon v-loading="uploadingCount > 0" class="uploader-icon"><Plus /></el-icon>
          </el-upload>
        </div>
        <p class="tip">支持 jpg/png/gif/webp，单张不超过 5MB，最多 6 张，提交后需管理员审核</p>
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
import { Plus, Close } from '@element-plus/icons-vue'
import { CATEGORY_OPTIONS } from '@/constants/item'
import type { Item, UploadResult } from '@/types/api'

const router = useRouter()
const formRef = ref<FormInstance>()
const loading = ref(false)
const uploadingCount = ref(0)
const form = reactive({
  type: 'lost',
  title: '',
  description: '',
  category: '',
  location: '',
  contact: '',
  imageUrls: [] as string[],
})
const rules: FormRules = {
  type: [{ required: true, message: '请选择类型', trigger: 'change' }],
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  category: [{ required: true, message: '请选择分类', trigger: 'change' }],
  description: [{ required: true, message: '请输入描述', trigger: 'blur' }],
  location: [{ required: true, message: '请输入地点', trigger: 'blur' }],
  contact: [
    { required: true, message: '请输入联系方式', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$|^[a-zA-Z0-9_-]{5,20}$/, message: '手机号或微信号格式不正确', trigger: 'blur' },
  ],
}
// 选图后立即上传，拿到 URL 存进 imageUrls，发布时一起提交
const handleUpload = async (options: UploadRequestOptions) => {
  const raw = options.file as File
  if (raw.size > 5 * 1024 * 1024) {
    ElMessage.warning('图片不能超过 5MB')
    return
  }
  // 一次选多张时 http-request 会被连续调用，用进行中的数量一起判断
  if (form.imageUrls.length + uploadingCount.value >= 6) {
    ElMessage.warning('最多上传 6 张图片')
    return
  }
  uploadingCount.value++
  try {
    const fd = new FormData()
    fd.append('file', raw)
    const res = await request.post<unknown, UploadResult>('/uploads/images', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    form.imageUrls.push(res.url)
  } catch (e: any) {
    ElMessage.error(e.message || '图片上传失败')
  } finally {
    uploadingCount.value--
  }
}
const removeImage = (index: number) => {
  form.imageUrls.splice(index, 1)
}
const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    loading.value = true
    try {
      const res = await request.post<unknown, Item>('/items', {
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
.pics {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
.pic {
  position: relative;
  width: 150px;
  height: 150px;
}
.pic img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 6px;
}
.pic .del {
  position: absolute;
  top: -6px;
  right: -6px;
  cursor: pointer;
  color: #f56c6c;
  background: #fff;
  border-radius: 50%;
  font-size: 16px;
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
.tip {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}
</style>
