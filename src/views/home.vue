<template>
  <el-container class="container">
    <!--头部-->
    <el-header class="header">
      <el-col :span="4">
        <div class="grid-content bg-purple">
          <img src="../assets/images/logo.png" alt="">
        </div>
      </el-col>
      <el-col :span="19" class="middle">
        <h2>电商管理系统</h2>
      </el-col>
      <el-col :span="1">
        <a
          href="#"
          class="loginout"
        @click.prevent="Loginout">退出</a>
      </el-col>
    </el-header>
    <el-container>
      <!--导航-->
      <el-aside width="200px" class="aside">
        <el-menu
          :router="true"
          default-active="1"
          class="el-menu-vertical-demo menu"
          :unique-opened="true">
          <!-- 左侧导航-->
          <el-submenu :index="index + ''" v-for="(item1, index) in menus" :key="index">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{ item1.authName }}</span>
            </template>
            <el-menu-item :index="`/${item2.path}`" v-for="(item2, index) in item1.children" :key="index">
              <i class="el-icon-menu"></i>
              {{ item2.authName }}
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!--主体-->
      <el-main class="main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data () {
    return {
      menus: []
    }
  },
  beforeCreate () {
    // 判断是否登录成功
    const token = window.sessionStorage.getItem('token')
    // 未登录 跳转登录页面
    if (!token) return this.$router.push('/login')
    // 已登录 渲染home页面
    this.$router.push('/')
  },
  created () {
    this.getMenus()
  },
  methods: {
    // 退出登录
    Loginout () {
      // 清除 sessionStorage中的 token值
      window.sessionStorage.clear()
      // 页面跳转
      this.$router.push('/login')
      this.$message.success('退出成功')
    },
    // 获取动态权限
    async getMenus () {
      const res = await this.$http.get(`menus`)
      const { meta, data } = res.data
      if (meta.status === 200) {
        this.menus = data
      }
    }
  }
}
</script>
<style>
  .container {
    height: 100%;
  }

  .header {
    background-color: #b3c0d1;
  }

  .aside {
    background-color: #d3dce6;
  }

  .main {
    background-color: #e9eef3;
    height: 100%;
  }
  /* 头部样式 */
  .header .middle {
    line-height: 60px;
    color: #fff;
    text-align: center;
  }

  .header .loginout {
    line-height: 60px;
    /*text-decoration: none;*/
  }
  /* 边栏样式 */
  .aside .menu {
    height: 100%;
  }
</style>
