<template>

  <div id="orderCreateDiv3" style="height: 300px;">

  </div>
</template>
<script>
import * as echarts from 'echarts'
import { post } from '@/api/common'

export default {
  name: 'OrderCreate',

  data() {
    return {
      myChart: null,
      option: null,
      fullYear: new Date().getFullYear(),
      // This example requires ECharts v5.4.0 or later
      cellSize: [100, 100],
      pieRadius: 40
    }
  },
  mounted() {

    this.myChart = echarts.init(document.getElementById('orderCreateDiv3'))

    post('/apsOrder/orderCreateDayCount', { year: this.fullYear }, false).then(t => {
      let data = t.data.dataList.map(tt => [tt.date, parseInt(tt.count)])

      let max = Math.max.apply(null, data.map(tt => tt[1]))
      max = Math.floor((parseInt(max / 10 + '') + 1) * 10)

      this.option = {
        title: {
          left: 'center',
          text: this.fullYear + '年下单热力图'
        },
        tooltip: {},
        visualMap: {
          min: 0,
          max: max,
          type: 'piecewise',
          orient: 'horizontal',
          left: 'center',
          top: 65
        },
        calendar: {
          top: 120,
          left: 30,
          right: 30,
          cellSize: ['auto', 15],
          range: this.fullYear + '',
          itemStyle: {
            borderWidth: 0.5
          },
          yearLabel: { show: false }
        },
        series: {
          type: 'heatmap',
          coordinateSystem: 'calendar',
          data: data
        }
      }
      this.myChart.setOption(this.option)
    })

    // console.info('option ', this.myChart, this.option)
    // this.$forceUpdate()

  },
  methods: {}
}
</script>


<style scoped lang="scss">

</style>
