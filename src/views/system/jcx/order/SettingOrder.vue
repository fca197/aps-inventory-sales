<template>
  <div>
    <span class="order-header-title"> 订单序号:</span> <span class="order-header-value"> {{ settingOpenInfo.id }} </span>
    <br/>
    <span class="order-header-title"> 订单编号:</span> <span class="order-header-value">  {{ settingOpenInfo.orderNo }} </span>
    <br/>
    <span class="order-header-title"> 下单时间:</span> <span class="order-header-value">  {{ settingOpenInfo.createTime }} </span>
    <br/>
    <span class="order-header-title"> 商品列表:</span>
    <el-table :data="orderItems" style="width: 100%">
      <el-table-column label="商品名称" align="center" prop="goodsName"/>
      <el-table-column label="商品数量" align="center" prop="goodsCount"/>
      <el-table-column label="商品成本价" align="center" prop="goodsCostPrice"/>
      <el-table-column label="商品销售价" align="center" prop="goodsSalePrice"/>
      <el-table-column label="商品毛利" align="center" prop="goodsGrossProfit"/>
      <el-table-column label="商品净利润" align="center" prop="goodsNetProfit"/>
      <el-table-column label="商品总销售价" align="center" prop="goodsTotalSalePrice"/>
      <el-table-column label="操作" align="center" prop="id">
        <template slot-scope="scope">
          <el-select v-model="scope.row.goodsStatus" @change="value=>{updateOrderItem(value,scope.row.id)}" >
            <el-option label="退款/退货" :value="1"/>
            <el-option label="退款/不退货"  :value="2"/>
          </el-select>
        </template>
      </el-table-column>
    </el-table>
    <el-drawer/>
    <div class="setting-order-footer" align="right">
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


<style scoped lang="scss">
.order-header-title {
  font-size: 15px;
  color: #409EFF;
}

.order-header-value {
  font-size: 15px;
  color: #000;
}

.setting-order-footer {
  margin-top: 15px;
}
</style>
