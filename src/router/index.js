import Vue from 'vue'
import Router from 'vue-router'

// 导入组价
import Login from '@/views/login'
import Home from '@/views/home'
import User from '@/views/user'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      component: Login
    },
    {
      path: '/',
      component: Home,
      children: [
        {
          path: '/users',
          component: User
        }
      ]
    }
  ]
})
