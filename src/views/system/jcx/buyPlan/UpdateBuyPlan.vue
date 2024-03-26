<template>
  <div>
    <el-form ref="form" :model="buyPlanInfo" label-width="100px">
      <el-form-item label="计划名称" prop="planName">
        <el-col :span="9">
          <el-input v-model="buyPlanInfo.planName" width="100px" placeholder="请输入计划名称"/>
        </el-col>
        <el-col :span="5" :offset="5">
          <el-input v-model="batchCount" width="100px" placeholder="" type="number"/>
        </el-col>
        <el-col :span="4">
          <el-button type="warning" size="medium" @click="batchUpdateBuyCount">
            <svg-icon icon-class="brush"/>
          </el-button>
        </el-col>
      </el-form-item>
      <el-table :data="buyPlanInfo.jcxBuyPlanItemDtoList">
        <el-table-column label="商品名称" prop="goodsName"/>
        <el-table-column label="成本价" prop="costPrice"/>
        <el-table-column label="销售价" prop="salesPrice"/>
        <el-table-column label="毛利" prop="goodsGrossProfit"/>
        <el-table-column label="净利" prop="goodsNetProfit"/>
        <el-table-column label="库存" prop="goodsInventoryCount"/>
        <el-table-column label="告警数" prop="warningCount"/>
        <el-table-column label="数量" prop="buyCount">
          <template slot-scope="scope">
            <el-input v-if="scope.row.isTmp!=='1'" v-model="scope.row.goodsBuyCount" width="100px" @change="totalPrice"/>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="warning" size="mini" @click="handleDelete(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "UpdateBuyPlan",
  props: {
    buyPlanInfo: {
      jcxBuyPlanItemDtoList: []
    }
    , submitFun: {}
  },
  watch: {
    buyPlanInfo: {
      handler(newVal, oldVal) {
        this.totalPrice()
      }
    }
  },
  data() {
    return {
      batchCount: 1,
    }
  }
  ,
  created() {
    this.totalPrice();
  }
  ,
  methods: {
    submit() {
      this.submitFun(this.buyPlanInfo)
    }
    ,
    batchUpdateBuyCount() {
      this.buyPlanInfo.jcxBuyPlanItemDtoList.forEach(t => {
        t.goodsBuyCount = this.batchCount
      })
      this.totalPrice();
    },

    totalPrice() {
      this.totalTmp("costPrice")
      this.totalTmp("salesPrice")
      this.totalTmp("goodsGrossProfit")
      this.totalTmp("goodsNetProfit")
      let t = {
        isTmp: '1',
        goodsName: '合计',
        costPrice: this.buyPlanInfo.costPriceTotal,
        salesPrice: this.buyPlanInfo.salesPriceTotal,
        goodsGrossProfit: this.buyPlanInfo.goodsGrossProfitTotal,
        goodsNetProfit: this.buyPlanInfo.goodsNetProfitTotal,
      }
      this.buyPlanInfo.jcxBuyPlanItemDtoList = this.buyPlanInfo.jcxBuyPlanItemDtoList.filter(t => t.isTmp !== '1')
      this.buyPlanInfo.jcxBuyPlanItemDtoList.push(t)
    },

    totalTmp(key) {
      this.buyPlanInfo[key + "Total"] = this.sum(this.buyPlanInfo.jcxBuyPlanItemDtoList.filter(t => t.isTmp !== '1').map(t => parseInt(t[key]) * parseInt(t.goodsBuyCount)))
    }, sum(arr) {
      let len = arr.length;
      if (len === 0) {
        return 0;
      } else if (len === 1) {
        return arr[0];
      } else {
        return arr[0] + this.sum(arr.slice(1));
      }
    },
    handleDelete(index){
      this.buyPlanInfo.jcxBuyPlanItemDtoList.splice(index, 1)
    }
  }
}
</script>


