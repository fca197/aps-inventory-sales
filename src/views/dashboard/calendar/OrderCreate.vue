<template>

  <div id="orderCreateDiv3" style="height: 300px;">

  </div>
</template>
<script>
import * as echarts from 'echarts'

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
    this.loadOrderOption()

    this.myChart = echarts.init(document.getElementById('orderCreateDiv3'))

    this.myChart.setOption(this.option)
    console.info('option ', this.myChart, this.option)
    // this.$forceUpdate()

  },
  methods: {
    getVirtualData(year) {
      const date = +echarts.time.parse(year + '-01-01')
      const end = +echarts.time.parse(+year + 1 + '-01-01')
      const dayTime = 3600 * 24 * 1000
      const data = []
      for (let time = date; time < end; time += dayTime) {
        data.push([echarts.time.format(time, '{yyyy}-{MM}-{dd}', false), Math.floor(Math.random() * 10000)])
      }
      return data
    },
    loadOrderOption() {
      this.option = {
        title: {
          top: 30,
          left: 'center',
          text: this.fullYear + '年下单热力图'
        },
        tooltip: {},
        visualMap: {
          min: 0,
          max: 10000,
          type: 'piecewise',
          orient: 'horizontal',
          left: 'center',
          top: 65
        },
        calendar: {
          top: 120,
          left: 30,
          right: 30,
          cellSize: ['auto', 13],
          range: this.fullYear + '',
          itemStyle: {
            borderWidth: 0.5
          },
          yearLabel: { show: false }
        },
        series: {
          type: 'heatmap',
          coordinateSystem: 'calendar',
          data: this.getVirtualData(this.fullYear)
        }
      }

    }
  }
}
</script>


<style scoped lang="scss">

</style>
