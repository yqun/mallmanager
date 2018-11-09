<template>
  <el-card class="box-card">
    <!--面包屑导航-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--搜索框-->
    <el-row class="searchArea">
      <el-col :sapn="24">
        <el-input
          placeholder="请输入内容"
          class="searchInput"
          v-model="query">
          <el-button slot="append" icon="el-icon-search" @click.prevent="checkUser()"></el-button>
        </el-input>
        <el-button type="success" @click.prevent="showAddUserDia()">添加用户</el-button>
      </el-col>
    </el-row>
    <!--信息-->
    <el-table v-loading="loading" :data="list" style="width: 100%">
      <el-table-column type="index" label="#" width="80">
      </el-table-column>
      <el-table-column prop="username" label="姓名" width="100">
      </el-table-column>
      <el-table-column prop="email" label="邮箱" width="140">
      </el-table-column>
      <el-table-column prop="mobile" label="电话" width="140">
      </el-table-column>
      <el-table-column label="创建日期" width="140">
        <template slot-scope="scope">
          {{ scope.row.create_time | fmtData }}
        </template>
      </el-table-column>
      <el-table-column label="用户状态" width="120">
        <template slot-scope="scope">
          <el-switch @change="changeSwitchMgstats(scope.row)" v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" plain icon="el-icon-edit" circle
                     @click.prevent="showEditUserDia(scope.row)"></el-button>
          <el-button type="danger" size="mini" plain icon="el-icon-delete" circle
                     @click.prevent="showDeleBox(scope.row.id)"></el-button>
          <el-button type="success" size="mini" plain icon="el-icon-check" circle
                     @click.prevent="showRoleBox(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!-- 点击添加弹框 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAddUser">
      <el-form :model="formData">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="formData.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input v-model="formData.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="formData.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input v-model="formData.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAddUser = false">取 消</el-button>
        <el-button type="primary" @click="addUser()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 点击编辑弹框 -->
    <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleEditUser" @close="trimFormData()">
      <el-form :model="formData">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          {{ formData.username }}
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="formData.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input v-model="formData.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEditUser = false">取 消</el-button>
        <el-button type="primary" @click="editUser()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分配权限弹框 -->
    <el-dialog title="分配权限" :visible.sync="dialogFormVisibleSetRole">
      <el-form :model="formData">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          {{ currUserName }}
        </el-form-item>
        <el-form-item label="角色" :label-width="formLabelWidth">
          <el-select v-model="currRoleId">
            <el-option disabled label="请选择" :value="-1">

            </el-option>
            <el-option
              v-for="(item, index) in roles"
              :key="index"
              :label="item.roleName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleSetRole = false">取 消</el-button>
        <el-button type="primary" @click="setRole()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>
<script>
export default {
  data () {
    return {
      // 数据
      list: [],
      // 加载样式
      loading: true,
      // 分页
      currentPage: 1, // 第几页
      total: 0,
      pagenum: 1, // 第几页
      pagesize: 4, // 每页数据数
      query: '',
      // 添加数据
      dialogFormVisibleAddUser: false,
      formLabelWidth: '60px',
      formData: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 编辑用户
      dialogFormVisibleEditUser: false,
      // 分配权限
      dialogFormVisibleSetRole: false,
      currUserName: '',
      currRoleId: -1,
      // 所有角色
      roles: [],
      // 用户id
      currUserId: -1
    }
  },
  created () {
    this.loadTableData()
  },
  methods: {
    // 关闭弹框清空formData数据
    trimFormData () {
      for (const key in this.formData) {
        if (this.formData.hasOwnProperty(key)) {
          this.formData[key] = ''
        }// if end
      }// for end
    },
    // 发送请求  获取页面渲染数据
    async loadTableData () {
      // 除了登录功能，其他功能接口都需要token
      const AUTH_TOKEN = window.sessionStorage.getItem('token')
      // header 添加token
      this.$http.defaults.headers.common['Authorization'] = AUTH_TOKEN
      // 发送请求获得数据 res
      const res = await this.$http.get(`/users?pagenum=${this.pagenum}&pagesize=${this.pagesize}&query=${this.query}`)
      const { meta: {msg, status}, data: {users, total} } = res.data
      if (status !== 200) return this.$message.error(msg)
      this.loading = false

      this.total = total
      this.list = users
      this.pagenum = 1
    },
    // 分页事件
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)
      // 每页数据数
      this.pagesize = val
      this.loadTableData()
    },
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      this.pagenum = val
      this.loadTableData()
    },
    // 点击查询数据
    checkUser () {
      this.loadTableData()
    },
    // 改变开关按钮状态
    async changeSwitchMgstats (Users) {
      const res = await this.$http.put(`users/${Users.id}/state/${Users.mg_state}`)
      // console.log(res)
      const { meta } = res.data
      if (meta.status === 200) return this.$message.success(meta.msg)
    },
    // 删除提示框
    showDeleBox (userID) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await this.$http.delete(`users/${userID}`)
        const { meta } = res.data
        this.$message.success(meta.msg)
        this.loadTableData()
      }).catch(() => {
        this.$message.info('取消删除')
      })
    },
    // 渲染添加提示框
    showAddUserDia () {
      this.dialogFormVisibleAddUser = true
    },
    // 添加用户
    async addUser () {
      this.dialogFormVisibleAddUser = false
      const res = await this.$http.post('users', this.formData)
      const { meta } = res.data
      this.$message.info(meta.msg)
      if (meta.status === 201) {
        this.loadTableData()
        for (const key in this.formData) {
          if (this.formData.hasOwnProperty(key)) {
            this.formData[key] = ''
          }// if end
        }// for end
      }// if end
    }, // addUser end
    // 渲染编辑提示框
    async showEditUserDia (user) {
      this.dialogFormVisibleEditUser = true
      const res = await this.$http.get(`users/${user.id}`)
      // console.log(res)
      this.formData = res.data.data
    },
    // 编辑信息
    async editUser () {
      this.dialogFormVisibleEditUser = false
      const res = await this.$http.put(`users/${this.formData.id}`, this.formData)
      console.log(res)
      const { meta } = res.data
      this.$message.info(meta.msg)
      if (meta.status === 200) return this.loadTableData()
    },
    // 分配角色
    async showRoleBox (user) {
      this.dialogFormVisibleSetRole = true
      this.currUserId = user.id
      this.currUserName = user.username
      // 获取角色数据
      const res = await this.$http.get('roles')
      const res2 = await this.$http.get(`users/${user.id}`)
      this.currRoleId = res2.data.data.rid
      this.roles = res.data.data
    },
    // 1
    async setRole () {
      const res = await this.$http.put(`users/${this.currUserId}/role`, {rid: this.currRoleId})
      this.dialogFormVisibleSetRole = false
      const { meta } = res.data
      this.$message.info(meta.msg)
      this.currRoleId = -1
    }
  }
}
</script>
<style scoped>
  .box-card {
    height: 100%;
  }
  .searchArea {
    margin-top: 10px;
    margin-bottom: 10px;
  }
  .searchArea .searchInput {
    width: 350px;
  }
</style>
