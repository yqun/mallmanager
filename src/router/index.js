import Vue from 'vue'
import Router from 'vue-router'
import { Message } from 'element-ui'

// 导入组价
import Login from '@/views/login'
import Home from '@/views/home'
import User from '@/views/user'
import Rights from '@/views/rights'
import Role from '@/views/role'
import Goodslist from '@/views/goodslist'
import Goodscate from '@/views/goodscate'
import Cateparams from '@/views/cateparams'
import GoodsAdd from '@/views/goodsadd'
import Orders from '@/views/orders'
import Reports from '@/views/reports'

Vue.use(Router)
const router = new Router({
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
          path: '/',
          component: User
        },
        {
          path: '/users',
          component: User
        },
        {
          path: '/rights',
          component: Rights
        },
        {
          path: '/roles',
          component: Role
        },
        {
          path: '/goods',
          component: Goodslist
        },
        {
          path: '/categories',
          component: Goodscate
        },
        {
          path: '/params',
          component: Cateparams
        },
        {
          path: '/goodsadd',
          component: GoodsAdd
        },
        {
          path: '/orders',
          component: Orders
        },
        {
          path: '/reports',
          component: Reports
        }
      ]
    }
  ]
})
// 在跳转之前会触发拦截
router.beforeEach((to, from, next) => {
  // console.log(to, from)
  if (to.path === '/login') {
    next()
  } else {
    const token = sessionStorage.getItem('token')
    if (!token) {
      router.push('/login')
      Message.warning('请先登录')
    } else {
      next()
    }
  }
})

export default router
