<template>
  <div>
    <el-form :model="buyOrder" label-width="100px" size="mini">
      <el-form-item label="订单单好" prop="orderNo">
        <el-input v-model="buyOrder.orderNo"/>
      </el-form-item>
      <el-form-item label="订单备注" prop="orderNo">
        <el-input v-model="buyOrder.orderRemark"/>
      </el-form-item>
      <div class="header-title">采购单明细:</div>
      <el-table :key="buyOrder.id" :data="buyOrder.orderGoodsList" align="center" hidden-arrow-on-enter stripe>
        <el-table-column label="商品名称" prop="goodsName"/>
        <el-table-column label="单价" prop="costPrice"/>
        <el-table-column label="购买数量" prop="goodsBuyCount"/>
        <el-table-column label="总价" prop="costPriceTotal"/>
      </el-table>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "BuyOrderPreView",
  props: {
    buyOrder: {
      orderGoodsList: []
    }
  },
  created() {
    console.info("buyOrder: ", this.buyOrder)
  },
  methods: {}
}
</script>


<style lang="scss" scoped>

</style>
