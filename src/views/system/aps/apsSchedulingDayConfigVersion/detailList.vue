<template>
  <div class="app-container">

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
            <div class="sortIndex">
              <div class="title">排程制造:</div>
              <div class="value">{{ order.id }}</div>
            </div>
            <div class="sortIndex">
              <div class="title">制造序号:</div>
              <div class="value">{{ order.sortIndex }}</div>
            </div>
            <div class="orderNo">
              <div class="title">单号:</div>
              <div class="value"> {{ order.orderNo + '-' + index }}</div>
            </div>
            <div class="configBizType">
              <div class="title">匹配类型:</div>
              <div class="value">{{ order.configBizType }}</div>
            </div>
            <div class="configBizType">
              <div class="title">匹配名称:</div>
              <div class="value">{{ order.configBizName }}</div>
            </div>
            <div class="isMatch">
              <div class="title">匹配:</div>
              <div class="value"> {{ order.isMatch }}</div>
            </div>
            <div class="loopEnough">
              <div class="title">满足:</div>
              <div class="value"> {{ order.loopEnough }}</div>
            </div>
            <div class="匹配层数">
              <div class="title">循环:</div>
              <div class="value"> {{ order.loopIndex }}</div>
            </div>
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
        console.info(t)
        this.data = t.data
        this.dataList = [{}]
      })
    },
    confirmSortIndex(gId) {
      var elList = document.getElementById(gId).children
      // console.info(gId, elList)
      let tl=[];
      for (let t = 0; t < elList.length; t++) {
        // console.info(t, elList[t].id)
        tl.push({
          id: elList[t].id,
          sortIndex: t + 1
        })
      }
      console.info(tl)
      post("/apsSchedulingDayConfigVersion/updateOrderSortIndex",{
        orderList: tl,
        id: this.id
      }).then(t=>this.getList());
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
  width: 300px;
  scroll-behavior: smooth;
  cursor: move;
}

.orderDiv > div {
  line-height: 25px;
  display: -webkit-box;
}

.orderDiv > div > div.title {
  width: 80px;
  padding-right: 10px;
  text-align: right;
}


.orderDiv > div > div.value {
  color: #d23131;
}

.orderDiv > div.sortIndex > div.title {
//color: red;
}

.orderDiv > div.sortIndex > div.value {
  color: red;
}

.orderDiv > div > div.title::after {
  width: 10px;
}

.orderDiv > div > div.title {
//color: #000;

}
</style>
