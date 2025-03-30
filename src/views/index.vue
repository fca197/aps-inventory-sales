<template>
  <div class="app-container home">

    <el-dialog :visible.sync="machineOpen" title="机器在制详情" width="900px">
      <machine-info></machine-info>
    </el-dialog>
    <el-dialog :visible.sync="orderCreateOpen" title="订单下单数量" width="900px">
      <order-create></order-create>
    </el-dialog>
    <el-dialog :visible.sync="orderCreateForecastProcessOpen" title="预测订单车间制造数量" width="900px">
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
    <el-dialog :visible.sync="orderCreateAndMakeOpen" title="下单量与制造量对比" width="900px">
      <order-create-and-make/>
    </el-dialog>

    <el-row>
      <el-col :span="24" style="line-height: 40px;">
        <el-button type="primary" size="small" @click="orderCreateOpen=true">查看订单下单数量</el-button>
        <el-button type="primary" size="small" @click="machineOpen=true">查看机器在制数量（日历饼图）</el-button>
        <el-button type="primary" size="small" @click="orderCreateForecastProcessOpen=true">预测订单车间制造数量（主状图）</el-button>
        <el-button type="primary" size="small" @click="apsSystemPreviewOpen=true">工厂信息图</el-button>
        <el-button type="primary" size="small" @click="machineProduceBomOpen=true">制造路径中商品零件清单（树图）</el-button>
        <el-button type="primary" size="small" @click="machineUseTimeOpen=true">机器使用时长（雷达图）</el-button>
        <el-button type="primary" size="small" @click="orderCreateAndMakeOpen=true">下单量与制造量对比（雨量流量关系图）</el-button>
        <el-button type="primary" size="small" @click="resetDb">{{ resetLastTime }}秒后可还原数据库</el-button>
      </el-col>

    </el-row>


    <el-divider/>

    <user-report-home/>

  </div>
</template>

<script>

import versionChange from '@/views/version/index.vue'
import { post, queryUrlNoPageList } from '@/api/common'
import flowDetail from '@/views/flow/flowForm/FlowDetail.vue'
import OrderCreate from '@/views/dashboard/calendar/OrderCreate.vue'
import MachineInfo from '@/views/dashboard/calendar/MachineInfo.vue'
import ApsSystemPreview from '@/views/dashboard/calendar/ApsSystemPreview.vue'
import OrderCreateForecastProcess from '@/views/dashboard/calendar/OrderCreateForecastProcess.vue'
import MachineProduceBom from '@/views/dashboard/calendar/MachineProduceBom.vue'
import MachineUseTime from '@/views/dashboard/calendar/MachineUseTime.vue'
import OrderCreateAndMake from '@/views/dashboard/calendar/OrderCreateAndMake.vue'
import UserReportHome from '@/views/system/base/baseReportConfig/UserReportHome.vue'
export default {
  name: 'VersionChangeIndex',
  components: {
    UserReportHome,
    versionChange, flowDetail, OrderCreate, MachineInfo, OrderCreateForecastProcess,
    ApsSystemPreview, MachineProduceBom, MachineUseTime, OrderCreateAndMake
  },
  data() {
    let cl = [5, 10, 30, 50]
    let taskOpen = false
    return {
      resetLastTime: 0,
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
      orderCreateAndMakeOpen: false,
      orderCreateForecastProcessOpen: false,
      unDonTaskCountList: cl,
      unDonTaskCount: cl[0],
      undoneTaskList: [],
      // 版本号
      version: '3.8.6',

    }
  },
  mounted() {


  },
  created() {
    this.resetLast()
  },
  methods: {

    resetDb() {
      if (this.resetLastTime != 0) {
        this.$message.warning('请' + this.resetLastTime + '秒后再试')
        return
      }
      post('/db/reset', {})
    },
    resetLast() {
      post('/db/reset/last', {}, false).then(t => {
        this.resetLastTime = t.data.expire
        if (this.resetLastTime <= 0) {
          this.resetLastTime = 0
          return
        }
        let _t = this
        // 设置定时器，每秒执行一次
        const intervalId = setInterval(() => {
          // 倒计时减 1
          _t.resetLastTime--
          // 当倒计时到 0 时，停止定时器
          if (_t.resetLastTime === 0) {
            clearInterval(intervalId)
          }
        }, 1000)

      })
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

