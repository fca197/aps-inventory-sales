<template>
  <div>
    <span class="header-title"> 订单序号:</span> <span class="header-value"> {{ settingOpenInfo.id }} </span>
    <br/>
    <span class="header-title"> 订单序号:</span> <span class="header-value">  {{ settingOpenInfo.orderNo }} </span>
    <br/>
    <span class="header-title"> 下单时间:</span> <span class="header-value">  {{ settingOpenInfo.createTime }} </span>
    <br/>
    <span class="header-title"> 商品列表:</span>
    <el-table :data="orderItems" style="width: 100%">
      <el-table-column align="center" label="商品名称" prop="goodsName"/>
      <el-table-column align="center" label="商品数量" prop="goodsCount"/>
      <el-table-column align="center" label="商品成本价" prop="goodsCostPrice"/>
      <el-table-column align="center" label="商品销售价" prop="goodsSalePrice"/>
      <el-table-column align="center" label="商品毛利" prop="goodsGrossProfit"/>
      <el-table-column align="center" label="商品净利润" prop="goodsNetProfit"/>
      <el-table-column align="center" label="商品总销售价" prop="goodsTotalSalePrice"/>
      <el-table-column align="center" label="操作" prop="id"  fixed="right" width="140px">
        <template slot-scope="scope">
          <el-select v-model="scope.row.goodsStatus" @change="value=>{updateOrderItem(value,scope.row.id)}">
            <el-option :value="1" label="退款/退货"/>
            <el-option :value="2" label="退款/不退货"/>
          </el-select>
        </template>
      </el-table-column>
    </el-table>
    <el-drawer/>
    <div align="right" class="setting-footer">
      <el-button @click="cancel">取消</el-button>
    </div>
  </div>
</template>

<script>
import {getById} from "@/api/common";

export default {
  name: "SettingOrder",
  props: {
    settingOpenId: {},
    settingOpenInfo: {
      createTime: ''
    },
    settingOpen: {}

  },
  data() {
    return {
      oderNo: '',
      orderId: '',
      orderItems: [{id: 11000}, {id: 2000}]
    }
  },
  watch: {
    settingOpenId: {
      deep: true,
      handler(newVal, oldVal) {
        console.log("watch settingOpenId ", newVal, " oldVal", oldVal)
        var id = newVal !== undefined ? newVal : oldVal
        this.loadOrderInfo(id)
      }
    },
    // settingOpenInfo: {
    //   deep: true,
    //   handler(newVal, oldVal) {
    //     console.log("watch settingOpenInfo ", newVal, " oldVal", oldVal)
    //     // var id = newVal !== undefined ? newVal : oldVal
    //     // this.loadOrderInfo(id)
    //   }
    // }
  },
  created() {

  },
  beforeUpdate() {
    // console.log("beforeUpdate settingOpenInfo ", this.settingOpenInfo)
  },
  computed() {
    // console.log("computed settingOpenInfo ", this.settingOpenInfo)
    this.loadOrderInfo(this.settingOpenInfo.id)
  },
  mounted() {
    // console.log("mounted settingOpenInfo ", this.settingOpenInfo)
    this.loadOrderInfo(this.settingOpenInfo.id)
  },
  methods: {
    loadOrderInfo(id) {
      console.log("id ", id)
      if (id === undefined) {
        return;
      }
      return getById({idList: [id]}).then(t => {
        var data = t.data.dataList[0];
        if (data) {
          this.oderNo = data.orderNo
          this.orderId = data.id
          this.orderItems = data.orderItemDtoList
        }
      })
    },
    cancel() {
      this.$emit('close', false)
    },
    updateOrderItem(id, val) {
      console.log("id ", id, " val ", val)
      this.$message.warning("暂未实现");
    }
  }
}
</script>


<style lang="scss" scoped>
</style>
