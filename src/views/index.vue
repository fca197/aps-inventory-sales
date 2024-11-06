<template>
  <div class="app-container home">

    <el-dialog :visible.sync="machineOpen" title="机器在制详情" width="900px">
      <machine-info></machine-info>
    </el-dialog>
    <el-dialog :visible.sync="orderCreateOpen" title="订单下单数量" width="900px">
      <order-create></order-create>
    </el-dialog>
    <el-dialog :visible.sync="orderCreateForecastProcessOpen" title="订单下单数量" width="900px">
      <order-create-forecast-process/>
    </el-dialog>
    <el-dialog :visible.sync="apsSystemPreviewOpen" title="工厂信息" width="900px">
      <aps-system-preview/>
    </el-dialog>
    <el-dialog :visible.sync="machineProduceBomOpen" title="制造路径中商品零件清单" width="900px">
      <machine-produce-bom/>
    </el-dialog>
    <el-dialog :visible.sync="machineUseTimeOpen" title="机器使用时长" width="900px">
      <machine-use-time/>
    </el-dialog>

    <el-row>
      <el-col :span="24">
        <el-button type="primary" @click="orderCreateOpen=true">查看订单下单数量（日历热力图）</el-button>
        <el-button type="primary" @click="machineOpen=true">查看机器在制数量（日历饼图）</el-button>
        <el-button type="primary" @click="orderCreateForecastProcessOpen=true">预测订单车间制造数量（主状图）</el-button>
        <el-button type="primary" @click="apsSystemPreviewOpen=true">工厂信息图（矩阵图）</el-button>
        <el-button type="primary" @click="machineProduceBomOpen=true">制造路径中商品零件清单（树图）</el-button>
        <el-button type="primary" @click="machineUseTimeOpen=true">机器使用时长（雷达图）</el-button>
      </el-col>

    </el-row>

    <!--    <el-row :gutter="20" style="display: none">-->

    <!--      <el-col :span="12" style="height: 300px;overflow-y: scroll">-->
    <!--        <h3>最近-->
    <!--          <el-select v-model="unDonTaskCount" @change="getUndoneTask" size="small" style="width: 75px;">-->
    <!--            <el-option v-for="(option,index) in  unDonTaskCountList " :key="'select'+index+option" :label="''+option" :value="option"></el-option>-->
    <!--          </el-select>-->
    <!--          条待办-->
    <!--        </h3>-->
    <!--        <el-table :data="undoneTaskList" v-loading="taskLoading" style="width: 100% ;">-->
    <!--          <el-table-column label="任务名称" prop="name"></el-table-column>-->
    <!--          <el-table-column label="任务创建时间" prop="createTime"></el-table-column>-->
    <!--          <el-table-column label="操作">-->
    <!--            <template slot-scope="scope">-->
    <!--              <el-button type="primary" size="mini" @click="showTask(scope.row)">查看</el-button>-->
    <!--            </template>-->
    <!--          </el-table-column>-->
    <!--        </el-table>-->
    <!--      </el-col>-->
    <!--      <el-col :span="12" style="height: 300px;overflow-y: scroll">-->
    <!--        <h3>-->
    <!--          流程发起-->
    <!--        </h3>-->

    <!--      </el-col>-->
    <!--    </el-row>-->
    <el-divider/>
    <el-row :gutter="20">
      <el-col :span="12">
        <div id="mainDiv" style="width: 100%;height: 200px"></div>
      </el-col>
      <el-col :span="12">
        <div id="cityMap" style="width: 100%;height: 200px"></div>
      </el-col>
    </el-row>
    <el-divider/>
    <el-row :gutter="24">
      <h3>版本变更记录</h3>
      <version-change></version-change>
    </el-row>
    <!--    <el-dialog :visible="taskOpen" @close="taskCancel" title="流程详情" width="900px">-->
    <!--      <flow-detail :setting="taskSetting" :key="taskSetting.id"></flow-detail>-->
    <!--    </el-dialog>-->

  </div>
</template>

<script>
import ECharts from 'events'
import * as echarts from 'echarts'
import versionChange from '@/views/version/index.vue'
import { post } from '@/api/common'
import flowDetail from '@/views/flow/flowForm/FlowDetail.vue'
import OrderCreate from '@/views/dashboard/calendar/OrderCreate.vue'
import MachineInfo from '@/views/dashboard/calendar/MachineInfo.vue'
import ApsSystemPreview from '@/views/dashboard/calendar/ApsSystemPreview.vue'
import OrderCreateForecastProcess from '@/views/dashboard/calendar/OrderCreateForecastProcess.vue'
import MachineProduceBom from '@/views/dashboard/calendar/MachineProduceBom.vue'
import MachineUseTime from '@/views/dashboard/calendar/MachineUseTime.vue'

export default {
  name: 'VersionChangeIndex',
  components: {
    ECharts, versionChange, flowDetail, OrderCreate, MachineInfo, OrderCreateForecastProcess,
    ApsSystemPreview, MachineProduceBom, MachineUseTime
  },
  data() {
    let cl = [5, 10, 30, 50]
    let taskOpen = false
    return {
      taskLoading: true,
      taskSetting: {
        open: taskOpen
      },
      taskOpen: taskOpen,
      machineOpen: false,
      orderCreateOpen: false,
      apsSystemPreviewOpen: false,
      machineProduceBomOpen: false,
      machineUseTimeOpen: false,
      orderCreateForecastProcessOpen: false,
      unDonTaskCountList: cl,
      unDonTaskCount: cl[0],
      undoneTaskList: [],
      // 版本号
      version: '3.8.6'
    }
  },
  mounted() {
    let myChart = echarts.init(document.getElementById('mainDiv'))
    // 绘制图表
    myChart.setOption({
      title: { text: '生产数量-示例' },
      tooltip: {
        trigger: 'axis'
      },
      grid: {
        left: '0%',
        right: '0%',
        bottom: '0%',
        containLabel: true
      },
      legend: {
        data: ['产能', '限制', '订单量']
      },
      xAxis: {
        data: ['2024-01-03', '2024-01-04', '2024-01-05', '2024-01-06', '2024-01-07', '2024-01-08']
      },
      yAxis: {},
      series: [{
        name: '产能',
        type: 'line',
        data: [15, 20, 37, 15, 8, 23]
      }, {
        name: '限制',
        type: 'line',
        data: [13, 23, 27, 45, 18, 43]
      }, {
        name: '订单量',
        type: 'line',
        data: [33, 23, 47, 15, 48, 63]
      }]
    })
    let cityChart = echarts.init(document.getElementById('cityMap'))
    cityChart.setOption({
      title: { text: '最近30天下单量-示例' },
      tooltip: {
        trigger: 'axis'
      },
      grid: {
        left: '0%',
        right: '0%',
        bottom: '0%',
        containLabel: true
      },
      legend: {
        data: ['SUV-订单量', 'MPV-订单量']
      },
      xAxis: {
        data: ['2024-02-03', '2024-02-04', '2024-02-05', '2024-02-06', '2024-02-07', '2024-02-08']
      },
      yAxis: {},
      series: [{
        name: 'SUV-订单量',
        type: 'line',
        data: [42, 33, 67, 35, 18, 93]
      }, {
        name: 'MPV-订单量',
        type: 'line',
        data: [32, 13, 67, 55, 38, 83]
      }]
    })
  },
  created() {
    this.getUndoneTask()
  },
  methods: {
    showTask(task) {
      this.taskOpen = true
      task.id = new Date().getTime()
      for (let taskKey in task) {
        this.taskSetting[taskKey] = task[taskKey]
      }
      this.taskSetting.cancel = this.taskCancel
      this.taskSetting.showCompleteBtn = true

    },
    getUndoneTask() {
      this.taskLoading = true
      post('/flow/task/undone/home', { flowKey: 'flowKey', pageNum: 1, pageSize: this.unDonTaskCount }, false).then(t => {
        this.undoneTaskList = t.data.dataList
        this.taskLoading = false
      })
    }, taskCancel() {
      this.taskOpen = false
    }
  }
}
</script>

<style lang="scss" scoped>
.home {
  blockquote {
    padding: 10px 20px;
    margin: 0 0 20px;
    font-size: 17.5px;
    border-left: 5px solid #eee;
  }

  hr {
    margin-top: 20px;
    margin-bottom: 20px;
    border: 0;
    border-top: 1px solid #eee;
  }

  .col-item {
    margin-bottom: 20px;
  }

  ul {
    padding: 0;
    margin: 0;
  }

  font-family: "open sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 13px;
  color: #676a6c;
  overflow-x: hidden;

  ul {
    list-style-type: none;
  }


  h3 {
    margin-bottom: 10px;
    font-size: 18px;
    line-height: 1.1;
    font-weight: 800;
  }

  p {
    margin-top: 10px;

    b {
      font-weight: 700;
    }
  }

  .update-log {
    ol {
      display: block;
      list-style-type: decimal;
      margin-block-start: 1em;
      margin-block-end: 1em;
      margin-inline-start: 0;
      margin-inline-end: 0;
      padding-inline-start: 40px;
    }
  }
}
</style>

