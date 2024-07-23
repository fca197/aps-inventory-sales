<template>
  <div class="app-container">
    <div class="orderDivMain">
      <div class="orderDivSub" v-for="(item,index) in data.headerList" :key="index">
        <div class="orderDivSubTitle"><span>{{ item.showName }}</span></div>
        {{ void (orderList = data.versionDetailMap[item.fieldName]) }}
        <div class="orderDiv" v-for="(order ,index ) in orderList" :key="index">
          <div class="sortIndex">序号:<span>{{ order.sortIndex }}</span></div>
          <div class="configBizType">匹配类型:<span>{{ order.configBizTypeStr }}</span></div>
          <div class="orderNo">单号:<span>{{ order.orderNo }}</span></div>
          <div class="isMatch">匹配:<span>{{ order.isMatchStr }}</span></div>
          <div class="loopEnough">满足:<span>{{ order.loopEnoughStr }}</span></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { post } from '@/api/common'

export default {
  name: 'detailList',
  data() {
    return {
      id: this.$route.query.id,
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
    }
  }
}

</script>


<style scoped lang="scss">

.el-table tbody tr:hover > td {

  background-color: #101d3f !important

}

.orderDivMain {
  width: 100%;
}

.orderDivSub {
  display: inline-table;
  margin: 0 10px;
}

.orderDiv {
  margin: 10px 0;
}
</style>
