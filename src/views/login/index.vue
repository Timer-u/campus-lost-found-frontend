<template>
  <div class="wrap">
    <div v-if="isLoginPage" class="box">
      <h2 class="title">账号登录</h2>
      <el-form :model="form" :rules="rules" ref="loginFormRef">
        <el-form-item prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="form.password" type="password" placeholder="请输入密码" show-password />
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="form.remember">记住密码</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width: 100%" :loading="loading" @click="handleLogin">登录</el-button>
        </el-form-item>
      </el-form>
      <p class="msg red">{{ tip }}</p>
      <p class="switch">没有账号？<span @click="switchPage">去注册</span></p>
    </div>

    <div v-else class="box">
      <h2 class="title">账号注册</h2>
      <el-form :model="regForm" :rules="regRules" ref="regFormRef">
        <el-form-item prop="username">
          <el-input v-model="regForm.username" placeholder="设置用户名" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="regForm.password" type="password" placeholder="设置密码" show-password />
        </el-form-item>
        <el-form-item prop="rePwd">
          <el-input v-model="regForm.rePwd" type="password" placeholder="再次输入密码" show-password />
        </el-form-item>
        <el-form-item>
          <el-button type="success" style="width: 100%" :loading="regLoading" @click="handleRegister">
            完成注册
          </el-button>
        </el-form-item>
      </el-form>
      <p class="msg red">{{ regTip }}</p>
      <p class="switch">已有账号？<span @click="switchPage">去登录</span></p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { useUserStore } from '@/stores/user'
import request from '@/utils/request' // 稍后封装接口时用

const router = useRouter()//页面跳转
const userStore = useUserStore()

const isLoginPage = ref(true)
const loading = ref(false)
const regLoading = ref(false)
const tip = ref('')
const regTip = ref('')

const loginFormRef = ref<FormInstance>()
const regFormRef = ref<FormInstance>()//这两个是用来表单校验（？）

const form = reactive({
  username: '',
  password: '',
  remember: false,
})
const regForm = reactive({
  username: '',
  password: '',
  rePwd: '',
})
const rules: FormRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码至少 6 位', trigger: 'blur' },
  ],
}
const regRules: FormRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码至少 6 位', trigger: 'blur' },
  ],
  rePwd: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    {
      validator: (_rule, value, callback) => {
        if (value !== regForm.password) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
}
const switchPage = () => {
  isLoginPage.value = !isLoginPage.value
  tip.value = ''
  regTip.value = ''
}
const handleLogin = async () => {
  if (!loginFormRef.value) return
  await loginFormRef.value.validate(async (valid) => {
    if (!valid) return
    loading.value = true
    try {
      const res: any = await request.post('/auth/login', {
        username: form.username,
        password: form.password,
      })
      userStore.setToken(res.token)
      userStore.setUserInfo(res.userInfo)
      router.push('/home')
      ElMessage.success('登录成功')
    } catch (e: any) {
      tip.value = e.message || '登录失败'
    } finally {
      loading.value = false
    }
  })
}

const handleRegister = async () => {
  if (!regFormRef.value) return
  await regFormRef.value.validate(async (valid) => {
    if (!valid) return
    regLoading.value = true
    try {
      await request.post('/auth/register', { username: regForm.username, password: regForm.password })
      regTip.value = '注册成功！请登录'
    } catch (e: any) {
      regTip.value = e.message || '注册失败'
    } finally {
      regLoading.value = false
    }
  })
}
</script>

<style scoped>
.wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #f5f7fa;
}
.box {
  background: #fff;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 400px;
}
.title {
  text-align: center;
  margin-bottom: 24px;
}
.msg {
  font-size: 14px;
  margin: 8px 0;
  min-height: 20px;
}
.red {
  color: #f56c6c;
}
.switch {
  text-align: center;
  font-size: 14px;
  color: #606266;
  margin-top: 12px;
}
.switch span {
  color: #409eff;
  cursor: pointer;
}
</style>