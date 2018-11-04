<template>
    <el-card class="box-card">
      <my-bread level1="权限管理" level2="角色列表"></my-bread>
      <el-row>
        <el-col :span="24">
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <!--表格-->
      <el-table
        :data="rolelist"
        style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row class="level1" v-for="(item1,index) in scope.row.children" :key="index">
              <el-col :span="4">
                <el-tag @close="deleRole(scope.row, item1.id)" closable>{{ item1.authName }}</el-tag>
                <i class="el-icon-arrow-right"></i>
              </el-col>
              <el-col :span="20">
                <el-row class="level2" v-for="(item2, index) in item1.children" :key="index">
                  <el-col :span="4">
                    <el-tag @close="deleRole(scope.row, item2.id)" closable type="success">{{ item2.authName }}</el-tag>
                    <i class="el-icon-arrow-right"></i>
                  </el-col>
                  <el-col :span="20">
                    <el-tag @close="deleRole(scope.row, item3.id)" closable type="warning" v-for="(item3, index) in item2.children" :key="index">
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!--没有权限的显示-->
            <el-row v-if="scope.row.children.length === 0">
              <el-tag type="danger">没有权限访问</el-tag>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="#" type="index" width="80">
        </el-table-column>
        <el-table-column label="角色名称" prop="roleName" width="200">
        </el-table-column>
        <el-table-column label="角色描述" prop="roleDesc" width="200">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" plain icon="el-icon-edit" circle
                       @click.prevent="showEditUserDia(scope.row)"></el-button>
            <el-button type="danger" size="mini" plain icon="el-icon-delete" circle
                       @click.prevent="showSetRightDia()"></el-button>
            <el-button type="success" size="mini" plain icon="el-icon-check" circle
                       @click.prevent="showSetRightDia(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分配权限弹框-->
      <el-dialog
        title="提示"
        :visible.sync="dialogVisibleSetRight"
        width="30%">
        <!--树形结构-->
        <el-tree
          ref="tree"
          :data="treelist"
          :props="defaultProps"
          node-key="id"
          :default-expanded-keys="expandedArr"
          :default-checked-keys="checkedArr"
          show-checkbox>
        </el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisibleSetRight = false">取 消</el-button>
          <el-button type="primary" @click="setRight()">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
</template>

<script>
export default {
  data () {
    return {
      rolelist: [],
      // 分配权限
      dialogVisibleSetRight: false,
      // 树形结构用的数据
      treelist: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      // 展开节点的id数组
      expandedArr: [],
      checkedArr: [],
      roleId: -1
    }
  },
  created () {
    this.loadTableData()
  },
  methods: {
    // 获取角色信息  渲染页面
    async loadTableData () {
      const res = await this.$http.get('roles')
      console.log(res)
      this.rolelist = res.data.data
    },
    // 点击删除
    async deleRole (role, rightId) {
      // roles/:roleId/rights/:rightId
      const res = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
      console.log(res)
      const { meta } = res.data
      this.$message.error(meta.msg)
      // this.loadTableData()
      // 删除后刷新当前 权限  不必刷新页面
      role.children = res.data.data
    },
    // 点击弹出权限弹框
    async showSetRightDia (role) {
      // console.log(role)
      this.roleId = role.id
      this.dialogVisibleSetRight = true
      const res = await this.$http.get('rights/tree')
      this.treelist = res.data.data
      // 展开全部项
      const arr = []
      res.data.data.forEach(item1 => {
        item1.children.forEach(item2 => {
          item2.children.forEach(item3 => {
            arr.push(item3.id)
          })
        })
      })// forEach end
      this.expandedArr = arr
      // 展开默认选择权限项
      const arrcheck = []
      role.children.forEach(item1 => {
        item1.children.forEach(item2 => {
          item2.children.forEach(item3 => {
            arrcheck.push(item3.id)
          })
        })
      })// role.children
      this.checkedArr = arrcheck
    },
    async setRight () {
      this.dialogVisibleSetRight = false
      const arr1 = this.$refs.tree.getCheckedKeys()
      const arr2 = this.$refs.tree.getHalfCheckedKeys()
      const arr = [...arr1, ...arr2]
      const res = await this.$http.post(`roles/${this.roleId}/rights`, {rids: arr.join(',')})
      console.log(res)
      const { meta } = res.data
      if (meta.status === 200) {
        this.loadTableData()
      }
    }
  }

}
</script>

<style scoped>
 .level1 {
   margin-bottom: 10px;
 }
 .level2 {
   margin-bottom: 10px;
 }
</style>

