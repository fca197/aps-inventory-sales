<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="88px">
      <el-form-item label="工厂" prop="factoryList">
        <el-select v-model="queryParams.data.factoryId" placeholder="请选择工厂" clearable>
          <el-option v-for="item in factoryList" :key="item.id" :label="item.factoryName" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="零件名称" prop="brandName">
        <el-input v-model="queryParams.data.bomName" placeholder="请输入零件名称" clearable @keyup.enter.native="handleQuery"/>
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
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"></el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="brandNameList" @selection-change="handleSelectionChange">

      <el-table-column label="全选" type="selection" align="center" prop="id" width="50"/>

      <el-table-column v-for="(item,index) in  tableHeaderList" :key="index" align="center" :width="item.width" :prop="item.fieldName" :label="item.showName"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right" width="240px">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-setting" @click="handleUpdateContent(scope.row)">约束</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
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
    <el-dialog :title="title" :visible.sync="openContent" width="1000px" append-to-body>
      <el-form>
        <create :row-constraint-list="constraintList" :key="indexCreate" :is-child="false" :constrained-field-list="constrainedFieldList"></create>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFormContent">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="编号" prop="constraintsNo">
          <el-input v-model="form.constraintsNo" placeholder="请输入约束编号" clearable/>
        </el-form-item>
        <el-form-item label="名称" prop="constraintsName">
          <el-input v-model="form.constraintsName" placeholder="请输入约束名称" clearable/>
        </el-form-item>
        <el-form-item label="备注" prop="constraintsRemark">
          <el-input v-model="form.constraintsRemark" placeholder="请输入约束备注" clearable/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Create from "@/views/system/aps/make_capacity/constraint/Create.vue";
import {add, deleteByIdList, getById, queryPageList, updateById} from '@/api/common'
import request from "@/utils/request"; // console.info("xxx: ",uc.urlPrefix)
// console.info("xxx: ",uc.urlPrefix)
export default {
  name: "tenantName",
  components: {Create},
  comments: {
    Create
  },
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
      // 总条数
      total: 0,
      indexCreate: 0,
      constraintList: [],
      constrainedFieldList: [],
      brandNameList: [],
      goodsList: [],
      workStationList: [],
      factoryList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      openContent: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        data: {}
      },
      // 表单参数
      form: {
        goodsId: undefined,
        factoryId: undefined,
        goodsRemark: "",
        remark: "",
        brandName: "",
        pwd: "",
        id: undefined,
        confirmPwd: undefined
      },
      // 表单校验
      rules: {},
      tableHeaderList: []
    };
  },
  created() {
    document["pagePath"] = "/apsSchedulingConstraints";
    // process.env.pagePath = "/tenant"
    this.getList();
   this. loadConstrainedFieldList();
  },
  methods: {
    /** 查询公告列表 */
    getList() {
      this.loading = true;
      queryPageList(this.queryParams).then(response => {
        response = response.data
        this.tableHeaderList = response.headerList
        this.brandNameList = response.dataList;
        this.total = parseInt(response.total);
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.openContent = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        remark: "",
        tenantCode: "",
        id: undefined,
        tenantName: undefined
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
      this.title = "添加约束";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      let req = {idList: [row.id], pageSize: 1, pageNum: 1};
      getById(req).then(response => {
        this.form = response.data.dataList[0]
        this.open = true;
        this.title = "修改约束";
      });

    },
    /** 提交按钮 */
    submitFormContent: function () {
      var t = JSON.stringify(this.constraintList);
      console.info("constraintList", t)
      this.form.constraintsContext = t
      updateById(this.form).then(response => {
        this.$modal.msgSuccess("修改成功");
        this.cancel();
        this.getList();
      });
    },
    submitForm: function () {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id !== undefined) {
            updateById(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            add(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
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

    handleUpdateContent(data) {
      this.title = "修改约束"

      this.form.id = data.id
      // console.info("data.constraintsContext", data.constraintsContext)
      if (data.constraintsContext === null || data.constraintsContext === "") {
       let  constObj={
             "filterList": [{
               "filterFieldType": "",
               "fieldName": "",
               "operator": "",
               "valueList": []
             }],
             children: [],
             orderBy: []
           };
        this.constraintList = [constObj]
      }else {
        this.constraintList = JSON.parse(data.constraintsContext)
      }
      this.indexCreate++;
      this.openContent = true;

    },
    loadConstrainedFieldList() {
      return request({
        url: "/apsSchedulingConstraints/getUseField",
        method: "get"
      }).then(res => {
        this.constrainedFieldList=res.data.values
        // console.info(JSON.stringify(res))

      })
    },
  }
};
</script>
