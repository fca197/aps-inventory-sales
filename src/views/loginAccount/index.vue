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
      <el-table-column v-for="(item,index) in  tableHeaderList" :key="index" :label="item.showName" :prop="item.columnName" width="180px" align="center"/>
      <el-table-column align="center" class-name="small-padding fixed-width" label="操作" fixed="right" width="240px">
        <template slot-scope="scope">
          <el-button icon="el-icon-edit" size="mini" type="text" @click="handleUpdate(scope.row)"></el-button>
          <el-button icon="el-icon-delete" size="mini" type="text" @click="handleDelete(scope.row)"></el-button>
          <el-button icon="el-icon-setting" size="mini" type="text" @click="handleRole(scope.row)">角色</el-button>
          <el-button icon="el-icon-setting" size="mini" type="text" @click="handleDept(scope.row)">部门</el-button>
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
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="title" :visible.sync="deptOpen" append-to-body width="700px">

      <el-transfer style="width: 100%"
                   :titles="['可选', '已选']"
                   v-model="selectDeptList"
                   :data="deptList"
      >
      </el-transfer>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitDeptForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="title" :visible.sync="roleOpen" append-to-body width="700px">

      <el-tabs v-model="activeName" style="margin:  -30px 5%">
        <el-tab-pane label="角色设置" name="role">
          <el-transfer style="width: 100%"
                       :titles="['可选', '已选']"
                       v-model="selectRoleList"
                       :data="roleList"
          >
          </el-transfer>
        </el-tab-pane>
        <el-tab-pane label="角色组设置" name="roleGroup">
          <el-transfer
              :titles="['可选', '已选']"
              v-model="selectRoleGroupList"
              :data="roleGroupList"
          >
          </el-transfer>
        </el-tab-pane>

      </el-tabs>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitRoleForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addAccount, getById, queryPageList, removeAccount, resetPwd, updateById } from '@/api/account/loginAccount'
import md5 from 'js-md5'
import { post, queryUrlNoPageList } from '@/api/common'

export default {
  name: 'loginPhone',

  data() {

    const eqPwd = (rule, value, callback) => {
      if (this.form.pwd !== this.form.confirmPwd) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        callback()
      }
    }
    return {
      activeName: 'role',
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
      title: '',
      // 是否显示弹出层
      open: false,
      roleOpen: false,
      deptOpen: false,
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
        remark: '',
        loginPhone: '',
        pwd: '',
        id: undefined
      },
      // 表单校验
      rules: {
        userName: [
          { required: true, message: '姓名', trigger: 'blur' }
        ], loginPhone: [
          { required: true, message: '登录手机号不能为空', trigger: 'blur' }
        ],
        pwd: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 120 个字符', trigger: 'blur' }
        ]
      },
      tableHeaderList: [{
        showName: '序号',
        columnName: 'id'
      }, {
        showName: '姓名',
        columnName: 'userName'
      }, {
        showName: '登录手机号',
        columnName: 'loginPhone'
      }, {
        showName: '部门',
        columnName: 'deptName'
      }, {
        showName: '角色',
        columnName: 'baseRoleName'
      }, {
        showName: '角色组',
        columnName: 'baseRoleGroupName'
      }, {
        showName: '创建时间',
        columnName: 'createTime'
      },
        {
          showName: '修改时间',
          columnName: 'updateTime'
        }],
      roleList: [],
      selectRoleList: [],
      roleGroupList: [],
      selectRoleGroupList: [],
      deptList: [],
      selectDeptList: [],
      userId: undefined
    }
  },
  created() {
    queryUrlNoPageList('/baseDept').then(t => this.deptList = t.data.dataList.map(t => {
      t.key = t.id
      t.label = t.deptName
      return t
    }))
    queryUrlNoPageList('/baseRole').then(t => this.roleList = t.data.dataList.map(t => {
      t.key = t.id
      t.label = t.roleName
      return t
    }))
    queryUrlNoPageList('/baseRoleGroup').then(t => this.roleGroupList = t.data.dataList.map(t => {
      t.key = t.id
      t.label = t.roleGroupName

      return t
    }))
    this.getList()
  },
  methods: {
    /** 查询公告列表 */
    getList() {
      // this.loading = true;
      const data = { ...this.queryParams }
      data.data.userName = this.queryParams.userName
      queryPageList(data).then(response => {
        response = response.data
        // this.tableHeaderList = response.dynamicsFieldList
        this.loginPhoneList = response.records
        this.total = parseInt(response.total)
        this.loading = false
      })
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.roleOpen = false
      this.deptOpen = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        remark: '',
        loginPhone: '',
        pwd: '',
        id: undefined,
        confirmPwd: undefined
      }
      this.resetForm('form')
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      this.handleQuery()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length != 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加用户'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()

      let req = { idList: [row.id], pageSize: 1, pageNum: 1 }
      getById(req).then(response => {
        this.form = response.data.dataList[0]
        this.form.pwd = ''
        this.form.confirmPwd = ''
        this.open = true
        this.title = '修改用户'
      })

    },
    /** 提交按钮 */
    submitForm: function() {
      let _this=this;
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id !== undefined) {
            updateById(this.form).then(response => {
              this.$modal.msgSuccess('修改成功')
              this.open = false
              // this.getList();
            })
          } else {
            var data = { ...this.form }
            data.pwd = md5(data.pwd).toUpperCase()
            addAccount(data).then(response => {
              this.$modal.msgSuccess('新增成功')
              this.open = false
              _this.$modal.alert('您的密码为：<span style="color:red">' + response.data.newPwd + '</span> 仅提示一次，请妥善保存', '密码提示')
              this.getList()
            })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const idList = row.id ? [row.id] : this.ids
      this.$modal.confirm('是否确认删除登陆账户序号为 <span style="color:red">' + idList + '</span> 的数据项？', '删除提示').then(function() {
        let req = {
          idList: idList
        }
        return removeAccount(req)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess('删除成功')
      })
      document.getElementsByClassName('el-message-box')[0].style.width = '520px'
    },
    handleResetPwd(row) {
      let _this = this
      this.$modal.confirm('是否确认重置登陆账户序号为 <span style="color:red">' + row.loginPhone + '</span> 的密码？', '重置密码').then(function() {
        resetPwd({ id: row.id }).then(res => {
          _this.$modal.alert('您的密码为：<span style="color:red">' + res.data.newPwd + '</span> 仅提示一次，请妥善保存', '密码提示')
        })
      })
    },
    handleRole(row) {
      this.title = '修改角色'
      this.userId = row.id
      this.selectRoleGroupList = row.baseRoleGroupIds
      this.selectRoleList = row.baseRoleIds
      // console.log(this.roleGroupList, this.roleList)
      this.roleOpen = true
    },
    submitRoleForm() {
      post('/loginAccount/updateRole', { userId: this.userId, roleGroupIds: this.selectRoleGroupList, roleIds: this.selectRoleList }).then(t=>{
        this.cancel()
        this.getList();
      })
    },
    submitDeptForm() {
      post('/loginAccount/updateDept', { userId: this.userId, deptList: this.selectDeptList }).then(t=>{
        this.cancel()
        this.getList();
      })
    },
    handleDept(row) {
      this.userId = row.id
      this.title = '修改部门'
      this.selectDeptList=row.baseRoleIds;
      this.deptOpen = true
    }
  }
}
</script>
