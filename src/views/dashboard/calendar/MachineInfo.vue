<template>

  <div id="MachineInfoDiv" style="height: 700px ;width: 900px">

  </div>
</template>
<script>
import * as echarts from 'echarts'

export default {
  name: 'MachineInfo',
  mounted() {
    let myChart = echarts.init(document.getElementById('MachineInfoDiv'))

    const cellSize = [100, 100]
    const pieRadius = 30
    const scatterData = this.getVirtualData()
    const pieSeries = scatterData.map(function(item, index) {
      return {
        type: 'pie',
        id: 'pie-' + index,
        center: item[0],
        radius: pieRadius,
        coordinateSystem: 'calendar',
        label: {
          formatter: '{c}',
          position: 'inside'
        },
        data: [
          { name: '冲压', value: Math.round(Math.random() * 24) },
          { name: '涂装', value: Math.round(Math.random() * 24) },
          { name: '总装', value: Math.round(Math.random() * 24) }
        ]
      }
    })
    let option = {
      tooltip: {},
      legend: {
        data: ['冲压', '涂装', '总装'],
        bottom: 20
      },
      calendar: {
        top: 'middle',
        left: 'center',
        orient: 'vertical',
        cellSize: cellSize,
        yearLabel: {
          show: true,
          fontSize: 30

        },
        dayLabel: {
          margin: 10,
          firstDay: 1,
          nameMap: ['日', '一', '二', '三', '四', '五', '六', '日']
        },
        monthLabel: {
          show: true, fontSize: 30
        },
        range: ['2017-02']
      },
      series: [
        {
          id: 'label',
          type: 'scatter',
          coordinateSystem: 'calendar',
          symbolSize: 0,
          label: {
            show: true,
            formatter: function(params) {
              return echarts.time.format(params.value[0], '{dd}', false)
            },
            offset: [-cellSize[0] / 2 + 10, -cellSize[1] / 2 + 10],
            fontSize: 10
          },
          data: scatterData
        },
        ...pieSeries
      ]
    }

    option && myChart.setOption(option)

  }, methods: {
    getVirtualData(fullYear) {
      const date = +echarts.time.parse('2017-02-01')
      const end = +echarts.time.parse('2017-03-01')
      const dayTime = 3600 * 24 * 1000
      const data = []
      for (let time = date; time < end; time += dayTime) {
        data.push([
          echarts.time.format(time, '{yyyy}-{MM}-{dd}', false),
          Math.floor(Math.random() * 10000)
        ])
      }
      return data
    }
  }
}
</script>


<style scoped lang="scss">

</style>
