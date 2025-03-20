<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryForm" :inline="true" :model="queryParams" label-width="88px" size="small">
      <el-form-item label="计划名称" prop="jcxBuyPlan">
        <el-input v-model="queryParams.data.planName" clearable placeholder="请输入文件名称"
                  @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="状态" prop="planStatus">
        <el-select v-model="queryParams.data.planStatus" clearable placeholder="请选择状态">
          <el-option :value="undefined" label="全部"></el-option>
          <el-option :value="10" label="草稿"></el-option>
          <el-option :value="50" label="通过"></el-option>
          <el-option :value="99" label="驳回"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="生成订单" prop="isCreateOrder">
        <el-select v-model="queryParams.data.isCreateOrder" clearable placeholder="请选择">
          <el-option :value="undefined" label="全部"></el-option>
          <el-option :value="0" label="未生成"></el-option>
          <el-option :value="1" label="已生成"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" size="mini" type="primary" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button icon="el-icon-plus" plain size="mini" type="primary" @click="handleAdd">新增采购计划</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button icon="el-icon-plus" plain size="mini" type="primary" @click="handleAddOrder">生成采购单</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button :disabled="multiple" icon="el-icon-delete" plain size="mini" type="danger" @click="handleDelete">
          删除
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="jcxBuyPlanList" @selection-change="handleSelectionChange">

      <el-table-column align="center" label="全选" prop="id" type="selection" width="50"/>
      <el-table-column v-for="(item,index) in  tableHeaderList" :key="index" :label="item.showName" :prop="item.fieldName"
                       :width="item.width+'px'"
                       align="center">
        <template slot-scope="scope">
          <div v-if="Number(scope.row[item.fieldName])">{{ scope.row[item.fieldName] }}</div>
          <div v-else-if="scope.row[item.fieldName].length>=30">
            <el-popover
                :content="''+scope.row[item.fieldName]"
                placement="top-start"
                trigger="hover"
                width="200">
              <div slot="reference">{{ scope.row[item.fieldName].substring(0, 30) + '...' }}</div>
            </el-popover>
          </div>
          <div v-else>{{ scope.row[item.fieldName] }}</div>
        </template>

      </el-table-column>
      <el-table-column align="center" class-name="small-padding fixed-width" label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.planStatus==='10'" size="mini" type="info">草稿</el-tag>
          <el-tag v-else-if="scope.row.planStatus==='50'" size="mini" type="success">通过</el-tag>
          <el-tag v-else-if="scope.row.planStatus==='99'" size="mini" type="danger">驳回</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="生成订单">
        <template slot-scope="scope">
          <span v-if="scope.row.buyOrderId&&scope.row.buyOrderId.length>0">是
          <el-popover placement="top" width="190">
             <p>采购订单序号</p>
             <p>{{ scope.row.buyOrderId }}</p>
            <el-button slot="reference" icon="el-icon-info" size="mini" type="text"></el-button>
          </el-popover>
          </span>
          <span v-else>否</span>
        </template>
      </el-table-column>
      <el-table-column align="center" class-name="small-padding fixed-width" label="操作" fixed="right" width="140px">
        <template slot-scope="scope">
          <el-button icon="el-icon-edit" size="mini" type="text" @click="handleUpdate(scope.row)"></el-button>
          <el-button icon="el-icon-delete" size="mini" type="text" @click="handleDelete(scope.row)"></el-button>
          <el-popover v-if="scope.row.planStatus==='10'" placement="top" width="140">
            <p>修改计划状态？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="success" @click="updatePlanStatus(scope.row,'50')">通过</el-button>
              <el-button icon="" size="mini" type="danger" @click="updatePlanStatus(scope.row,'99')">驳回</el-button>
            </div>
            <el-button slot="reference" icon="el-icon-more" size="mini" style="padding-left: 10px" type="text"></el-button>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>

    <pagination
        v-show="total>0"
        :limit.sync="queryParams.pageSize"
        :page.sync="queryParams.pageNum"
        :total="total"
        @pagination="getList"
    />

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" append-to-body width="800px">
      <update-buy-plan :buy-plan-info="buyPlanFormData"/>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="upById">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="title" :visible.sync="planOrderOpen" append-to-body width="800px">
      <create-buy-order :buy-order="planOrder"/>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="savePlanOrder">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import UpdateBuyPlan from "@/views/system/jcx/buyPlan/UpdateBuyPlan.vue";
import {add, deleteByIdList, getById, queryPageList, updateById} from '@/api/common'
import {updateStatus} from "@/api/jcxPlan";
import {savePlanOrder} from "@/api/jcx/buyOrder";
import CreateBuyOrder from "@/views/system/jcx/buyPlan/CreateBuyOrder.vue";
import createBuyOrder from "@/views/system/jcx/buyPlan/CreateBuyOrder.vue";

export default {
  computed: {
    createBuyOrder() {
      return createBuyOrder
    }
  },
  components: {
    UpdateBuyPlan,
    CreateBuyOrder
  },
  name: "jcxBuyPlan",
  data() {
    return {
      planOrder: {
        id: "1",
        orderNo: "xx"
      },
      buyPlanFormData: {},
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      planOrderOpen: false,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: false,
      // 总条数
      total: 0,

      jcxBuyPlanList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        data: {
          planName: undefined,
          isCreateOrder: undefined
        }
      },
      // 表单参数
      form: {
        remark: "",
        jcxBuyPlan: "",
        brandCode: "",
        pwd: "",
        id: undefined,
        isUsed: true
      },
      // 表单校验
      rules: {

        jcxBuyPlan: [
          {required: true, message: "文件名称", trigger: "blur"}
        ],
        brandCode: [
          {required: true, message: "文件编码不能为空", trigger: "blur"},
          {min: 1, max: 20, message: "长度在 1 到 20 个字符", trigger: "blur"}
        ]
      },
      tableHeaderList: [{
        columnName: "id",
        showName: "序号"
      }, {
        columnName: "brandCode",
        showName: "文件编码"
      }, {
        columnName: "jcxBuyPlan",
        showName: "文件名称"
      }]
    };
  },
  created() {
    document["pagePath"] = "/jcxBuyPlan";
    this.getList();
  },
  methods: {
    /** 查询公告列表 */
    getList() {
      // this.loading = true;
      queryPageList(this.queryParams).then(response => {
        response = response.data
        this.tableHeaderList = response.headerList
        this.tableHeaderList.splice(2, 0, {fieldName: "goodsName", showName: "商品名称", width: 150})
        this.jcxBuyPlanList = response.dataList;
        this.jcxBuyPlanList.forEach(t => {
          // t.costPriceTotal = t.costPriceTotal/100.0 ;
          // t.goodsGrossProfitTotal = t.goodsGrossProfitTotal / 100.0;
          // t.goodsNetProfitTotal = t.goodsNetProfitTotal / 100.0;
          // t.salesPriceTotal = t.salesPriceTotal / 100.0;
          t.goodsName = t.jcxBuyPlanItemDtoList.map(t => t.goodsName).join(",")
        })
        this.total = parseInt(response.total);
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.planOrderOpen = false;
      this.reset();  this.form.id=undefined;
    },
    // 表单重置
    reset() {
      this.form = {
        remark: "",
        brandCode: "",
        id: undefined,
        jcxBuyPlan: undefined,
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
    handleAddOrder() {
      if (this.ids.length == 0) {
        this.$message.error("请选择采购计划")
        return;
      }
      let filter = this.jcxBuyPlanList.filter(t => this.ids.includes(t.id));
      var s = filter.filter(t => t.planStatus !== "50").map(t => t.planName).join(",");
      if (s.length > 0) {
        this.$message.error("采购计划状态为未审核的采购计划不能添加采购订单，请先审核采购计划，采购计划名称：" + s);
        return;
      }
      this.title = "添加采购订单"
      this.planOrderOpen = true;
      this.planOrder.id = "aa-" + new Date().getTime();
      this.planOrder.orderNo = "采购订单-" + this.formatDates(new Date()).replaceAll("-", "").replaceAll(" ", "").replaceAll(":", "");

      let orderGoodsList = [];
      let orderGoodsListTmp = [];
      filter.forEach(t => orderGoodsListTmp.push(...t.jcxBuyPlanItemDtoList.filter(t => t.isTmp !== '1')));
      console.info("orderGoodsListTmp: ", orderGoodsListTmp)
      orderGoodsListTmp.forEach(t => {
        let at = orderGoodsList.filter(t2 => t2.goodsId === t.goodsId);
        if (at.length === 0) {
          orderGoodsList.push({...t});
        } else {
          at[0].goodsBuyCount = parseInt(at[0].goodsBuyCount) + parseInt(t.goodsBuyCount);
        }
      });
      this.planOrder.buyPlanIdList = this.ids
      let su = {
        goodsName: "总计",
        goodsBuyCount: 0,
        costPriceTotal: 0
      }
      orderGoodsList.forEach(t => {
        t.costPriceTotal = parseInt(t.costPrice) * parseInt(t.goodsBuyCount);
      });

      orderGoodsList.forEach(t => {
        su.costPriceTotal += parseInt(t.costPriceTotal);
        su.goodsBuyCount += parseInt(t.goodsBuyCount);
      });
      orderGoodsList.push(su)

      this.planOrder.orderGoodsList = orderGoodsList;

    },
    handleAdd() {
      this.reset();  this.form.id=undefined;
      this.open = true;
      this.title = "添加采购计划";
      let d = this.formatDates(new Date()).replaceAll("-", "").replaceAll(" ", "").replaceAll(":", "");
      this.buyPlanFormData = {
        planName: '新建采购-' + d,
        jcxBuyPlanItemDtoList: []
      }
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      // this.reset();  this.form.id=undefined;
      let req = {idList: [row.id], pageSize: 1, pageNum: 1};
      getById(req).then(response => {
        // console.info("response: ", response)
        this.buyPlanFormData = response.data.dataList[0]
        this.open = true;
        this.title = "修改采购计划";
      });

    },
    upById() {
      let d = {...this.buyPlanFormData}
      d.jcxBuyPlanItemDtoList = d.jcxBuyPlanItemDtoList.filter(t => t.isTmp !== '1')
      if (this.buyPlanFormData.id === undefined) {
        return add(d).then(response => {
          this.$modal.msgSuccess("新增成功");
          this.open = false;
          this.getList();
        });
      } else {
        return updateById(d).then(response => {
          this.$modal.msgSuccess("修改成功");
          this.open = false;
          this.getList();
        });
      }
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const idList = row.id ? [row.id] : this.ids
      this.$modal.confirm('是否确认删序号为 <span style="color:red">' + idList + '</span> 的数据项？', "删除提示").then(function () {
        let req = {
          idList: idList
        }
        return deleteByIdList(req);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      });
      document.getElementsByClassName("el-message-box")[0].style.width = "520px"
    },
    updatePlanStatus(row, status) {
      // console.info("updatePlanStatus: ",,status)
      return updateStatus({versionNum: row.versionNum, id: row.id, planStatus: status}).then(t => this.$message.success("操作成功")).then(() => this.getList());
    }, savePlanOrder() {
      console.info("savePlanOrder", this.planOrder)
      let d = {}
      d.buyPlanIdList = this.planOrder.buyPlanIdList
      d.orderNo = this.planOrder.orderNo
      d.orderRemark = this.planOrder.orderRemark
      savePlanOrder(d).then(t => this.cancel()).then(() => this.getList())
    }

  }
};
</script>
