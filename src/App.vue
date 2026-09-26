<template>
  <div class="wrap">
    <div v-if="isLoginPage" class="box">
      <h2 class="title">用户登录</h2>
      <div class="item">
        <input v-model="form.username" placeholder="请输入用户名" />
      </div>
      <div class="item">
        <input v-model="form.password" type="password" placeholder="请输入密码" />
      </div>
      <div class="check-box">
        <input id="rem" v-model="form.remember" type="checkbox" />
        <label for="rem">记住密码</label>
      </div>
      <button class="btn" @click="login">登录</button>
      <p class="msg red">{{ tip }}</p>
      <p class="switch">没有账号？<span @click="switchPage">去注册</span></p>
    </div>

    <div v-else class="box">
      <h2 class="title">账号注册</h2>
      <div class="item">
        <input v-model="regForm.username" placeholder="设置用户名" />
      </div>
      <div class="item">
        <input v-model="regForm.password" type="password" placeholder="设置密码" />
      </div>
      <div class="item">
        <input v-model="regForm.rePwd" type="password" placeholder="再次输入密码" />
      </div>
      <button class="btn reg-btn" @click="register">完成注册</button>
      <p class="msg red">{{ regTip }}</p>
      <p class="switch">已有账号？<span @click="switchPage">去登录</span></p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
const isLoginPage = ref(true)
const form = ref({
  username: '',
  password: '',
  remember: false
})
const tip = ref('')

const regForm = ref({
  username: '',
  password: '',
  rePwd: ''
})
const regTip = ref('')

const switchPage = () => {
  isLoginPage.value = !isLoginPage.value
  tip.value = ''
  regTip.value = ''
}

onMounted(() => {
  const cache = localStorage.getItem('user')
  if (cache) {
    const data = JSON.parse(cache)
    form.value.username = data.username
    form.value.password = data.password
    form.value.remember = true
  }
})

const login = () => {
  tip.value = ''
  const { username, password } = form.value
  if (!username) return tip.value = '请填写用户名'
  if (!password) return tip.value = '请填写密码'
  const userList = JSON.parse(localStorage.getItem('userList') || '[]')
  const user = userList.find(item => item.username === username && item.password === password)
  if (user) {
    tip.value = '登录成功'
    if (form.value.remember) {
      localStorage.setItem('user', JSON.stringify(form.value))
    } else {
      localStorage.removeItem('user')
    }
  } else {
    tip.value = '账号不存在或密码错误'
  }
}

const register = () => {
  regTip.value = ''
  const { username, password, rePwd } = regForm.value
  if (!username) return regTip.value = '请设置用户名'
  if (!password) return regTip.value = '请设置密码'
  if (password !== rePwd) return regTip.value = '两次密码输入不一致'
  const userList = JSON.parse(localStorage.getItem('userList') || '[]')
  const exist = userList.some(item => item.username === username)
  if (exist) return regTip.value = '该用户名已被注册'
  userList.push({ username, password })
  localStorage.setItem('userList', JSON.stringify(userList))
  regTip.value = '注册成功，请登录'
  form.value.username = username
  regForm.value = { username: '', password: '', rePwd: '' }
  setTimeout(() => {
    isLoginPage.value = true
  }, 1000)
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  border: none;
  box-sizing: border-box;
}
body {
  font-family: "Microsoft YaHei";
  font-size: 16px;
}
.wrap {
  width: 100vw;
  height: 100vh;
  background: #f4f7fa;
  display: flex;
  align-items: center;
  justify-content: center;
}
.box {
  width: 400px;
  background: #fff;
  padding: 45px 35px;
  border-radius: 14px;
  box-shadow: 0 2px 14px rgba(0,0,0,0.08);
}
.title {
  text-align: center;
  font-size: 30px;
  color: #222;
  margin-bottom: 32px;
}
.item {
  margin-bottom: 24px;
}
.item input {
  width: 100%;
  height: 48px;
  padding: 0 18px;
  border: 1px solid #e3e7ee;
  border-radius: 10px;
  font-size: 16px;
}
.item input:focus {
  outline: none;
  border-color: #409eff;
}
.check-box {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 28px;
  font-size: 15px;
  color: #555;
}
.check-box input {
  width: 16px;
  height: 16px;
  cursor: pointer;
}
.btn {
  width: 100%;
  height: 50px;
  background: #409eff;
  color: #fff;
  border-radius: 10px;
  font-size: 18px;
  cursor: pointer;
}
.reg-btn {
  background: #67c23a;
}
.msg {
  text-align: center;
  margin-top: 18px;
  height: 20px;
  font-size: 14px;
}
.red {
  color: #f56c6c;
}
.switch {
  text-align: center;
  margin-top: 24px;
  font-size: 15px;
  color: #666;
}
.switch span {
  color: #409eff;
  cursor: pointer;
}
.switch span:hover {
  text-decoration: underline;
}
</style>
