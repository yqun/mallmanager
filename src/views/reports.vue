<template>
  <el-card>
    <my-bread level1="数据统计" level2="数据报表"></my-bread>
    <!--折线图-->
    <div id="main" style="width: 800px;height:450px;" ref="main"></div>
  </el-card>
</template>

<script>
import echarts from 'echarts'
export default {
  data () {
    return {
      option1: []
    }
  },
  mounted () {
    this.loadEcharts()
  },
  methods: {
    async loadEcharts () {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(this.$refs.main)
      // 获取数据
      const res = await this.$http.get(`reports/type/1`)
      this.option1 = res.data.data
      const option2 = {
        title: {
          text: '堆叠区域图'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        grid: {
          left: '3%',
          right: '5%',
          bottom: '3%',
          containLabel: true
        }
      }
      const option = {...option2, ...this.option1}
      console.log(option)
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option)
    }
  }
}
</script>

<style scoped>

</style>
