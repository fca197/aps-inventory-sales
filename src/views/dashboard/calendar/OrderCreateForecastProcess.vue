<template>
  <div id="OrderCreateForecastProcessDiv" style="height: 400px"></div>
</template>
<script>
import * as echarts from 'echarts';
export default {
  name: 'OrderCreateForecastProcess',
  mounted() {
    var myChart = echarts.init(document.getElementById('OrderCreateForecastProcessDiv'));
    var option;

    option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {},
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: [
            '2024-12-01',
            '2024-12-02',
            '2024-12-03',
            '2024-12-04',
            '2024-12-05',
            '2024-12-06',
            '2024-12-07'
          ]
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: '冲压',
          type: 'bar',
          stack: 'Ad',
          emphasis: {
            focus: 'series'
          },
          data: [420, 332, 301, 34, 390, 330, 320]
        },
        {
          name: '焊装',
          type: 'bar',
          stack: 'Ad',
          emphasis: {
            focus: 'series'
          },
          data: [120, 132, 101, 134, 90, 230, 210]
        },
        {
          name: '涂装',
          type: 'bar',
          stack: 'Ad',
          emphasis: {
            focus: 'series'
          },
          data: [220, 182, 191, 234, 290, 330, 310]
        },
        {
          name: '总装',
          type: 'bar',
          stack: 'Ad',
          emphasis: {
            focus: 'series'
          },
          data: [150, 232, 201, 154, 190, 330, 410]
        }
      ]
    };

    option && myChart.setOption(option);
  }
}
</script>



<style scoped lang="scss">

</style>
