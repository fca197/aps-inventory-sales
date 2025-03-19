<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryForm" :inline="true" :model="queryParams" label-width="88px" size="small">
      <el-form-item label="工厂名称" prop="factoryName">
        <el-input v-model="queryParams.factoryName" clearable placeholder="请输入工厂名称"
                  @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" size="mini" type="primary" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button icon="el-icon-plus" plain size="mini" type="primary" @click="handleAdd"></el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button :disabled="multiple" icon="el-icon-delete" plain size="mini" type="danger" @click="handleDelete">
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="factoryNameList" @selection-change="handleSelectionChange">

      <el-table-column align="center" label="全选" prop="id" type="selection" width="50"/>
      <el-table-column v-for="(item,index) in  tableHeaderList" :key="index" :label="item.showName" :prop="item.columnName"
                       align="center"/>
      <el-table-column align="center" label="状态" prop="factoryStatus">
        <template slot-scope="scope">
          <el-switch :value="scope.row.factoryStatus"
                     active-value="ENABLED"
                     inactive-value="DISABLED"
                     @change="factoryStatusChange(scope.row,$event)"
          />
        </template>
      </el-table-column>
      <el-table-column align="center" class-name="small-padding fixed-width" label="操作" fixed="right" width="140px">
        <template slot-scope="scope">
          <el-button icon="el-icon-edit" size="mini" type="text" @click="handleUpdate(scope.row)"></el-button>
          <el-button icon="el-icon-delete" size="mini" type="text" @click="handleDelete(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :limit.sync="queryParams.pageSize" :page.sync="queryParams.pageNum" :total="total"
                @pagination="getList"
    />

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" append-to-body width="500px">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">

        <el-form-item label="工厂编码" prop="factoryCode">
          <el-input v-model="form.factoryCode" placeholder="请输入工厂编码"/>
        </el-form-item>
        <el-form-item label="工厂名称" prop="factoryName">
          <el-input v-model="form.factoryName" placeholder="请输入登陆名"/>
        </el-form-item>
        <el-form-item label="工厂状态" prop="factoryName">
          <el-select v-model="form.factoryStatus" filterable placeholder="请选择">
            <el-option
                v-for="item in statusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                selected="item.selected"
            ></el-option>
          </el-select>
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


import { add, deleteByIdList,  getById, insetOrUpdate,deleteList, queryPageList, updateById, updateStatus } from '@/api/common'
// console.info("xxx: ",uc.urlPrefix)
export default {
  data() {

    return {
      statusOptions: [
        {label: "启用", value: "ENABLED", selected: "selected"},
        {label: "禁用", value: "DISABLED"}
      ],
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

      factoryNameList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,

        factoryName: undefined,
        createBy: undefined,
        status: undefined
      },
      // 表单参数
      form: {
        remark: "",
        factoryName: "",
        pwd: "",
        id: undefined,
        confirmPwd: undefined
      },
      // 表单校验
      rules: {
        factoryName :[{required: true, message: "不能为空", trigger: "blur"},{ min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }],
        factoryCode :[{required: true, message: "不能为空", trigger: "blur"},{ min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }],
        factoryStatus :[{required: true, message: "不能为空", trigger: "blur"}],
      },
      tableHeaderList: [{
        columnName: "id",
        showName: "序号"
      }, {
        columnName: "factoryCode",
        showName: "工厂编码"
      }, {
        columnName: "factoryName",
        showName: "工厂名称"
      }]
    };
  },
  created() {
    document["pagePath"] = "/factory";
    // process.env.pagePath = "/factory"
    this.getList();
  },
  methods: {
    /** 查询公告列表 */
    getList() {
      // this.loading = true;
      queryPageList(this.queryParams).then(response => {
        response = response.data
        // this.tableHeaderList = response.dynamicsFieldList
        this.factoryNameList = response.dataList;
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
        factoryCode: "",
        id: undefined,
        factoryName: undefined
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
      this.single = selection.length != 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加工厂";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();

      let req = {idList: [row.id], pageSize: 1, pageNum: 1};
      getById(req).then(response => {
        this.form = response.data.dataList[0]
        this.open = true;
        this.title = "修改工厂";
      });

    },
    /** 提交按钮 */
    submitForm: function () {
      insetOrUpdate(this);
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      deleteList(row,this.ids,this.getList())
    },
    factoryStatusChange(row, val) {

      this.$confirm(`是否确认${val === 'DISABLED' ? '禁用' : '启用'}工厂？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async (va3) => {
        updateStatus({id: row.id, status: val}).then(response => {
          row.factoryStatus = val;
          this.$modal.msgSuccess("修改成功");
          this.open = false;
          this.getList();
        });
      }).catch((status) => {
        row.factoryStatus = val === "DISABLED" ? "DISABLED" : "ENABLED";
      });

    }
  }
};
</script>
