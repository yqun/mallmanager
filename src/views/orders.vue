<template>
  <el-card>
    <my-bread level1="订单管理" level2="订单列表"></my-bread>
    <!--表格-->
    <el-table :data="tableData" height="480" border style="width: 100%">
      <el-table-column type="index" label="#" width="80"></el-table-column>
      <el-table-column prop="order_number" label="订单编号" width="240"></el-table-column>
      <el-table-column prop="order_price" label="订单价格" width="100"></el-table-column>
      <el-table-column label="是否付款" width="100">
        <template slot-scope="scope">
          <el-button type="primary" plain size="mini" v-if="scope.row.pay_status==='0'">已付款</el-button>
          <el-button type="danger" plain size="mini" v-else>未付款</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="is_send" label="是否发货" width="100"></el-table-column>
      <el-table-column label="下单时间" width="180">
        <template slot-scope="scope">
          {{ scope.row.create_time | fmtData }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle plain size="mini" @click="showEditBox()"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--地址弹框-->
    <el-dialog title="修改订单地址" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="省市区">
          <el-cascader
            clearable
            expand-trigger="hover"
            :options="options"
            v-model="selectedOptions"
            @change="handleChange">
          </el-cascader>
        </el-form-item>
        <el-form-item label="详细地址">
          <el-input v-model="form.address" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import options from '@/assets/city_data2017_element.js'
export default {
  data () {
    return {
      tableData: [],
      dialogFormVisible: false,
      form: {
        address: ''
      },
      options: [],
      selectedOptions: []
    }
  },
  created () {
    this.options = options
    this.loadTableData()
  },
  methods: {
    async loadTableData () {
      const res = await this.$http.get(`orders?pagenum=1&pagesize=30`)
      const { meta: {status} } = res.data
      if (status === 200) {
        this.tableData = res.data.data.goods
      }
      console.log(res)
    },
    // 级联
    handleChange () {

    },
    showEditBox () {
      this.dialogFormVisible = true
    }
  }
}
</script>

<style scoped>

</style>
