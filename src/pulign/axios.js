import axios from 'axios'

const HttpTool = {}
HttpTool.install = (Vue) => {
  axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'

  // Add a request interceptor
  axios.interceptors.request.use(function (config) {
    // 除了登录功能，其他功能接口都需要token
    const AUTH_TOKEN = window.sessionStorage.getItem('token')
    // header 添加token
    config.headers.common['Authorization'] = AUTH_TOKEN
    // Do something before request is sent
    return config
  }, function (error) {
    // Do something with request error
    return Promise.reject(error)
  })

  // Add a response interceptor
  axios.interceptors.response.use(function (response) {
    // Do something with response data
    return response
  }, function (error) {
    // Do something with response error
    return Promise.reject(error)
  })

  Vue.prototype.$http = axios
}

export default HttpTool
