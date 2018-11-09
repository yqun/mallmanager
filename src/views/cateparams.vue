<template>
  <el-card class="box-card">
    <my-bread level1="商品管理" level2="分类参数"></my-bread>
    <!--警告框-->
    <el-alert
      class="Abox"
      center
      :closable="false"
      title="警告：只允许为第三级参数设置参数"
      type="warning"
      show-icon>
    </el-alert>
    <!--级联选择器-->
    <el-form>
      <el-form-item label="请选择商品分类">
        <el-cascader
          clearable
          expand-trigger="hover"
          :options="options"
          :props="defaultProp"
          v-model="selectedOptions"
          @change="handleChange">
        </el-cascader>
      </el-form-item>
    </el-form>
    <!--tab-->
    <el-tabs v-model="active" type="border-card" @tab-click="handleClick">
      <el-tab-pane label="动态参数" name="1">
        <el-row>
          <el-col :span="24">
            <el-button type="primary" round size="small" @click="showAddFormBox()" :disabled="disabled">设置动态参数</el-button>
          </el-col>
        </el-row>
        <el-table :data="dtParams" style="width: 100%" height="258">
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-tag
                :key="index"
                v-for="(tag, index) in scope.row.attr_vals"
                closable
                :disable-transitions="false"
                @close="handleClose(scope.row, scope.row.attr_vals, tag)">
                {{tag}}
              </el-tag>
              <el-input
                class="input-new-tag"
                v-if="inputVisible"
                v-model="inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm(scope.row, scope.row.attr_vals)"
                @blur="handleInputConfirm"
              >
              </el-input>
              <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
            </template>
          </el-table-column>
          <el-table-column label="#" type="index" width="120"></el-table-column>
          <el-table-column label="属性名称" prop="attr_name" width="200"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="primary" plain icon="el-icon-edit" size="mini"></el-button>
              <el-button type="danger" plain icon="el-icon-delete" size="mini"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="静态参数" name="2">
        <el-table :data="staticParams" style="width: 100%" height="258">
          <el-table-column label="#" type="index" width="120"></el-table-column>
          <el-table-column label="属性名称" prop="attr_name" width="200"></el-table-column>
          <el-table-column label="属性值" prop="attr_vals" width="200"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="primary" plain icon="el-icon-edit" size="mini"></el-button>
              <el-button type="danger" plain icon="el-icon-delete" size="mini"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <!--增加动态参数弹框-->
    <el-dialog title="设置商品动态参数" :visible.sync="dialogFormVisibleAdd">
      <el-form :model="formData">
        <el-form-item label="参数名称">
          <el-input v-model="formData.attr_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="值">
          <el-input v-model="formData.attr_vals" autocomplete="off" placeholder="多个值时以，分隔"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
        <el-button type="primary" @click="addDyParams()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data () {
    return {
      options: [],
      selectedOptions: [],
      defaultProp: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      disabled: true,
      active: '1',
      dtParams: [],
      staticParams: [],
      inputVisible: false,
      inputValue: '',
      // 添加动态参数
      dialogFormVisibleAdd: false,
      formData: {
        attr_vals: '',
        attr_name: '',
        attr_sel: 'many'
      }
    }
  },
  created () {
    this.loadFormData()
  },
  methods: {
    // 获取三级分类选项
    async loadFormData () {
      const res = await this.$http.get(`categories?type=3`)
      this.options = res.data.data
    },
    // 点击tab栏切换时触发
    handleClick () {
      this.getDyParams()
    },
    // 点击三级分类
    handleChange () {
      // 设置动态参数按钮
      this.disabled = false
      this.getDyParams()
    },
    // 获取动态参数数据
    async getDyParams () {
      if (this.active === '1' || this.active === '2') {
        // 获取三级分类的动态参数
        const sel = this.active === '1' ? 'many' : 'only'
        const res = await this.$http.get(`categories/${this.selectedOptions[2]}/attributes?sel=${sel}`)
        this.dtParams = res.data.data
        // console.log(this.dtParams)
        this.dtParams.forEach(item => {
          item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.trim().split(',')
        })
        this.staticParams = res.data.data
        // console.log(this.staticParams)
      }
    },
    // 关闭打开的框中的一个值
    async handleClose (item, attr_vals, tag) {
      attr_vals.splice(attr_vals.indexOf(tag), 1)
      const putData = {
        attr_name: item.attr_name,
        attr_sel: 'many',
        attr_vals: attr_vals.join(',')
      }
      const res = await this.$http.put(`categories/${this.selectedOptions[2]}/attributes/${item.attr_id}`, putData)
      console.log(res)
    },
    showInput () {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    async handleInputConfirm (item, attr_vals) {
      let inputValue = this.inputValue
      if (inputValue) {
        attr_vals.push(inputValue)
        const putData = {
          attr_name: item.attr_name,
          attr_sel: 'many',
          attr_vals: attr_vals.join(',')
        }
        const res = await this.$http.put(`categories/${this.selectedOptions[2]}/attributes/${item.attr_id}`, putData)
        console.log(res)
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    // 显示添加对话框
    showAddFormBox () {
      this.dialogFormVisibleAdd = true
    },
    // 添加动态参数
    async addDyParams () {
      this.dialogFormVisibleAdd = false
      const res = await this.$http.post(`categories/${this.selectedOptions[2]}/attributes`, this.formData)
      console.log(res)
      this.getDyParams()
    }
  }
}
</script>

<style scoped>
  .Abox {
    margin-bottom: 20px;
  }
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>
