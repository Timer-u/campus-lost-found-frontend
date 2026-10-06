import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
import router from '@/router'

const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  timeout: 10000,
})

service.interceptors.request.use(
  (config) => {
    const userStore = useUserStore()
    if (userStore.token) {
      config.headers.Authorization = `Bearer ${userStore.token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

service.interceptors.response.use(
  (response) => {
    const res = response.data
    // 后端统一响应 {code, msg, data}，code=0 表示成功
    if (res.code !== 0) {
      ElMessage.error(res.msg || '请求失败')
      // 10002 未登录或登录已过期
      if (res.code === 10002) {
        const userStore = useUserStore()
        userStore.logout()
        router.push('/login')
      }
      return Promise.reject(new Error(res.msg || 'Error'))
    }
    return res.data
  },
  (error) => {
    // 后端业务失败时 HTTP 状态码也可能是 4xx，响应体仍是 {code, msg}
    const data = error.response?.data
    if (data?.msg) {
      ElMessage.error(data.msg)
      if (data.code === 10002) {
        const userStore = useUserStore()
        userStore.logout()
        router.push('/login')
      }
    } else {
      ElMessage.error(error.message || '网络错误')
    }
    return Promise.reject(new Error(data?.msg || error.message || 'Error'))
  }
)

export default service
