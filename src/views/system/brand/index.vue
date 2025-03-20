<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryForm" :inline="true" :model="queryParams" label-width="88px" size="small">
      <el-form-item label="文件名称" prop="brandName">
        <el-input v-model="queryParams.brandName" clearable placeholder="请输入文件名称"
                  @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" size="mini" type="primary" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button icon="el-icon-plus" plain size="mini" type="primary" @click="handleAdd">新增</el-button>
      </el-col>
      <el-col :span="1.5" hidden="hidden">
        <el-button :disabled="single" icon="el-icon-edit" plain size="mini" type="success" @click="handleUpdate">修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button :disabled="multiple" icon="el-icon-delete" plain size="mini" type="danger" @click="handleDelete">
          删除
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="brandNameList" @selection-change="handleSelectionChange">

      <el-table-column align="center" label="全选" prop="id" type="selection" width="50"/>
      <el-table-column v-for="(item,index) in  tableHeaderList" :key="index" :label="item.showName" :prop="item.columnName"
                       align="center"/>
      <el-table-column align="center" label="在用" prop="isUsed" width="50">
        <template slot-scope="scope">
          <span v-if="scope.row.isUsed===true">是</span>
          <span v-else>否</span>
        </template>
      </el-table-column>
      <el-table-column align="center" class-name="small-padding fixed-width" label="操作" fixed="right" width="140px">
        <template slot-scope="scope">
          <el-button icon="el-icon-edit" size="mini" type="text" @click="handleUpdate(scope.row)"></el-button>
          <el-button icon="el-icon-delete" size="mini" type="text" @click="handleDelete(scope.row)"></el-button>
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
    <el-dialog :title="title" :visible.sync="open" append-to-body width="500px">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">


        <el-form-item label="文件编码" prop="brandCode">
          <el-input v-model="form.brandCode" placeholder="请输入文件编码"/>
        </el-form-item>
        <el-form-item label="文件名称" prop="brandName">
          <el-input v-model="form.brandName" placeholder="请输入登陆名"/>
        </el-form-item>
        <el-form-item label="状态" prop="inUsed">
          <el-select v-model="form.isUsed" filterable>
            <el-option :value="false" label="否"></el-option>
            <el-option :value="true" label="是"></el-option>
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
import {urlPrefix} from '@/api/brand'

import {add, deleteByIdList, getById, queryPageList, updateById} from '@/api/common'
// console.info("xxx: ",uc.urlPrefix)
export default {
  name: "brandName",
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

      brandNameList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        brandName: undefined,
        createBy: undefined,
        status: undefined
      },
      // 表单参数
      form: {
        remark: "",
        brandName: "",
        brandCode: "",
        pwd: "",
        id: undefined,
        isUsed: true
      },
      // 表单校验
      rules: {

        brandName: [
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
        columnName: "brandName",
        showName: "文件名称"
      }]
    };
  },
  created() {
    document["pagePath"] = "/brand";
    this.getList();
  },
  methods: {
    /** 查询公告列表 */
    getList() {
      // this.loading = true;
      queryPageList(this.queryParams).then(response => {
        response = response.data
        // this.tableHeaderList = response.dynamicsFieldList
        this.brandNameList = response.dataList;
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
        remark: "",
        brandCode: "",
        id: undefined,
        brandName: undefined,
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
      this.reset();  this.form.id=undefined;
      this.open = true;
      this.title = "添加品牌";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();  this.form.id=undefined;
      let req = {idList: [row.id], pageSize: 1, pageNum: 1};
      getById(req).then(response => {
        this.form = response.data.dataList[0]
        this.open = true;
        this.title = "修改品牌";
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
    }
  }
};
</script>
