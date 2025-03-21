<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryForm" :inline="true" :model="queryParams" label-width="88px" size="small">
      <el-form-item label="角色组编码" prop="roleGroupCode">
        <el-input v-model="queryParams.data.roleGroupCode" clearable placeholder="请输入角色组编码" @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="角色组名称" prop="roleGroupName">
        <el-input v-model="queryParams.data.roleGroupName" clearable placeholder="请输入角色组名称" @keyup.enter.native="handleQuery"/>
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

    <el-table v-loading="loading" :data="baseRoleGroupList" @selection-change="handleSelectionChange">
      <el-table-column align="center" label="全选" prop="id" type="selection" width="50"/>
      <el-table-column v-for="(item,index) in  tableHeaderList" :key="index" :label="item.showName" :prop="item.fieldName" align="center" :width="item.width+'px'"/>
      <el-table-column align="center" class-name="small-padding fixed-width" label="操作">
        <template slot-scope="scope">
          <el-button icon="el-icon-edit" size="mini" type="text" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button icon="el-icon-delete" size="mini" type="text" @click="handleDelete(scope.row)">删除</el-button>
          <el-button icon="el-icon-menu" size="mini" type="text" @click="handleMenu(scope.row)">菜单</el-button>
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

        <el-form-item label="角色组名称" prop="roleGroupName">
          <el-input v-model="form.roleGroupName" clearable placeholder="请输入角色组名称" @blur="loadSzm"/>
        </el-form-item>
        <el-form-item label="角色组编码" prop="roleGroupCode">
          <el-input v-model="form.roleGroupCode" clearable placeholder="请输入角色组编码"/>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="角色权限修改" :visible.sync="menuOpen" width="700px">

      <select-resource :key="ids[0]"
                       save-url="/baseRoleGroupResource"
                       :base-config="{
          cancel: cancel,
          menuOpen: menuOpen
        }"
                       :target-id="ids[0]"
                       save-object-field="roleGroupId"
                       save-resource-field="resourceIdList"
                       :query-config="{
          roleGroupId: this.ids[0]
        }"
                       query-url="/baseRoleGroupResource"
      ></select-resource>

    </el-dialog>
  </div>
</template>


<script>

import { add, deleteByIdList, getById, pinyin4jSzm, queryPageList, updateById } from '@/api/common'
import {getFactoryList} from '@/api/factory'
import SelectResource from '@/views/system/base/baseResource/SelectResource.vue'

export default {
  name: 'tenantName',
  components: { SelectResource },
  data() {

    return {
      // 遮罩层
      loading: true,
      menuOpen: false,
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
      baseRoleGroupList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        data: {}
      },
      // 表单参数
      form: {
        roleGroupCode: undefined,
        roleGroupName: undefined,
        id: undefined
      },
      // 表单校验
      rules: {
        roleGroupName :[{required: true, message: "不能为空", trigger: "blur"},{ min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }],
        roleGroupCode :[{required: true, message: "不能为空", trigger: "blur"},{ min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }],
      },
      tableHeaderList: []
    }
  },
  created() {
    document['pagePath'] = '/baseRoleGroup'
    this.getList()
  },
  methods: {
    /** 查询公告列表 */
    getList() {
      this.loading = true
      queryPageList(this.queryParams).then(response => {
        response = response.data
        this.tableHeaderList = response.headerList
        this.baseRoleGroupList = response.dataList
        this.total = parseInt(response.total)
        this.loading = false
      })
    },
    cancel() {
      this.open = false
      this.menuOpen =false
      this.reset();
 this.form.id=undefined;
  },
    // 表单重置
    reset() {
      let fid = this.form.id
      this.form = {
        roleGroupCode: undefined,
        roleGroupName: undefined,
        id: fid
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
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.form.id=undefined;
      this.title = '添加角色组'
      this.open = true
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
     this.form.id=undefined;
    let req = {idList: [row.id], pageSize: 1, pageNum: 1}
      getById(req).then(response => {
        this.form = response.data.dataList[0]
        this.title = '修改角色组'
        this.open = true
      })

    },

    /** 提交按钮 */
    submitForm: function () {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id !== undefined) {
            updateById(this.form).then(response => {
              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            add(this.form).then(response => {
              this.$modal.msgSuccess('新增成功')
              this.open = false
              this.getList()
            })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const idList = row.id ? [row.id] : this.ids
      this.$modal.confirm('是否确认删序号为 <span style="color:red">' + idList + '</span> 的数据项？', '删除提示').then(function () {
        let req = {
          idList: idList
        }
        return deleteByIdList(req)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess('删除成功')
      })
      document.getElementsByClassName('el-message-box')[0].style.width = '520px'
    },
    handleMenu(row){
      this.ids[0]=row.id;
      this.menuOpen=true;
    },
    loadSzm(){
      pinyin4jSzm(this.form.roleGroupName,(r)=>{
        this.form.roleGroupCode=r.szmUpper;
        this.$forceUpdate();
      })
    }
  }

}


</script>

