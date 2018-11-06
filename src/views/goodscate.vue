<template>
  <el-card class="box-card">
    <my-bread level1="商品管理" level2="商品分类"></my-bread>
    <el-row class="searchArea">
      <el-button type="success" plain @click="showAddBox()">添加分类</el-button>
    </el-row>
    <!-- table表格 -->
    <el-table :data="list" height="400" style="width: 100%">
      <el-tree-grid
        prop="cat_name"
        label="分类名称"
        width="180"
        treeKey="cat_id"
        parentKey="cat_pid"
        levelKey="cat_level"
        childKey="children"
      >
      </el-tree-grid>
      <!--<el-table-column prop="cat_name" label="分类名称" width="180">-->
      <!--</el-table-column>-->
      <el-table-column label="级别" width="180">
        <template slot-scope="scope">
          <span v-if="scope.row.cat_level === 0">一级</span>
          <span v-else-if="scope.row.cat_level === 1">二级</span>
          <span v-else-if="scope.row.cat_level === 2">三级</span>
        </template>
      </el-table-column>
      <el-table-column label="是否有效" width="180">
        <template slot-scope="scope">
          <span v-if="scope.row.cat_deleted === true">有效</span>
          <span v-else-if="scope.row.cat_deleted === false">无效</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" plain size="mini" icon="el-icon-edit" circle
                     @click="showEditBox(scope.row)"></el-button>
          <el-button type="danger" plain size="mini" icon="el-icon-delete" circle
          @click="showDeleBox(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加分类对话框 -->
    <el-dialog title="添加商品分类" :visible.sync="dialogFormVisibleAddGoodsCate" @close="trimFormData()">
      <el-form :model="formData">
        <el-form-item label="分类名称" :label-width="formLabelWidth">
          <el-input v-model="formData.cat_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="分类" :label-width="formLabelWidth">
          <el-cascader
            change-on-select
            clearable
            expand-trigger="hover"
            :options="caslist"
            :props="defaultProp"
            v-model="selectedOptions">
          </el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAddGoodsCate = false">取 消</el-button>
        <el-button type="primary" @click="addGoodCate()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑分类对话框 -->
    <el-dialog title="编辑商品分类" :visible.sync="dialogFormVisibleAddEdit" @close="trimFormData()">
      <el-form :model="formData">
        <el-form-item label="分类名称" :label-width="formLabelWidth">
          <el-input v-model="formData.cat_name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAddEdit = false">取 消</el-button>
        <el-button type="primary" @click="editGoodCate()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>

</template>

<script>
const ElTreeGrid = require('element-tree-grid')
export default {
  components: {
    'ElTreeGrid': ElTreeGrid
  },
  data () {
    return {
      list: [],
      // 添加商品分类
      dialogFormVisibleAddGoodsCate: false,
      formLabelWidth: '80px',
      formData: {
        cat_pid: -1,
        cat_name: '',
        cat_level: ''
      },
      caslist: [],
      selectedOptions: [],
      defaultProp: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 编辑
      dialogFormVisibleAddEdit: false
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
    // 获取数据  渲染页面
    async loadTableData () {
      const res = await this.$http.get(`categories?type=3`)
      const { meta, data } = res.data
      if (meta.status === 200) {
        this.list = data
      }
      // console.log(res)
    },
    // 展示添加弹框
    async showAddBox () {
      this.dialogFormVisibleAddGoodsCate = true
      const res = await this.$http.get(`categories?type=2`)
      // console.log(res)
      this.caslist = res.data.data
    },
    // 展示编辑框
    showEditBox (cat) {
      this.dialogFormVisibleAddEdit = true
      this.formData.cat_name = cat.cat_name
      this.formData.cat_id = cat.cat_id
    },
    // 编辑
    async editGoodCate () {
      const res = await this.$http.put(`categories/${this.formData.cat_id}`, {
        cat_name: this.formData.cat_name
      })
      const { meta } = res.data
      if (meta.status === 200) {
        this.dialogFormVisibleAddEdit = false
        this.$message.success(meta.msg)
        this.loadTableData()
      }
    },
    // 显示删除提示框
    showDeleBox (cat) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await this.$http.delete(`categories/${cat.cat_id}`)
        const { meta } = res.data
        if (meta.status === 200) {
          this.$message.success('删除成功!')
        }
        this.loadTableData()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 删除
    async addGoodCate () {
      // 判断 选择的第几级菜单
      if (this.selectedOptions.length === 0) {
        this.formData.cat_level = 0
        this.formData.cat_pid = 0
      } else if (this.selectedOptions.length === 1) {
        this.formData.cat_level = 1
        this.formData.cat_pid = this.selectedOptions[0]
      } else if (this.selectedOptions.length === 2) {
        this.formData.cat_level = 2
        this.formData.cat_pid = this.selectedOptions[1]
      }
      const res = await this.$http.post(`categories`, this.formData)
      const { meta } = res.data
      if (meta.status === 201) {
        this.dialogFormVisibleAddGoodsCate = false
        this.$message.success(meta.msg)
        this.loadTableData()
      }
      console.log(res)
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
</style>
