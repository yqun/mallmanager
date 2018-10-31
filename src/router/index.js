import Vue from 'vue'
import Router from 'vue-router'

// 导入组价
import Login from '../views/login'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      component: Login
    }
  ]
})
