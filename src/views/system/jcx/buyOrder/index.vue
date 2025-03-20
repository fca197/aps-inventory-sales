<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryForm" :inline="true" :model="queryParams" label-width="100px" size="small">
      <el-form-item label="采购订单序号" prop="jcxBuyOrder">
        <el-input v-model="queryParams.data.id" clearable placeholder="请输入订单序号" @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="订单编号" prop="jcxBuyOrder">
        <el-input v-model="queryParams.data.orderNo" clearable placeholder="请输入订单编号" @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="状态" prop="orderStatus">
        <el-select v-model="queryParams.data.orderStatus" clearable placeholder="请选择状态">
          <el-option :value="undefined" label="全部"></el-option>
          <el-option :value="10" label="草稿"></el-option>
          <el-option :value="50" label="通过"></el-option>
          <el-option :value="99" label="驳回"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" size="mini" type="primary" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button :disabled="multiple" icon="el-icon-delete" plain size="mini" type="danger" @click="handleDelete">
          删除
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="jcxBuyOrderList" @selection-change="handleSelectionChange">

      <el-table-column align="center" label="全选" prop="id" type="selection" width="50"/>
      <el-table-column v-for="(item,index) in  tableHeaderList" :key="index" :label="item.showName" :prop="item.fieldName"
                       :width="item.width+'px'"
                       align="center">
      </el-table-column>
      <el-table-column align="center" class-name="small-padding fixed-width" label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.orderStatus===10" size="mini" type="info">草稿</el-tag>
          <el-tag v-else-if="scope.row.orderStatus===50" size="mini" type="success">通过</el-tag>
          <el-tag v-else-if="scope.row.orderStatus===99" size="mini" type="danger">驳回</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" class-name="small-padding fixed-width" label="操作" fixed="right" width="140px">
        <template slot-scope="scope">
          <el-button icon="el-icon-s-data" size="mini" type="text" @click="handleData(scope.row)"></el-button>

          <el-button v-if="scope.row.orderStatus!==50" icon="el-icon-edit" size="mini" type="text" @click="handleUpdate(scope.row)"></el-button>
          <!--          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"></el-button>-->
          <el-popover v-if="scope.row.orderStatus===50" placement="top" width="140">
            <p>通知供应商发货</p>
            <div style="text-align: right; margin: 0">
              <el-popover align="center" placement="top" trigger="hover" width="90px">
                <div style="text-align: right; margin: 0">
                  点击
                  <el-button size="mini" type="success" @click="noIml(scope.row,'50')">邮件预览</el-button>
                </div>
                <el-button slot="reference" size="mini" type="warning" @click="noIml(scope.row,'50')">邮件</el-button>
              </el-popover>
              <span style="padding-left: 10px"></span>
              <el-popover placement="top" trigger="hover">
                <div style="text-align: right; margin: 0">
                  点击
                  <el-button size="mini" type="success" @click="noIml(scope.row,'50')">短信预览</el-button>
                </div>
                <el-button slot="reference" size="mini" type="warning" @click="noIml(scope.row,'50')">短信</el-button>
              </el-popover>
            </div>
            <el-button slot="reference" size="mini" style="padding-left: 15px" type="text">
              <svg-icon icon-class="send"></svg-icon>
            </el-button>
          </el-popover>
          <el-popover v-if="scope.row.orderStatus===10" placement="top" width="140">
            <p>修改订单状态？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="success" @click="updatePlanStatus(scope.row,'50')">通过</el-button>
              <el-button icon="" size="mini" type="danger" @click="updatePlanStatus(scope.row,'99')">驳回</el-button>
            </div>
            <el-button slot="reference" icon="el-icon-more" size="mini" style="padding-left: 15px" type="text"></el-button>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :limit.sync="queryParams.pageSize" :page.sync="queryParams.pageNum" :total="total" @pagination="getList"/>

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" append-to-body width="800px">
      <update-buy-plan :buy-plan-info="buyPlanFormData"/>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="upById">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="title" :visible.sync="buyOrderItemDtoListOpen" append-to-body width="1000px">
      <el-table :data="buyOrderItemDtoList">
        <el-table-column align="center" label="序号" type="index"/>
        <el-table-column label="产品名称" prop="goodsName"/>
        <el-table-column label="价格" prop="goodsCostPrice"/>
        <el-table-column label="购买数量" prop="goodsBuyCount"/>
        <el-table-column label="总价" prop="goodsCostPriceTotal"/>
        <el-table-column label="规格" prop="goodsUnit"/>
        <el-table-column label="供应商" prop="supplierName"/>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="buyOrderItemDtoListOpen=false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {urlPrefix} from '@/api/brand'
import UpdateBuyPlan from "@/views/system/jcx/buyPlan/UpdateBuyPlan.vue";
import {add, deleteByIdList, getById, queryPageList, updateById, updateStatus} from '@/api/common'
// console.info("xxx: ",uc.urlPrefix)
export default {
  components: {
    UpdateBuyPlan
  },
  name: "jcxBuyOrder",
  data() {
    return {
      buyOrderItemDtoList: [],
      buyPlanFormData: {},
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
      buyOrderItemDtoListOpen: false,
      // 总条数
      total: 0,

      jcxBuyOrderList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        data: {
          orderStatus: undefined,
          planName: undefined
        }
      },
      // 表单参数
      form: {
        remark: "",
        jcxBuyOrder: "",
        brandCode: "",
        pwd: "",
        id: undefined,
        isUsed: true
      },
      // 表单校验
      rules: {

        jcxBuyOrder: [
          {required: true, message: "文件名称", trigger: "blur"}
        ],
        brandCode: [
          {required: true, message: "文件编码不能为空", trigger: "blur"},
          {min: 1, max: 20, message: "长度在 1 到 20 个字符", trigger: "blur"}
        ]
      },
      tableHeaderList: []
    };
  },
  created() {
    document["pagePath"] = "/jcxBuyOrder";
    this.getList();
  },
  methods: {
    /** 查询公告列表 */
    getList() {
      // this.loading = true;
      queryPageList(this.queryParams).then(response => {
        response = response.data
        this.tableHeaderList = response.headerList
        this.jcxBuyOrderList = response.dataList;
        this.total = parseInt(response.total);
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();  this.form.id=undefined;
    },
    // 表单重置
    reset() {
      this.form = {
        data: {
          orderStatus: undefined,
          planName: undefined
        }
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
      d.jcxBuyOrderItemDtoList = d.jcxBuyOrderItemDtoList || []
      d.jcxBuyOrderItemDtoList = d.jcxBuyOrderItemDtoList.filter(t => t.isTmp !== '1')
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
      return updateStatus({versionNum: row.versionNum, id: row.id, orderStatus: status}).then(() => this.getList());
    },
    noIml() {
      this.$modal.msgError("暂未实现")
    },
    handleData(row) {
      this.buyOrderItemDtoList = row.buyOrderItemDtoList;
      this.buyOrderItemDtoListOpen = true;
    }
  }
};
</script>
