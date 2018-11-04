// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import moment from 'moment'
import HttpTool from './pulign/axios'
import App from './App'
import router from './router'
import myBread from '@/components/myBread'

// 导入css
import './assets/css/index.css'

Vue.use(ElementUI)
Vue.use(HttpTool)

Vue.filter('fmtData', (v) => {
  return moment(v).format('YYY-MM-DD')
})

Vue.config.productionTip = false
// 全局的面包屑导航
Vue.component(myBread.name, myBread)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
