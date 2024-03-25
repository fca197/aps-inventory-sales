<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="88px">
      <el-form-item label="工厂名称" prop="factoryName">
        <el-input v-model="queryParams.factoryName" placeholder="请输入工厂名称" clearable
                  @keyup.enter.native="handleQuery"/>
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
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete">
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="factoryNameList" @selection-change="handleSelectionChange">

      <el-table-column label="全选" type="selection" align="center" prop="id" width="50"/>
      <el-table-column v-for="(item,index) in  tableHeaderList"  :key="index" align="center" :prop="item.columnName"
                       :label="item.showName"/>
      <el-table-column align="center" prop="factoryStatus" label="状态">
        <template slot-scope="scope">
          <el-switch :value="scope.row.factoryStatus"
                     active-value="ENABLED"
                     inactive-value="DISABLED"
                     @change="factoryStatusChange(scope.row,$event)"
                     />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"></el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
                @pagination="getList"
    />

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">

        <el-form-item label="工厂编码" prop="factoryCode">
          <el-input v-model="form.factoryCode" placeholder="请输入工厂编码"/>
        </el-form-item>
        <el-form-item label="工厂名称" prop="factoryName">
          <el-input v-model="form.factoryName" placeholder="请输入登陆名"/>
        </el-form-item>
        <el-form-item label="工厂状态" prop="factoryName">
          <el-select  filterable v-model="form.factoryStatus" placeholder="请选择">
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


import {add,updateStatus, deleteByIdList, getById, queryPageList, updateById} from '@/api/common'
// console.info("xxx: ",uc.urlPrefix)
export default {
  data() {

    return {
      statusOptions:[
        {label:"启用",value:"ENABLED" ,selected:"selected"},
        {label:"禁用",value:"DISABLED"}
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
        factoryName: [
          {required: true, message: "工厂名称", trigger: "blur"}
        ],
        factoryCode: [
          {required: true, message: "工厂编码不能为空", trigger: "blur"},
          {min: 1, max: 20, message: "长度在 1 到 20 个字符", trigger: "blur"}
        ]
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

      let req = {idList:[row.id], pageSize: 1, pageNum: 1};
      getById(req).then(response => {
        this.form = response.data.dataList[0]
        this.open = true;
        this.title = "修改工厂";
      });

    },
    /** 提交按钮 */
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
    factoryStatusChange(row,val){

      this.$confirm(`是否确认${val === 'DISABLED' ? '禁用' : '启用'}工厂？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then( async (va3)=>{
        updateStatus({id:row.id,status:val}).then(response => {
          row.factoryStatus=val;
          this.$modal.msgSuccess("修改成功");
          this.open = false;
          this.getList();
        });
      }).catch((status)=>{
                        row.factoryStatus=val==="DISABLED"?"DISABLED" :"ENABLED";
      });

    }
  }
};
</script>
