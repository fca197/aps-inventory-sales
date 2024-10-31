<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryForm" :inline="true" :model="queryParams" label-width="88px" size="small">
      <el-form-item label="文件名称" prop="jcxGoodsWaringName">
        <el-input v-model="queryParams.jcxGoodsWaringName" clearable placeholder="请输入文件名称"
                  @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" size="mini" type="primary" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button icon="el-icon-plus" plain size="mini" type="primary" @click="goodsInventory">新增预警</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button plain size="mini" type="primary" @click="createBuyPlan">
          <svg-icon icon-class="buy-car"></svg-icon>
          采购计划
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="jcxGoodsWaringNameList" @selection-change="handleSelectionChange">

      <el-table-column align="center" label="全选" prop="id" type="selection" width="50"/>
      <el-table-column v-for="(item,index) in  tableHeaderList" :key="index" :label="item.showName" :prop="item.fieldName"
                       align="center"/>
      <!--      <el-table-column label="完成" align="center" prop="isDone" width="50">-->
      <!--        <template slot-scope="scope">-->
      <!--          <span v-if="scope.row.isDone">是</span>-->
      <!--          <span v-else>否</span>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
    </el-table>

    <pagination
        v-show="total>0"
        :limit.sync="queryParams.pageSize"
        :page.sync="queryParams.pageNum"
        :total="total"
        @pagination="getList"
    />

    <el-dialog :visible.sync="buyPlanVisible" append-to-body title="采购计划" width="900px">
      <el-form ref="form" :model="buyPlanVisibleForm" :rules="rules" label-width="100px">
        <el-form-item label="计划名称" prop="planName">
          <el-col :span="7">
            <el-input v-model="buyPlanVisibleForm.planName" placeholder="请输入计划名称" width="100px"/>
          </el-col>
          <el-col :offset="8" :span="3">
            <el-input v-model="buyPlanVisibleForm.batchCount" placeholder="" type="number" width="100px"/>
          </el-col>
          <el-col :span="6">
            <el-button size="medium" type="warning" @click="batchUpdateBuyCount">
              <svg-icon icon-class="brush"/>
            </el-button>
          </el-col>
        </el-form-item>
      </el-form>
      <el-table :data="buyPlanVisibleForm.jcxBuyPlanItemDtoList">
        <el-table-column align="center" label="商品名称" prop="goodsName"/>
        <el-table-column align="center" label="成本价" prop="costPrice"/>
        <el-table-column align="center" label="销售价" prop="salesPrice"/>
        <el-table-column align="center" label="剩余库存" prop="goodsInventoryCount"/>
        <el-table-column align="center" label="毛利" prop="goodsGrossProfit"/>
        <el-table-column align="center" label="净利" prop="goodsNetProfit"/>
        <el-table-column align="center" label="购买数" width="100px">
          <template slot-scope="scope">
            <el-input v-model="scope.row.goodsBuyCount" :min="1" type="number" @change="value => updateBuyCount(scope.row,value)"/>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="100px">
          <template slot-scope="scope">
            <el-button icon="el-icon-delete" plain size="mini" type="danger" @click="deleteGoods(scope.$index,scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-divider><i class="el-icon-plus"></i></el-divider>
      <div style="text-align: right;margin-top: 20px">
        <el-col :offset="14" :span="10"> 选择添加的商品:

          <el-select v-model="buyPlanVisibleFormGoodsId" :filter-method="value=>{changeGoods(value)}" filterable placeholder="请选择商品" width="100%" @change="addGoods">
            <el-option v-for="(it,index) in jcxGoodsWaringToSelectList" :key="index" :label="it.goodsName" :value="it.id"></el-option>
          </el-select>
        </el-col>
      </div>
      <div class="header-title">
        <el-col :span="9">款项预览<span style="color: #aaa ;font-size: 13px">(成本*数量)</span></el-col>
      </div>
      <table cellpadding="0" cellspacing="0" class="default-table">
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

import {getById, queryPageList} from '@/api/common'
import request from "@/utils/request";
import {getTenantId} from "@/utils/auth";
import {saveBuyPlan} from "@/api/buyPlan";
import {getFoodsList} from "@/api/jcx/goods";
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
        jcxBuyPlanItemDtoList: []
      },
      jcxGoodsWaringNameList: [],
      jcxGoodsWaringToSelectList: [],
      buyPlanVisibleFormGoodsId: undefined,
      buyPlanVisibleFormGoodsInfo: undefined,
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
      }],

    }
  },
  created() {
    document["pagePath"] = "/jcxGoodsWarning";
    this.getList();
  },
  methods: {

    changeGoods(val) {
      return getFoodsList({pageNum: 1, pageSize: 10, data: {goodsName: val}})
      .then(response => {
        this.jcxGoodsWaringToSelectList = response.dataList
      })

    },
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
      this.title = "添加";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      let req = {idList: [row.id], pageSize: 1, pageNum: 1};
      getById(req).then(response => {
        this.form = response.data.dataList[0]
        this.open = true;
        this.title = "修改";
      });

    },

    /** 删除按钮操作 */
    createBuyPlan(row) {
      const idList = row.id ? [row.id] : this.ids
      let formatDates = this.formatDates(new Date());
      this.buyPlanVisibleForm.planName = "新建采购-" +
          formatDates.replaceAll(" ", "").replaceAll("-", "").replaceAll(":", "")
      this.buyPlanVisibleForm.jcxBuyPlanItemDtoList = this.jcxGoodsWaringNameList.filter(t => idList.includes(t.id));
      // this.buyPlanVisibleForm.jcxBuyPlanItemDtoList.forEach(t => t.goodsBuyCount = 19)
      this.buyPlanVisible = true
      this.totalPrice();
      this.changeGoods('');
    }
    ,
    submitBuyPlanForm() {
      // this.buyPlanVisible = false
      console.info("jcxBuyPlanItemDtoList: ", JSON.stringify(this.buyPlanVisibleForm))
      if (this.buyPlanVisibleForm.jcxBuyPlanItemDtoList.length === 0) {
        this.$modal.msgError("请选择商品")
        return
      }
      var errorMsg = this.buyPlanVisibleForm.jcxBuyPlanItemDtoList.filter(
          t => !t.hasOwnProperty("goodsBuyCount") || t.goodsBuyCount === '').map(
          t => t.goodsName).join(",");
      if (errorMsg.trim() !== "") {
        this.$modal.msgError("请填写购买数量：" + errorMsg)
        return
      }
      return saveBuyPlan(this.buyPlanVisibleForm).then(() => this.buyPlanVisible = false);
    },
    batchUpdateBuyCount() {
      this.buyPlanVisibleForm.jcxBuyPlanItemDtoList.forEach(t => {
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
      this.buyPlanVisibleForm.jcxBuyPlanItemDtoList.forEach(t => {
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
    deleteGoods(index, row) {
      this.buyPlanVisibleForm.jcxBuyPlanItemDtoList.splice(index, 1);
      this.totalPrice()
    },
    addGoods() {
      this.buyPlanVisibleFormGoodsInfo = this.jcxGoodsWaringToSelectList.filter(it => it.id == this.buyPlanVisibleFormGoodsId)[0]
      this.buyPlanVisibleFormGoodsInfo.goodsId = this.buyPlanVisibleFormGoodsInfo.id
      let da = {
        goodsBuyCount: 1,
      }
      Object.assign(da, this.buyPlanVisibleFormGoodsInfo);
      this.buyPlanVisibleForm.jcxBuyPlanItemDtoList.push(da)
    }
  }
};
</script>
