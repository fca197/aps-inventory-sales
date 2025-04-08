<template>
  <div class="app-container">
<!--    <el-button type="primary" @click="getList" icon="el-icon-refresh">查询</el-button>-->

    <el-row label="工艺路径排程" v-if="showTable==='gylz'">

      <div v-if="data.versionDetailMap==null">暂无记录</div>

      <div class="orderDivMain" v-for="(item,index) in data.headerList" :key="index">

        {{ void (orderList = data.versionDetailMap[item.fieldName]) }}
        <div class="orderDivTitle">
          <div class="value">{{ item.showName }}</div>
          <div class="operation">
            <el-button type="primary" size="mini" @click="confirmSortIndex(item.fieldName+index)">确认序列</el-button>
          </div>
        </div>
        <div class="orderDivSingleton">
          <draggable @start="drag=true" @end="drag=false" :id="item.fieldName+index">
            <div v-for="(order,index) in orderList" class="orderDiv" :key="index" :ref="item.fieldName" v-bind:id="order.id">

              <table cellpadding="1px" cellspacing="2px">
                <tr>
                  <td class="title">制造序号:</td>
                  <td class="value">{{ order.sortIndex }}</td>
                </tr>

                <tr>
                  <td class="title">排程制造ID:</td>
                  <td class="value">{{ order.id }}</td>
                </tr>

                <tr>
                  <td class="title">单号:</td>
                  <td class="value">{{ order.orderNo }}</td>
                </tr>
                <tr>
                  <td class="title">匹配类型:</td>
                  <td class="value">{{ order.configBizType }}</td>
                </tr>

                <tr>
                  <td class="title">匹配名称:</td>
                  <td class="value">{{ order.configBizName }}</td>
                </tr>
                <tr>
                  <td class="title">匹配:</td>
                  <td class="value">{{ order.isMatch }}</td>
                </tr>
                <tr>
                  <td class="title">满足:</td>
                  <td class="value">{{ order.loopEnough }}</td>
                </tr>
                <tr>
                  <td class="title">循环:</td>
                  <td class="value">{{ order.loopIndex }}</td>
                </tr>
              </table>
            </div>
          </draggable>
        </div>
      </div>

    </el-row>

    <el-row v-if="showTable==='zzlj'">

      <el-col :span="20">
        <el-form :inline="true" size="small">
          <el-form-item label="时间间隔">
            <el-select v-model="timeSpan" @change="timeSpanChange">
              <el-option :value="60" label="1分钟">1分钟</el-option>
              <el-option :value="300" label="5分钟">5分钟</el-option>
              <el-option :value="600" label="10分钟">10分钟</el-option>
              <el-option :value="1800" label="30分钟">30分钟</el-option>
              <el-option :value="3600" label="1小时">1小时</el-option>
              <el-option :value="21600" label="6小时">6小时</el-option>
              <el-option :value="43200" label="12小时">12小时</el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="4">
        <el-tooltip class="item" effect="dark" content="下载文件与页面展示颜色不一致" placement="top">

          <el-button icon="el-icon-download" size="mini" @click="downLoadMachineResult"></el-button>
        </el-tooltip>
      </el-col>
      <machine-result :key="timeSpanChangeKey" :id="id" :timeInterval="timeSpan"></machine-result>

    </el-row>


  </div>
</template>

<script>
import { post } from '@/api/common'
import draggable from 'vuedraggable'
import { formatDate } from '@/utils/formatDate'
import MachineResult from '@/views/system/aps/apsSchedulingDayConfigVersion/MachineResult.vue'
import { downloadForm } from '@/utils/request'

export default {
  components: {
    draggable,
    MachineResult
  },
  name: 'detailList',
  data() {
    return {
      showTable: 'gylz',
      id: this.$route.query.id,
      productType: this.$route.query.productType,
      drag: false,
      data: {},
      dataList: [],
      timeSpan: 60 * 5,
      timeSpanChangeKey: ''
    }
  },
  created() {
    this.getList()
  },
  mounted() {
    if ('MAKE' === this.productType) {
      this.showTable = 'zzlj'
    } else {
      this.showTable = 'gylz'
    }
  },
  watch: {},
  methods: {
    formatDate,

    getList() {

      post('/apsSchedulingDayConfigVersion/detailList', { id: this.id }, false).then(t => {
        console.info(t)
        this.data = t.data
        this.dataList = [{}]
      })
    },

    confirmSortIndex(gId) {
      var elList = document.getElementById(gId).children
      // console.info(gId, elList)
      let tl = []
      for (let t = 0; t < elList.length; t++) {
        // console.info(t, elList[t].id)
        tl.push({
          id: elList[t].id,
          sortIndex: t + 1
        })

      }
      console.info(tl)
      post('/apsSchedulingDayConfigVersion/updateOrderSortIndex', {
        orderList: tl,
        id: this.id
      }).then(t => this.getList())
    },
    timeSpanChange() {
      this.timeSpanChangeKey = Math.random() + ''
    },
    downLoadMachineResult() {
      downloadForm('/apsSchedulingDayConfigVersionDetailMachine/exportQueryPageList',
        {
          'timeSpan': this.timeSpan,
          'data': {
            'schedulingDayId': this.id
          }
        }, '排程结果.xlsx', {})
    }
  }
}

</script>


<style scoped lang="scss">

.orderDivMain {
  width: 100%;
  margin: 5px 0;
}

.orderDivSingleton > div {
  overflow-x: scroll;
  display: -webkit-box;
  margin-bottom: 20px;
}

.orderDivTitle {
  font-size: 20px;
  width: 100%;
  padding: 0 0 10px 0;
  display: -webkit-box;
}

.operation {
  padding-left: 30px;
  float: right;
}

.orderDivTitle > div.value {
  font-weight: bold;
  color: #d23131;
}


.orderDiv {
  margin: 0 10px 10px 0;
  padding: 10px;
  border: 1px solid #ccc;
  width: 350px;
  scroll-behavior: smooth;
  cursor: move;
}

.orderDiv > div {
  line-height: 20px;
  display: -webkit-box;
}


.orderDiv > table > tr > td.title::after {
  width: 10px;
}

.orderDiv > table > tr > td {
  margin-left: 30px;
}

.orderDiv > table > tr > td.title {
  text-align: right;
}

</style>
