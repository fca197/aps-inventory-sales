<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="88px">

      <el-form-item label="订单编号" prop="orderNo">
        <el-input v-model="queryParams.data.orderNo" placeholder="请输入订单编号" clearable
                  @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="订单日期" prop="orderTime">
        <el-date-picker clearable size="small" v-model="queryParams.data.orderTime"
                        type="daterange" value-format="yyyy-MM-dd" range-separator="-"
                        start-placeholder="开始日期" end-placeholder="结束日期"
                        @change="handleQuery"
        />
      </el-form-item>
      <el-form-item label="订单状态" prop="orderStatus">
        <el-select v-model="queryParams.data.orderStatus" placeholder="请选择订单状态" clearable @change="handleQuery">
          <el-option v-for="( value,key,index) in orderStatusOptionsMap" :key="index" :label="value" :value="key">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"></el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"/>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <el-table v-loading="loading" :data="goodsNameList" @selection-change="handleSelectionChange">
      <el-table-column label="全选" type="selection" align="center" prop="id" width="50"/>
      <el-table-column v-for="(item,index) in  tableHeaderList" :key="index" align="center" :prop="item.fieldName" :width="item.width"
                       :label="item.showName">
        <template slot-scope="scope">
          <image-show width="100" height="50" :id="scope.row[item.fieldName]" v-if="item.fieldName=='goodsImg'"/>
          <span v-else>{{ scope.row[item.fieldName] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <!--          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"></el-button>-->
          <!--          <el-button size="mini" type="text" icon="el-icon-setting" hidden="hidden" @click="handleUpdate(scope.row)"></el-button>-->
          <el-button size="mini" type="text" icon="el-icon-refresh-left" @click="handleUpdate(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
    />

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" v-if="open" :visible.sync="open" width="800px" append-to-body>
      <create-order :order-status-options-map="orderStatusOptionsMap" :open="open" @cancel="cancel" :success-fun="submitFormSuccess"></create-order>
    </el-dialog>
    <el-dialog :title="title" v-if="open" :visible.sync="open" width="800px" append-to-body>
      <create-order :order-status-options-map="orderStatusOptionsMap" :open="open" @cancel="cancel" :success-fun="submitFormSuccess"></create-order>
    </el-dialog>
    <el-dialog :title="title"  v-if="settingOpenIdElement"  :visible.sync="settingOpen" width="1500px" append-to-body>
      <setting-order ref="settingOrderChild" :setting-open-id="settingOpenId" :setting-open-info="settingOpenInfo" @close="settingOpen=false"></setting-order>
    </el-dialog>
  </div>
</template>

<script>
import ImageShow from "@/components/ImageShow/index.vue";
import {deleteByIdList, queryPageList} from '@/api/common'
import linCode from "@/views/system/jcx/goods/linCode.vue";
import CreateOrder from "@/views/system/jcx/order/CreateOrder.vue";
import {getOrderStatus} from "@/api/jcx/order";
import SettingOrder from "@/views/system/jcx/order/SettingOrder.vue";

export default {
  name: "goodsName",
  computed: {},
  components: {
    ImageShow, linCode, CreateOrder, SettingOrder
  },
  data() {

    return {

      orderStatusOptionsMap: {},
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
      // 总条数
      total: 0,

      goodsNameList: [],
      goodsLineCodeList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      settingOpen: false,
      settingOpenInfo: {},
      settingOpenId: undefined,
      settingOpenIdElement: undefined,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        data: {
          orderStatus: undefined,
          orderNo: undefined,
          orderTime: []
        }
      },
      // 表单参数
      form: {
        goodsBarCode: "",
        goodsImg: "",
        goodsQrCode: "",
        remark: "",
        goodsName: "",
        goodsCode: "",
        pwd: "",
        id: undefined,
        costPrice: 99.99,
        salesPrice: 99.99,
        goodsUnit: "",
        warningCount: 10,
        isUsed: true
      },
      // 表单校验
      rules: {},
      tableHeaderList: [{
        fieldName: "id",
        showName: "编号",
        width: 200
      }]
    };
  },
  created() {
    document["pagePath"] = "/jcx/order";
    getOrderStatus().then((res) => {
      this.orderStatusOptionsMap = res;
      this.getList();
    })
  },
  methods: {
    /** 查询公告列表 */
    getList() {
      // this.loading = true;
      return queryPageList(this.queryParams).then(response => {
        response = response.data
        this.tableHeaderList = response.headerList
        this.goodsNameList = response.dataList;
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
        data: {}
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
      this.title = "添加商品";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      // debugger
      this.title = "修改订单";
      this.settingOpen = true;
      this.settingOpenInfo=null
      this.settingOpenInfo = {id:1,orderNo:"002"};
      this.settingOpenInfo = row;
      this.settingOpenId=row.id
      this.settingOpenIdElement=new Date().getTime()+"";
      // this.$forceUpdate();
      // this.$refs.settingOrderChild.loadOrderInfo(this.settingOpenId)
    },
    /** 提交按钮 */
    submitFormSuccess: function () {
      this.open = false;
      this.getList();
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const idList = row.id ? [row.id] : this.ids
      this.$modal.confirm('是否确认删编号为 <span style="color:red">' + idList + '</span> 的数据项？', "删除提示").then(function () {
        let req = {
          idList: idList
        }
        return deleteByIdList(req);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      });
      document.getElementsByClassName("el-message-box")[0].style.width = "520px"
    }
  }
}
</script>
