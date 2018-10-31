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
          <!-- 1 用户管理-->
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>用户管理</span>
            </template>
            <el-menu-item index="/users">
              <i class="el-icon-menu"></i>
              用户列表
            </el-menu-item>
          </el-submenu>
          <!-- 2 权限管理-->
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>权限管理</span>
            </template>
            <el-menu-item index="/role">
              <i class="el-icon-menu"></i>
              角色列表
            </el-menu-item>
            <el-menu-item index="/right">
              <i class="el-icon-menu"></i>
              权限管理
            </el-menu-item>
          </el-submenu>
          <!-- 3 商品管理-->
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>商品管理</span>
            </template>
            <el-menu-item index="3-1">
              <i class="el-icon-menu"></i>
              商品列表
            </el-menu-item>
            <el-menu-item index="3-2">
              <i class="el-icon-menu"></i>
              分类参数
            </el-menu-item>
            <el-menu-item index="3-3">
              <i class="el-icon-menu"></i>
              商品分类
            </el-menu-item>
          </el-submenu>
          <!-- 4 订单管理-->
          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>订单管理</span>
            </template>
            <el-menu-item index="4-1">
              <i class="el-icon-menu"></i>
              订单列表
            </el-menu-item>
          </el-submenu>
          <!-- 5 数据统计-->
          <el-submenu index="5">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>数据统计</span>
            </template>
            <el-menu-item index="5-1">
              <i class="el-icon-menu"></i>
              数据报表
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!--主体-->
      <el-main class="main">Main</el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  beforeCreate () {
    // 判断是否登录成功
    const token = window.sessionStorage.getItem('token')
    // 未登录 跳转登录页面
    if (!token) return this.$router.push('/login')
    // 已登录 渲染home页面
    this.$router.push('/home')
  },
  methods: {
    // 退出登录
    Loginout () {
      // 清除 sessionStorage中的 token值
      window.sessionStorage.clear()
      // 页面跳转
      this.$router.push('/login')
      this.$message.success('退出成功')
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
