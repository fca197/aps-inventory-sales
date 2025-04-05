<template>
  <div>
    <el-row :gutter="24" style="margin-left: 2px">
      <el-popover trigger="hover" placement="right-start" width="400">
        <el-row>
          <el-button v-for="r in baseReportConfigList" type="primary" size="mini"  style="margin: 5px 5px" @click="addReport(r)">{{ r.reportName }}</el-button>
        </el-row>
        <el-button slot="reference" size="mini" type="primary">添加报表</el-button>
      </el-popover>
    </el-row>
    <el-row :gutter="24" style="margin-top: 20px">
      <draggable @end="onDragEnd" v-model="userReportConfigList">
        <el-col v-for="(uc,i) in userReportConfigList" :span="uc.colSpan" :style="'height: '+uc.height+'px'" class="userReportConfig">
          <el-row :id="'userReportConfig_'+uc.id" class="isHidden">
            <el-button type="info" size="mini" icon="" class="reportOperCss" @click="colSpanAdd(uc)"> < > 加宽</el-button>
            <el-button type="info" size="mini" icon="" class="reportOperCss" @click="colSpanDwindle(uc)"> > < 缩小</el-button>
            <el-button type="info" size="mini" icon="el-icon-arrow-up" class="reportOperCss" @click="heightDwindle(uc)"> 缩高</el-button>
            <el-button type="info" size="mini" icon="el-icon-arrow-down" class="reportOperCss" @click="heightAdd(uc)"> 加高</el-button>
            <el-button type="info" size="mini" icon="el-icon-delete" class="reportOperCss" @click="deleteUc(uc)"> 删除</el-button>
          </el-row>
          <el-row :id="'eChat_'+i+'_userReportConfig_'+uc.reportConfigId" :style="'height: '+(uc.height+20)+'px;width:100%'">
          </el-row>
        </el-col>
      </draggable>
    </el-row>
  </div>

</template>

<script>
import ECharts from 'events'
import * as echarts from 'echarts'
import draggable from 'vuedraggable'

import { post, queryUrlNoPageList } from '@/api/common'

export default {
  name: 'UserReportHome'
  , components: {
    ECharts, draggable
  },
  data() {
    return {
      baseReportConfigList: [],
      baseReportConfigMap: [],
      userReportConfigList: [{
        reportConfigId: undefined,
        sortIndex: undefined,
        colSpan: undefined,
        height: undefined,
        reportName: undefined,
        reportUrl: undefined,
        id: undefined
      }]
    }
  }, mounted() {
    this.loadReport()
  }, methods: {
    loadReport() {
      post('/baseReportConfigUser/queryPageList/self', { queryPage: false }, false).then(t => this.userReportConfigList = t.data.dataList)
      .then(() => {
        queryUrlNoPageList('/baseReportConfig').then(t => this.baseReportConfigList = t.data.dataList).then(() => {
          this.baseReportConfigList.forEach(t => {
            this.baseReportConfigMap[t.id] = t
          })
          // console.info(this.baseReportConfigMap)
        }).then(() => {
          this.$forceUpdate()
          for (let i = 0; i < this.userReportConfigList.length; i++) {
            let uc = this.userReportConfigList[i]
            let myChart = echarts.init(document.getElementById('eChat_' + i + '_userReportConfig_' + uc.reportConfigId))
            // console.info(myChart)
            // 绘制图表
            let userReport = this.baseReportConfigMap[uc.reportConfigId]
            // myChart.userReport = userReport
            post(userReport.reportUrl, {}, false).then(res => {
              let option = res.data
              let reportName = userReport.reportName
              option.title = {
                text: reportName,
                left: 'left', // 设置标题在左侧
                // textAlign : 'auto',
                // itemGap :'2',
                // textVerticalAlign:'middle',
                textStyle: {
                  fontSize: 14,
                  lineHeight: 15,
                  top: 20
                }
              }
              option.legend = {
                type: 'scroll',
                width: '400px'
                // animation: true,
                // bottom: 2
              },
                option.toolbox = {
                  show: true,
                  feature: {
                    // dataZoom: {
                    //   yAxisIndex: 'none'
                    // },
                    // dataView: { readOnly: false },
                    magicType: { type: ['line', 'bar'] },
                    // restore: {},
                    // saveAsImage: {}

                    myTool1: {
                      show: true,
                      title: '设置',
                      icon: 'path://M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z',
                      onclick: function() {
                        // this.$refs["userReportConfig_"+userReport.id].
                        //  userReport.isHidden=!userReport.isHidden;
                        console.info('userReportConfig_' + uc.id)
                        let rP = document.getElementById('userReportConfig_' + uc.id)
                        rP.classList.toggle('isHidden')
                      }
                    }
                  }
                },
                option.tooltip = {
                  trigger: 'axis',
                  axisPointer: {
                    type: 'shadow'
                  }
                }
              myChart.setOption(option)
              uc.myChart = myChart
            })
          }

        })
      })
    },
    resetReportSize(uc) {
      uc.myChart.resize()
    },

    addReport(baseReport) {
      if (this.userReportConfigList.filter(t => t.reportConfigId === baseReport.id).length > 0) {
        this.$message.warning('该报表已添加')
        return
      }

      post('/baseReportConfigUser/insert', {
        reportConfigId: baseReport.id,
        sortIndex: this.userReportConfigList.length + 1,
        colSpan: 12,
        height: 300,
        reportName: baseReport.reportName,
        reportUrl: baseReport.reportUrl
      }, false)
      .then(res => {
        if (res.code !== 200) {
          this.$message.error('报表添加失败，请稍后再试')
          return
        }
        this.loadReport()
      })

    }, colSpanAdd(uc) {
      uc.colSpan++
      this.updateReportById(uc)
    },
    colSpanDwindle(uc) {
      uc.colSpan--
      this.updateReportById(uc)
    },
    updateReportById(uc) {
      let reqUc = { ...uc }
      reqUc.myChart = undefined
      return post('/baseReportConfigUser/updateById', reqUc).then(() => {
        this.loadReport()
        this.$forceUpdate()
      })
    },
    heightAdd(uc) {
      if (uc.height > 6001) {
        this.$message.warning('已达最大高度')
        return
      }
      uc.height += 100
      this.updateReportById(uc)
    },
    heightDwindle(uc) {
      if (uc.height <= 200) {
        this.$message.warning('已达最低高度')
        return
      }
      uc.height -= 100
      this.updateReportById(uc).then(() => this.resetReportSize(uc))
    },
    onDragEnd() {
      let index = 0
      let chMap = {}
      this.userReportConfigList.forEach(t => {
        t.sortIndex = index
        chMap[t.id] = t.myChart
        t.myChart = undefined
        // t._children=undefined
        // console.info(t.id, index)
        index++
      })
      // console.info(this.userReportConfigList)
      post('/baseReportConfigUser/batch/updateById', this.userReportConfigList).then(t => {
        this.userReportConfigList.forEach(tt => {
          tt.myChart = chMap[t.id]
        })
      })
    }, deleteUc(uc) {
      post('/baseReportConfigUser/deleteByIdList', { idList: [uc.id] })
    }
  }

}
</script>


<style scoped lang="scss">
.reportOperCss {
  margin: 0 5px 5px;
}

.userReportConfig {
  margin-bottom: 30px !important;
}

.isHidden {
  display: none !important;
}
</style>
