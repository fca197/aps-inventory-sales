<template>
  <div id="ProduceBomDiv" style="height: 400px"></div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'MachineProduceBom',
  mounted() {
    let myChart = echarts.init(document.getElementById('ProduceBomDiv'))
    myChart.showLoading()

    const data = {
      name: 'flare',
      children: [{
        name: '冲压',
        children: [
          { name: '铝板', value: 1 },
          { name: '电', value: 1 }
        ]
      },
        {
          name: '焊接',
          children: [
            { name: '焊丝', value: 1 },

            { name: '电', value: 1 }
          ]
        },
        {
          name: '涂装',
          children: [
            { name: '防锈液', value: 10, unit: 'KG' },
            { name: '油漆', value: 1, unit: 'KG' }
          ]
        }, {
          name: '总装',
          children: [
            { name: '座椅', value: 1, unit: '套' },
            { name: '车门', value: 4, unit: '个' },
            { name: '车轮', value: 4, unit: '个' }
          ]
        }
      ]
    }
    var data2 = {
      name: 'IPHONE',
      children: [
        {
          name: '组装',
          children: [
            { name: '主板', value: 1 },
            { name: '焊丝', value: 1 },
            { name: 'CPU', value: 1 }
          ]
        },
        {
          name: '测试',
          children: [
            { name: '电', value: 1 }
          ]
        },
        {
          name: '包装',
          children: [{ name: '塑封膜', value: 1 }]
        }
      ]
    }
    myChart.hideLoading()

    myChart.setOption(
      {
        tooltip: {
          trigger: 'item',
          triggerOn: 'mousemove',
          formatter: function(info) {
            console.info(info)
            var value = info.value
            var unit = info.data.unit
            var treePathInfo = info.treeAncestors
            var treePath = []
            for (var i = 1; i < treePathInfo.length; i++) {
              treePath.push(treePathInfo[i].name)
            }
            return [
              '<div class="tooltip-title">' +
              echarts.format.encodeHTML(treePath.join('/')) +
              '</div>',
              '数量：' + echarts.format.addCommas(value) + ' ',
              unit
            ].join('')
          }
        },
        label: {
          show: true,
          formatter: '{b}'
        },
        legend: {
          top: '2%',
          left: '3%',
          orient: 'vertical',
          data: [
            {
              name: 'MINI',
              icon: 'rectangle'
            },
            {
              name: 'IPHONE',
              icon: 'rectangle'
            }
          ],
          borderColor: '#c23531'
        },
        series: [
          {
            type: 'tree',
            name: 'MINI',
            data: [data],
            top: '5%',
            left: '7%',
            bottom: '2%',
            right: '60%',
            symbolSize: 7,
            label: {
              position: 'left',
              verticalAlign: 'middle',
              align: 'right'
            },
            leaves: {
              label: {
                position: 'right',
                verticalAlign: 'middle',
                align: 'left'
              }
            },
            emphasis: {
              focus: 'descendant'
            },
            expandAndCollapse: true,
            animationDuration: 550,
            animationDurationUpdate: 750
          },
          {
            type: 'tree',
            name: 'IPHONE',
            data: [data2],
            top: '20%',
            left: '60%',
            bottom: '22%',
            right: '18%',
            symbolSize: 7,
            label: {
              position: 'left',
              verticalAlign: 'middle',
              align: 'right'
            },
            leaves: {
              label: {
                position: 'right',
                verticalAlign: 'middle',
                align: 'left'
              }
            },
            expandAndCollapse: true,
            emphasis: {
              focus: 'descendant'
            },
            animationDuration: 550,
            animationDurationUpdate: 750
          }
        ]
      })

  }
}
</script>


<style scoped lang="scss">

</style>
