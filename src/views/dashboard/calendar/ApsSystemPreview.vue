<template>
  <div id="ApsSystemPreviewDiv" style="height: 400px ;width: 850px">

  </div>
</template>
<script>
import * as echarts from 'echarts'
import { post } from '@/api/common'

export default {
  name: 'ApsSystemPreview',
  mounted() {
    let myChart = echarts.init(document.getElementById('ApsSystemPreviewDiv'))


    post('/basePreview/info',{},false).then(t=>{
      let dataList=t.data.dataList;
      // myChart.setOption()
      let option = {
        title: {
          // height: 1,
          // left: 'center'
          // text: '系统配置组成',
          // subtext: formatDate(new Date()).substring(0,10),
          // left: 'leafDepth'
        },
        tooltip: {
          formatter: function(info) {
            var value = info.desc
            var treePathInfo = info.treePathInfo
            var treePath = []
            for (var i = 1; i < treePathInfo.length; i++) {
              treePath.push(treePathInfo[i].name)
            }
            return [
              '<div class="tooltip-title">' +
              echarts.format.encodeHTML(treePath.join('/')) +
              '</div>',
              // '' + echarts.format.addCommas(value) + ' '
            ].join('')
          }
        },
        series: [
          {
            name: '工厂信息',
            type: 'treemap',
            visibleMin: 0,
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
                  borderWidth: 3,
                  gapWidth: 1
                }
              },
              {
                colorSaturation: [0.3, 0.6],
                itemStyle: {
                  borderColorSaturation: 0.7,
                  gapWidth: 1,
                  borderWidth: 1
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

      // console.info(option)
      option && myChart.setOption(option)
    })
  }
}
</script>


<style scoped lang="scss">

</style>
