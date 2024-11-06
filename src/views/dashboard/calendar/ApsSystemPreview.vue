<template>
  <div id="ApsSystemPreviewDiv" style="height: 400px">

  </div>
</template>
<script>
import * as echarts from 'echarts'

export default {
  name: 'ApsSystemPreview',
  mounted() {
    let myChart = echarts.init(document.getElementById('ApsSystemPreviewDiv'))

    let dataList = [
      {
        name: '南京工厂',
        value: 20,
        children: [
          {
            name: '车间1',
            value: 10,
            children: [
              {
                name: '工段',
                value: 6,

                children: [{
                  name: '工位',
                  value: 3,
                  children: [{
                    name: '状态',
                    value: 1
                  }]
                }]
              }
            ]
          }
        ]
      }, {
        name: '北京工厂',
        value: 20,
        children: [
          {
            name: '车间1',
            value: 10,
            children: [
              {
                name: '工段',
                value: 6,

                children: [{
                  name: '工位',
                  value: 3,
                  children: [{
                    name: '状态',
                    value: 1
                  }]
                }]
              }
            ]
          }
        ]
      }, {
        name: '北京工厂',
        value: 20,
        children: [
          {
            name: '车间1',
            value: 10,
            children: [
              {
                name: '工段',
                value: 6,

                children: [{
                  name: '工位',
                  value: 3,
                  children: [{
                    name: '状态',
                    value: 1
                  }]
                }]
              }
            ]
          }
        ]
      }, {
        name: '北京工厂',
        value: 20,
        children: [
          {
            name: '车间1',
            value: 10,
            children: [
              {
                name: '工段',
                value: 6,

                children: [{
                  name: '工位',
                  value: 3,
                  children: [{
                    name: '状态',
                    value: 1
                  }]
                }]
              }
            ]
          }
        ]
      }, {
        name: '北京工厂',
        value: 20,
        children: [
          {
            name: '车间1',
            value: 10,
            children: [
              {
                name: '工段',
                value: 6,

                children: [{
                  name: '工位',
                  value: 3,
                  children: [{
                    name: '状态',
                    value: 1
                  }]
                }]
              }
            ]
          }
        ]
      }
    ]

    // myChart.setOption()
    let option = {
      title: {
        height: 1,
        left: 'center'
        // text: '系统配置组成',
        // subtext: formatDate(new Date()).substring(0,10),
        // left: 'leafDepth'
      },
      tooltip: {
        formatter: function(info) {
          var value = info.value
          var treePathInfo = info.treePathInfo
          var treePath = []
          for (var i = 1; i < treePathInfo.length; i++) {
            treePath.push(treePathInfo[i].name)
          }
          return [
            '<div class="tooltip-title">' +
            echarts.format.encodeHTML(treePath.join('/')) +
            '</div>',
            // '数量：' + echarts.format.addCommas(value) + ' '
          ].join('')
        }
      },
      series: [
        {
          name: '工厂信息',
          type: 'treemap',
          visibleMin: 300,
          data: dataList,
          leafDepth: 1,
          label:{
            show:true,
            formatter:'{b}'
          },
          levels: [
            {
              itemStyle: {
                borderColor: '#555',
                borderWidth: 4,
                gapWidth: 4
              }
            },
            {
              colorSaturation: [0.3, 0.6],
              itemStyle: {
                borderColorSaturation: 0.7,
                gapWidth: 2,
                borderWidth: 2
              }
            },
            {
              colorSaturation: [0.3, 0.5],
              itemStyle: {
                borderColorSaturation: 0.6,
                gapWidth: 1
              }
            },
            {
              colorSaturation: [0.3, 0.5]
            }
          ]
        }
      ]
    }

    console.info(option)
    option && myChart.setOption(option)
  }
}
</script>


<style scoped lang="scss">

</style>
