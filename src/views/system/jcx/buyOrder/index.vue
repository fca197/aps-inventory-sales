<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="100px">
      <el-form-item label="采购订单序号" prop="jcxBuyOrder">
        <el-input v-model="queryParams.data.id" placeholder="请输入订单序号" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="订单编号" prop="jcxBuyOrder">
        <el-input v-model="queryParams.data.orderNo" placeholder="请输入订单编号" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="状态" prop="orderStatus">
        <el-select v-model="queryParams.data.orderStatus" placeholder="请选择状态" clearable>
          <el-option :value="undefined" label="全部"></el-option>
          <el-option :value="10" label="草稿"></el-option>
          <el-option :value="50" label="通过"></el-option>
          <el-option :value="99" label="驳回"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd">新增采购计划</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd">生成采购单</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete">
          删除
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="jcxBuyOrderList" @selection-change="handleSelectionChange">

      <el-table-column label="全选" type="selection" align="center" prop="id" width="50"/>
      <el-table-column v-for="(item,index) in  tableHeaderList" :key="index" align="center" :prop="item.fieldName"
                       :width="item.width+'px'"
                       :label="item.showName">
      </el-table-column>
      <el-table-column label="状态" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.orderStatus===10" size="mini" type="info">草稿</el-tag>
          <el-tag v-else-if="scope.row.orderStatus===50" size="mini" type="success">通过</el-tag>
          <el-tag v-else-if="scope.row.orderStatus===99" size="mini" type="danger">驳回</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"></el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"></el-button>
          <el-popover placement="top" v-if="scope.row.orderStatus===50" width="140">
            <p>通知供应商</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="warning" @click="updatePlanStatus(scope.row,'50')">邮件</el-button>
              <el-button type="warning" size="mini" icon="" @click="updatePlanStatus(scope.row,'99')">短信</el-button>
            </div>
            <el-button  style="padding-left: 15px"  slot="reference" size="mini"  type="text" >
              <svg-icon icon-class="send" ></svg-icon>
            </el-button>
          </el-popover>
          <el-popover placement="top" v-if="scope.row.orderStatus===10" width="140">
            <p>修改订单状态？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="success" @click="updatePlanStatus(scope.row,'50')">通过</el-button>
              <el-button type="danger" size="mini" icon="" @click="updatePlanStatus(scope.row,'99')">驳回</el-button>
            </div>
            <el-button size="mini"  style="padding-left: 15px" slot="reference" type="text" icon="el-icon-more"></el-button>
          </el-popover>
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
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <update-buy-plan :buy-plan-info="buyPlanFormData"/>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="upById">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
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
      tableHeaderList: [ ]
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
      this.reset();
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
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加采购计划";
      let d = this.formatDates(new Date()).replaceAll("-", "").replaceAll(" ", "").replaceAll(":", "");
      this.buyPlanFormData = {
        planName: '新建采购-' + d,
        jcxBuyOrderItemDtoList: []
      }
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      // this.reset();
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
    }
  }
};
</script>
