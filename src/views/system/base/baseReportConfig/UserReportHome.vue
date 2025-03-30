<template>
  <div>
    <el-row :gutter="24" style="margin-bottom: 5px">
      <el-popover trigger="hover" placement="right-start" width="400">
        <el-row>
          <el-col :span="2" v-for="r in baseReportConfigList">
            <el-button type="primary" size="mini" @click="addReport(r)">{{ r.reportName }}</el-button>
          </el-col>
        </el-row>
        <el-button slot="reference" size="mini" type="primary">添加报表</el-button>
      </el-popover>
    </el-row>
    <el-row :gutter="24">
      <draggable @end="onDragEnd" v-model="userReportConfigList">
        <el-col v-for="(uc,i) in userReportConfigList" :span="uc.colSpan" :style="'height: '+uc.height+'px'"
                :id="'userReportConfig_'+i"
                style="text-align: right;margin: 0 0 10px;"
        >
          <el-row style="text-align: right;">
            <el-popover placement="top-start" width="200" trigger="hover">
              <el-row>
                <el-button type="info" size="mini" icon="" class="reportOperCss" @click="colSpanAdd(uc)"> < > 加宽</el-button>
                <el-button type="info" size="mini" icon="" class="reportOperCss" @click="colSpanDwindle(uc)"> > < 缩小</el-button>
                <el-button type="info" size="mini" icon="el-icon-arrow-up" class="reportOperCss" @click="heightDwindle(uc)"> 缩高</el-button>
                <el-button type="info" size="mini" icon="el-icon-arrow-down" class="reportOperCss" @click="heightAdd(uc)"> 加高</el-button>
                <el-button type="info" size="mini" icon="el-icon-delete" class="reportOperCss" @click="deleteUc(uc)"> 删除</el-button>
              </el-row>
              <el-button size="mini" slot="reference" >操作</el-button>
            </el-popover>

          </el-row>
          <el-row :id="'eChat_'+i+'_userReportConfig_'+uc.reportConfigId" :style="'height: '+(uc.height+20)+'px'">
            <!--  eChat_0_userReportConfig_1 -->

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
            console.info(myChart)
            // 绘制图表
            post(this.baseReportConfigMap[uc.reportConfigId].reportUrl, {}, false).then(res => {
              myChart.setOption(res.data)
            })
          }

        })
      })
    },

    addReport(baseReport) {
      // if (this.userReportConfigList.filter(t => t.reportConfigId === baseReport.id).length > 0) {
      //   this.$message.warning('该报表已添加')
      //   return
      // }

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
      post('/baseReportConfigUser/updateById', uc)
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
      this.updateReportById(uc)
    },
    onDragEnd() {
      let index = 0
      this.userReportConfigList.forEach(t => {
        t.sortIndex = index
        console.info(t.id, index)
        index++
      })
      post('/baseReportConfigUser/batch/updateById', this.userReportConfigList)
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
</style>
