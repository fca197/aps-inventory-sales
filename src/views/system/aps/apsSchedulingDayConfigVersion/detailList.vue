<template>
  <div class="app-container">

    <div class="orderDivMain" v-for="(item,index) in data.headerList" :key="index">
      <div class="orderDivTitle">
        <div class="value">{{ item.showName }}</div>
      </div>
      <div class="orderDivSingleton">
        {{ void (orderList = data.versionDetailMap[item.fieldName]) }}
        <div class="orderDiv" v-for="(order ,index ) in orderList" :key="index">
          <div class="sortIndex">
            <div class="title">制造序号:</div>
            <div class="value">{{ order.sortIndex }}</div>
          </div>
          <div class="orderNo">
            <div class="title">单号:</div>
            <div class="value"> {{ order.orderNo }} 112345678765432</div>
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
            <div class="title">满足:</div>
            <div class="value"> {{ order.loopIndex }}</div>
          </div>
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

.orderDivMain {
  width: 100%;
  margin: 10px 0;
}

.orderDivSingleton {
  overflow-x: scroll;
  display: -webkit-box;
}

.orderDivTitle {
  font-size: 20px;
  width: 200px;
  padding: 0 0 10px 0;
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
}

.orderDiv > div {
  line-height: 25px;
  display: -webkit-box;
}

.orderDiv > div > div.title {
  width: 100px;
  display: ruby-text;
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
