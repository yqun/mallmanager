import axios from 'axios'

const HttpTool = {}
HttpTool.install = (Vue) => {
  axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'

  Vue.prototype.$http = axios
}

export default HttpTool
