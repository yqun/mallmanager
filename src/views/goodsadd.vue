<template>
    <el-card class="box-card">
      <my-bread level1="商品管理" level2="商品列表"></my-bread>
      <el-alert
        class="successbox"
        title="添加商品"
        type="success"
        :closable="false"
        show-icon
        center>
      </el-alert>
      <el-steps :space="200" :active="active*1" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
      </el-steps>
      <!--tab 栏-->
      <el-form :model="formData" class="form">
        <el-tabs v-model="active" tab-position="left" @tab-click="tabChange()">
          <!-- 基本信息 -->
          <el-tab-pane label="基本信息" name="1">
            <el-form-item label="商品名称">
              <el-input v-model="formData.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格">
              <el-input v-model="formData.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品数量">
              <el-input v-model="formData.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量">
              <el-input v-model="formData.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品分类">
              <el-cascader
                clearable
                expand-trigger="hover"
                :options="options"
                :props="defaultProp"
                v-model="selectedOptions"
                @change="handleChange">
              </el-cascader>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品参数 -->
          <el-tab-pane label="商品参数" name="2">
            <el-form-item :label="item.attr_name" v-for="(item, index) in dtParams" :key="index"><br/>
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  border
                  :label="item1"
                  v-for="(item1, index) in item.attr_vals"
                  :key="index"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <!--  商品属性-->
          <el-tab-pane label="商品属性" name="3">
            <el-form-item :label="item.attr_name" v-for="item in staticParams" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品图片 -->
          <el-tab-pane label="商品图片" name="4">
            <el-upload
              :headers="headers"
              class="upload-demo"
              action="http://localhost:8888/api/private/v1/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              list-type="picture">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <!-- 商品内容 -->
          <el-tab-pane label="商品内容" name="5">
            <el-button type="primary" plain @click="addGoods()">添加商品</el-button>
            <!-- 富文本 -->
            <quill-editor v-model="formData.goods_introduce"></quill-editor>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'
export default {
  // 局部注册组件
  components: {
    quillEditor
  },
  data () {
    return {
      active: '1',
      formData: {
        goods_name: '',
        // 以，分割的分类列表
        goods_cat: '',
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        goods_introduce: '',
        // 上传图片路径
        pics: [],
        // 商品参数
        attrs: []
      },
      // 级联选择器的数据
      options: [],
      selectedOptions: [],
      defaultProp: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 保存动态参数
      dtParams: [],
      // 保存静态参数的值
      staticParams: [],
      // 上传图片的头部设置
      headers: {
        Authorization: sessionStorage.getItem('token')
      }
    }
  },
  created () {
    this.getGoodsCate()
  },
  methods: {
    handleChange () {

    },
    // 点击tab栏切换时触发
    async tabChange () {
      if (this.active === '2' || this.active === '3') {
        if (this.selectedOptions.length !== 3) return this.$message.error('请选择三级分类')
        // 获取三级分类的动态参数
        const sel = this.active === '2' ? 'many' : 'only'
        const res = await this.$http.get(`categories/${this.selectedOptions[2]}/attributes?sel=${sel}`)
        this.dtParams = res.data.data
        this.dtParams.forEach(item => {
          item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.trim().split(',')
        })
        this.staticParams = res.data.data
        console.log(this.staticParams)
      }
    },
    // 获取三级分类
    async getGoodsCate () {
      const res = await this.$http.get(`categories?type=3`)
      this.options = res.data.data
      // console.log(res)
    },
    // 图片上传
    handlePreview (file) {
      // file.respones.data.tmp_path
    },
    handleRemove (file) {
      // 找下标
      const index = this.formData.pics.findIndex(item => {
        return item.pic === file.response.data.tmp_path
      })
      this.formData.pics.splice(index, 1)
    },
    handleSuccess (response) {
      // response.data.tmp_path
      this.formData.pics.push({
        pic: response.data.tmp_path
      })
    },
    // 添加商品
    async addGoods () {
      this.formData.goods_cat = this.selectedOptions.join(',')
      const arr1 = this.dtParams.map(item => {
        return {attr_id: item.attr_id, attr_value: item.attr_vals}
      })
      const arr2 = this.dtParams.map(item => {
        return {attr_id: item.attr_id, attr_value: item.attr_vals}
      })
      this.formData.attrs = [...arr1, ...arr2]
      const res = await this.$http.post(`goods`, this.formData)
      const { meta: {status, msg} } = res.data
      this.$message.success(msg)
      if (status === 201) {
        this.$router.push('/goods')
      }
    }
  }
}
</script>

<style scoped>
  .form {
    height: 350px;
    overflow: auto;
  }
  .successbox {
    margin-bottom: 20px;
  }
  .el-step__title {
    font-size: 12px;
  }
</style>
