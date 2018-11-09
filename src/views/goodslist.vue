<template>
    <el-card class="box-card">
      <my-bread level1="商品管理" level2="商品列表"></my-bread>
      <!--搜索框-->
      <el-row class="searchArea">
        <el-col :sapn="24">
          <el-input
            placeholder="请输入内容"
            class="searchInput"
            v-model="searchVal">
            <el-button slot="append" icon="el-icon-search" @click.prevent="checkUser()"></el-button>
          </el-input>
          <el-button type="success" @click.prevent="showAddGoods()">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table :data="list" height="400" border style="width: 100%">
        <el-table-column type="index" label="#" width="60">
        </el-table-column>
        <el-table-column prop="goods_name" label="商品名称" width="360">
        </el-table-column>
        <el-table-column prop="goods_price" label="商品价格" width="80">
        </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="80">
        </el-table-column>
        <el-table-column prop="address" label="创建日期" width="180">
          <template slot-scope="scope">
            {{ scope.row.add_time | fmtData }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="danger" plain size="mini" icon="el-icon-delete" circle></el-button>
            <el-button type="success" plain size="mini" icon="el-icon-check" circle></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[20, 40, 60, 80]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
</template>
<script>
export default {
  data () {
    return {
      list: [],
      // 发送的数据 分页
      searchVal: '',
      pagenum: 1,
      pagesize: 20,
      currentPage: 1,
      total: -1
    }
  },
  created () {
    this.loadTableData()
  },
  methods: {
    // 获取数据
    async loadTableData () {
      const res = await this.$http.get(`goods?pagenum=${this.pagenum}&pagesize=${this.pagesize}&query=${this.searchVal}`)
      const { meta, data } = res.data
      if (meta.status === 200) {
        this.list = data.goods
        this.total = data.total
      }
      // console.log(res)
    },
    // 分页
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)
      this.pagesize = val
      this.loadTableData()
    },
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      this.pagenum = val
      this.loadTableData()
    },
    // 显示添加商品组件
    showAddGoods () {
      this.$router.push('/goodsadd')
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
