<template>
  <div class="app-container">

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
  </div>
</template>

<script>
import { post } from '@/api/common'
import draggable from 'vuedraggable'

export default {
  components: {
    draggable
  },
  name: 'detailList',
  data() {
    return {
      id: this.$route.query.id,
      drag: false,
      data: {},
      dataList: []
    }
  },
  created() {

    this.getList()
  },
  methods: {
    getList() {

      post('/apsSchedulingDayConfigVersion/detailList', { id: this.id }, false).then(t => {
        // console.info(t)
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
