<template>
  <div>
    <el-form ref="form" :model="buyPlanInfo" label-width="100px">
      <el-form-item label="计划名称" prop="planName">
        <el-col :span="9">
          <el-input v-model="buyPlanInfo.planName" placeholder="请输入计划名称" width="100px"/>
        </el-col>
        <el-col :offset="5" :span="5">
          <el-input v-model="batchCount" placeholder="" type="number" width="100px"/>
        </el-col>
        <el-col :span="4">
          <el-button size="medium" type="warning" @click="batchUpdateBuyCount">
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
        <el-table-column label="操作" fixed="right" width="140px">
          <template slot-scope="scope">
            <el-button v-if="scope.row.isTmp!=='1'" size="mini" type="warning" @click="handleDelete(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-divider><i class="el-icon-plus"></i></el-divider>
      <div>
        <el-col :offset="14" :span="10" style="padding-top: 10px"> 选择添加的商品:
          <el-select v-model="buyPlanVisibleFormGoodsId" :filter-method="value=>{changeGoods(value)}" filterable placeholder="请选择商品" width="100%" @change="selectGoods">
            <el-option v-for="item in goodsList" :key="item.id" :label="item.goodsName" :value="item.id"/>
          </el-select>
        </el-col>
      </div>
      <el-divider/>
    </el-form>
  </div>
</template>

<script>
import {getFoodsList} from "@/api/jcx/goods";

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
      buyPlanVisibleFormGoodsId: "",
      goodsList: [],
      batchCount: 1,
    }
  }
  ,
  created() {
    this.totalPrice();
    this.changeGoods('')
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
      this.buyPlanInfo.jcxBuyPlanItemDtoList = this.buyPlanInfo.jcxBuyPlanItemDtoList || []
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
      this.$forceUpdate();
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
    handleDelete(index) {
      this.buyPlanInfo.jcxBuyPlanItemDtoList.splice(index, 1)
    },
    changeGoods(val) {
      return getFoodsList({pageNum: 1, pageSize: 10, data: {goodsName: val}})
      .then(response => {
        this.goodsList = response.dataList
      })
    },
    selectGoods(val) {
      let d = this.goodsList.filter(t => t.id === val)[0]
      d.goodsId = d.id
      d.goodsBuyCount = 1
      let d2 = {...d}
      this.buyPlanInfo.jcxBuyPlanItemDtoList.push(d2)
      this.totalPrice();
    }
  }
}
</script>


