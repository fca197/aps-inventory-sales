<template>
  <div id="MachineUseTime" style="height: 400px"></div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  name: 'MachineUseTime',
  mounted() {

    var chartDom = document.getElementById('MachineUseTime');
    var myChart = echarts.init(chartDom);
    var option;

    option = {
      title: {
        text: ''
      },
      legend: {
        data: ['2024-12-13', '2024-12-15', '2024-12-18']
      },
      radar: {
        // shape: 'circle',
        indicator: [
          { name: '焊装', max: 3600 },
          { name: '冲压', max: 3600 },
          { name: '涂装', max: 3600 },
          { name: '总装', max: 3600 }
        ]
      },
      series: [
        {
          name: 'Budget vs spending',
          type: 'radar',
          data: [
            {
              value: [3600, 3600, 3600, 3600],
              name: '2024-12-13'
            },
            {
              value: [100, 500, 400, 120],
              name: '2024-12-15'
            },
            {
              value: [1000, 3000, 1500, 2500],
              name: '2024-12-18'
            }
          ]
        }
      ]
    };

    option && myChart.setOption(option);
  }
}
</script>


<style scoped lang="scss">

</style>
