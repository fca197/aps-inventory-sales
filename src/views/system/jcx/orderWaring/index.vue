<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="88px">
      <el-form-item label="文件名称" prop="jcxGoodsWaringName">
        <el-input v-model="queryParams.jcxGoodsWaringName" placeholder="请输入文件名称" clearable
                  @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="goodsInventory">新增预警</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="primary" plain size="mini" :disabled="multiple" @click="createBuyPlan">
          <svg-icon icon-class="buy-car"></svg-icon>
          采购计划
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="jcxGoodsWaringNameList" @selection-change="handleSelectionChange">

      <el-table-column label="全选" type="selection" align="center" prop="id" width="50"/>
      <el-table-column v-for="(item,index) in  tableHeaderList" :key="index" align="center" :prop="item.fieldName"
                       :label="item.showName"/>
      <!--      <el-table-column label="完成" align="center" prop="isDone" width="50">-->
      <!--        <template slot-scope="scope">-->
      <!--          <span v-if="scope.row.isDone">是</span>-->
      <!--          <span v-else>否</span>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
    </el-table>

    <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
    />

    <el-dialog title="采购计划" :visible.sync="buyPlanVisible" width="900px" append-to-body>
      <el-form ref="form" :model="buyPlanVisibleForm" :rules="rules" label-width="100px">
        <el-form-item label="计划名称" prop="planName">
          <el-col :span="9">
            <el-input v-model="buyPlanVisibleForm.planName" width="100px" placeholder="请输入计划名称"/>
          </el-col>
          <el-col :span="3" :offset="7">
            <el-input v-model="buyPlanVisibleForm.batchCount" width="100px" placeholder="请输入计划名称"/>
          </el-col>
          <el-col :span="3" :offset="1">
            <el-button type="primary" @click="batchUpdateBuyCount">批量修改数量</el-button>
          </el-col>
        </el-form-item>
      </el-form>
      <el-table :data="buyPlanVisibleForm.buyGoodsPlanList">
        <el-table-column label="商品名称" align="center" prop="goodsName"/>
        <el-table-column label="成本价" align="center" prop="costPrice"/>
        <el-table-column label="销售价" align="center" prop="salesPrice"/>
        <el-table-column label="剩余库存" align="center" prop="goodsInventoryCount"/>
        <el-table-column label="毛利" align="center" prop="goodsGrossProfit"/>
        <el-table-column label="净利" align="center" prop="goodsNetProfit"/>
        <el-table-column label="购买数" align="center" width="100px">
          <template slot-scope="scope">
            <el-input v-model="scope.row.goodsBuyCount" :min="1" @change="value => updateBuyCount(scope.row,value)" type="number"/>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="100px">
          <template slot-scope="scope">
            <el-button type="danger" plain icon="el-icon-delete" size="mini" @click="deleteGoods(scope.$index,scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-divider/>
      <div class="header-title">
        <el-col :span="9">款项预览<span style="color: #aaa ;font-size: 13px">(成本*数量)</span></el-col>
      </div>
      <table class="default-table" cellspacing="0" cellpadding="0">
        <tr class="thead">
          <td>采购总计</td>
          <td>出售价格</td>
          <td>毛利</td>
          <td>净利</td>
        </tr>
        <tr class="tbody">
          <td><span style="color: red">{{ buyPlanVisibleForm.totalPrice / 100.0 }}</span> 元</td>
          <td><span style="color: red">{{ buyPlanVisibleForm.salesPriceTotal / 100.0 }}</span> 元</td>
          <td><span style="color: red">{{ buyPlanVisibleForm.goodsGrossProfitTotal / 100.0 }}</span> 元</td>
          <td><span style="color: red">{{ buyPlanVisibleForm.goodsNetProfitTotal / 100.0 }}</span> 元</td>
        </tr>
      </table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitBuyPlanForm">确 定</el-button>
        <el-button @click="buyPlanVisible=false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import {add, getById, queryPageList, updateById} from '@/api/common'
import request from "@/utils/request";
import {getTenantId} from "@/utils/auth";
import {saveBuyPlan} from "@/api/buyPlan";
// console.info("xxx: ",uc.urlPrefix)
export default {
  name: "jcxGoodsWaringName",
  data() {

    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: false,
      buyPlanVisible: false,
      // 总条数
      total: 0,
      buyPlanVisibleForm: {
        batchCount: 1,
        totalPrice: 1,
        buyGoodsPlanList: []
      },
      jcxGoodsWaringNameList: [],

      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        jcxGoodsWaringName: undefined,
        createBy: undefined,
        status: undefined
      },
      // 表单参数
      form: {
        remark: "",
        jcxGoodsWaringName: "",
        jcxGoodsWaringCode: "",
        pwd: "",
        id: undefined,
        isUsed: true
      },
      // 表单校验
      rules: {},
      tableHeaderList: [{
        columnName: "id",
        showName: "序号"
      }, {
        columnName: "jcxGoodsWaringCode",
        showName: "文件编码"
      }, {
        columnName: "jcxGoodsWaringName",
        showName: "文件名称"
      }]
    };
  },
  created() {
    document["pagePath"] = "/jcxGoodsWarning";
    this.getList();
  },
  methods: {
    /** 查询公告列表 */
    getList() {
      // this.loading = true;
      queryPageList(this.queryParams).then(response => {
        response = response.data
        this.tableHeaderList = response.headerList
        this.jcxGoodsWaringNameList = response.dataList;
        this.total = parseInt(response.total);
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        remark: "",
        jcxGoodsWaringCode: "",
        id: undefined,
        jcxGoodsWaringName: undefined,
        isUsed: true
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加文件";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      let req = {idList: [row.id], pageSize: 1, pageNum: 1};
      getById(req).then(response => {
        this.form = response.data.dataList[0]
        this.open = true;
        this.title = "修改文件";
      });

    },

    /** 删除按钮操作 */
    createBuyPlan(row) {
      const idList = row.id ? [row.id] : this.ids
      let formatDates = this.formatDates(new Date());
      this.buyPlanVisibleForm.planName = "新建采购-" +
          formatDates.replaceAll(" ", "").replaceAll("-", "").replaceAll(":", "")
      this.buyPlanVisibleForm.buyGoodsPlanList = this.jcxGoodsWaringNameList.filter(t => idList.includes(t.id));
      // this.buyPlanVisibleForm.buyGoodsPlanList.forEach(t => t.goodsBuyCount = 19)
      this.buyPlanVisible = true
      this.totalPrice();
    }
    ,
    submitBuyPlanForm() {
      // this.buyPlanVisible = false
      console.info("buyGoodsPlanList: ", JSON.stringify(this.buyPlanVisibleForm))
      var errorMsg = this.buyPlanVisibleForm.buyGoodsPlanList.filter(
          t => !t.hasOwnProperty("goodsBuyCount") || t.goodsBuyCount === '').map(
          t => t.goodsName).join(",");
      if (errorMsg.trim() !== "") {
        this.$modal.msgError("请填写购买数量：" + errorMsg)
        return
      }
      return saveBuyPlan(this.buyPlanVisibleForm).then(()=>this.buyPlanVisible=false);
    },
    batchUpdateBuyCount() {
      this.buyPlanVisibleForm.buyGoodsPlanList.forEach(t => {
        this.$set(t, "goodsBuyCount", this.buyPlanVisibleForm.batchCount)
      })
      this.totalPrice();
    },
    updateBuyCount(row, val) {
      console.info("row: ", row, "val", val)
      row.goodsBuyCount = val;
      this.totalPrice();
    },
    totalPrice() {
      let totalPrice = 0
      let salesPriceTotal = 0
      let goodsGrossProfitTotal = 0
      let goodsNetProfitTotal = 0
      this.buyPlanVisibleForm.buyGoodsPlanList.forEach(t => {
        totalPrice += this.getInt(t.goodsBuyCount) * t.costPrice
        salesPriceTotal += this.getInt(t.goodsBuyCount) * t.salesPrice
        goodsNetProfitTotal += this.getInt(t.goodsBuyCount) * this.getInt(t.goodsNetProfit)
        goodsGrossProfitTotal += this.getInt(t.goodsBuyCount) * this.getInt(t.goodsGrossProfit)
      })
      this.buyPlanVisibleForm.totalPrice = totalPrice;
      this.buyPlanVisibleForm.salesPriceTotal = salesPriceTotal;
      this.buyPlanVisibleForm.goodsGrossProfitTotal = goodsGrossProfitTotal;
      this.buyPlanVisibleForm.goodsNetProfitTotal = goodsNetProfitTotal;
      this.$forceUpdate()
    },
    getInt(s) {
      try {
        var number = parseInt(s);
        return !isNaN(number) ? number : 0
      } catch (e) {
        return 0
      }
    },
    async goodsInventory() {
      request({
        url: '/jcx/goods/inventory/1/' + getTenantId(),
        method: 'get'
      }).then(res => {
        this.$message.success('库存盘点成功,已生成预警信息');
      }).then(() => this.getList());
    },
    deleteGoods(index,row){
      this.buyPlanVisibleForm.buyGoodsPlanList.splice(index,1);
      this.totalPrice()
    }
  }
};
</script>
