<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryForm" :inline="true" :model="queryParams" label-width="88px" size="small">
      <el-form-item label="登陆账户名" prop="userName">
        <el-input v-model="queryParams.userName" clearable placeholder="请输入登陆账户名" @keyup.enter.native="handleQuery"/>
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
        <el-button :disabled="multiple" icon="el-icon-delete" plain size="mini" type="danger" @click="handleDelete"></el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="loginPhoneList" @selection-change="handleSelectionChange">
      <el-table-column align="center" label="全选" prop="id" type="selection" width="50px"/>
      <el-table-column v-for="(item,index) in  tableHeaderList" :key="index" :label="item.showName" :prop="item.columnName" align="center"/>
      <el-table-column align="center" class-name="small-padding fixed-width" label="操作">
        <template slot-scope="scope">
          <el-button icon="el-icon-edit" size="mini" type="text" @click="handleUpdate(scope.row)"></el-button>
          <el-button icon="el-icon-delete" size="mini" type="text" @click="handleDelete(scope.row)"></el-button>
          <el-button icon="el-icon-refresh" size="mini" type="text" @click="handleResetPwd(scope.row)"></el-button>
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
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="姓名" prop="userName">
          <el-input v-model="form.userName" placeholder="请输入登陆名"/>
        </el-form-item>
        <el-form-item label="手机号" prop="loginPhone">
          <el-input v-model="form.loginPhone" placeholder="请输入登陆名"/>
        </el-form-item>
        <el-form-item label="密码" prop="pwd">
          <el-input v-model="form.pwd" placeholder="请输入密码" type="password"/>
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
import {addAccount, getById, queryPageList, removeAccount, resetPwd, updateById} from '@/api/account/loginAccount'
import md5 from "js-md5";

export default {
  name: "loginPhone",

  data() {

    const eqPwd = (rule, value, callback) => {
      if (this.form.pwd !== this.form.confirmPwd) {
        callback(new Error("两次输入的密码不一致"));
      } else {
        callback();
      }
    };
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

      loginPhoneList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        data: {
          loginPhone: undefined,
          createBy: undefined,
          status: undefined
        }
      },
      // 表单参数
      form: {
        remark: "",
        loginPhone: "",
        pwd: "",
        id: undefined
      },
      // 表单校验
      rules: {
        userName: [
          {required: true, message: "姓名", trigger: "blur"}
        ], loginPhone: [
          {required: true, message: "登录手机号不能为空", trigger: "blur"}
        ],
        pwd: [
          {required: true, message: "密码不能为空", trigger: "blur"},
          {min: 1, max: 20, message: "长度在 1 到 120 个字符", trigger: "blur"}
        ]
      },
      tableHeaderList: [{
        showName: "序号",
        columnName: "id"
      }, {
        showName: "姓名",
        columnName: "userName"
      }, {
        showName: "登录手机号",
        columnName: "loginPhone"
      }, {
        showName: "创建时间",
        columnName: "createTime"
      }, {
        showName: "修改时间",
        columnName: "updateTime"
      }]
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询公告列表 */
    getList() {
      // this.loading = true;
      const data = {...this.queryParams}
      data.data.userName = this.queryParams.userName;
      queryPageList(data).then(response => {
        response = response.data
        // this.tableHeaderList = response.dynamicsFieldList
        this.loginPhoneList = response.dataList;
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
        loginPhone: "",
        pwd: "",
        id: undefined,
        confirmPwd: undefined
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
      this.title = "添加用户";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();

      let req = {idList: [row.id], pageSize: 1, pageNum: 1};
      getById(req).then(response => {
        this.form = response.data.dataList[0]
        this.form.pwd = "";
        this.form.confirmPwd = ""
        this.open = true;
        this.title = "修改用户";
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
              // this.getList();
            });
          } else {
            var data = {...this.form};
            data.pwd = md5(data.pwd).toUpperCase();
            addAccount(data).then(response => {
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
      this.$modal.confirm('是否确认删除登陆账户序号为 <span style="color:red">' + idList + '</span> 的数据项？', "删除提示").then(function () {
        let req = {
          idList: idList
        }
        return removeAccount(req);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      });
      document.getElementsByClassName("el-message-box")[0].style.width = "520px"
    },
    handleResetPwd(row) {
      let _this = this;
      this.$modal.confirm('是否确认重置登陆账户序号为 <span style="color:red">' + row.loginPhone + '</span> 的密码？', "重置密码").then(function () {
        resetPwd({id: row.id}).then(res => {
          _this.$modal.alert("您的密码为：<span style=\"color:red\">" + res.data.newPwd + "</span> 仅提示一次，请妥善保存", "密码提示")
        });
      });
    }
  }
};
</script>
