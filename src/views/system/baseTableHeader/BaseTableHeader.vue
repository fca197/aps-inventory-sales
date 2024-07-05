<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryForm" :inline="true" :model="queryParams" label-width="88px" size="small">
      <el-form-item label="业务" prop="bizKey">
        <el-input v-model="queryParams.data.bizKey" clearable placeholder="请输入业务" @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="字段名" prop="fieldName">
        <el-input v-model="queryParams.data.fieldName" clearable placeholder="请输入字段名" @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="列名" prop="showName">
        <el-input v-model="queryParams.data.showName" clearable placeholder="请输入列名" @keyup.enter.native="handleQuery"/>
      </el-form-item>

    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button icon="el-icon-plus" plain size="mini" type="primary" @click="handleAdd"></el-button>
      </el-col>
<!--      <el-col :span="1.5">-->
<!--        <el-button :disabled="multiple" icon="el-icon-delete" plain size="mini" type="danger" @click="handleDelete"></el-button>-->
<!--      </el-col>-->
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="baseTableHeaderList" @selection-change="handleSelectionChange">
      <el-table-column align="center" label="全选" prop="id" type="selection" width="50"/>
      <el-table-column v-for="(item,index) in  tableHeaderList" :key="index" :label="item.showName" :prop="item.fieldName"  :width="item.width+'px'">
        <template slot-scope="scope">
          {{ scope.row[item.fieldName] }}
        </template>
      </el-table-column>

      <el-table-column align="center" class-name="small-padding fixed-width" label="操作">
        <template slot-scope="scope">
          <el-button icon="el-icon-edit" size="mini" type="text" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button icon="el-icon-delete" size="mini" type="text" @click="handleDelete(scope.row)">删除</el-button>
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

        <el-form-item label="业务" prop="bizKey">
          <el-input v-model="form.bizKey" clearable placeholder="请输入业务" @keyup.enter.native="handleQuery"/>
        </el-form-item>
        <el-form-item label="字段" prop="fieldName">
          <el-input v-model="form.fieldName" clearable placeholder="请输入字段" @keyup.enter.native="handleQuery"/>
        </el-form-item>
        <el-form-item label="列名" prop="showName">
          <el-input v-model="form.showName" clearable placeholder="请输入列名" @keyup.enter.native="handleQuery"/>
        </el-form-item>
        <el-form-item label="宽度" prop="widthPx">
          <el-input v-model="form.widthPx" clearable placeholder="请输入宽度" @keyup.enter.native="handleQuery"/>
        </el-form-item>
        <el-form-item label="排序" prop="sortIndex">
          <el-input v-model="form.sortIndex" clearable placeholder="请输入排序" @keyup.enter.native="handleQuery"/>
        </el-form-item>
        <el-form-item label="图片" prop="isPicture">
          <el-switch v-model="form.isPicture" active-color="#13ce66" inactive-color="#ff4949">
            <span slot="open">是</span>
            <span slot="close">否</span>
          </el-switch>
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

import { add, deleteByIdList, getById, queryPageList, updateById } from '@/api/common'

export default {
  name: 'tenantName',
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
      baseTableHeaderList: [],
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
        bizKey: undefined,
        fieldName: undefined,
        showName: undefined,
        widthPx: undefined,
        sortIndex: undefined,
        isPicture: undefined,
        planStatus: undefined,
        id: undefined
      },
      // 表单校验
      rules: {},
      tableHeaderList: []
    }
  },
  created() {
    document['pagePath'] = '/baseTableHeader'
    this.getList()
  },
  methods: {
    /** 查询公告列表 */
    getList() {
      this.loading = true
      queryPageList(this.queryParams).then(response => {
        response = response.data
        this.tableHeaderList = response.headerList
        this.baseTableHeaderList = response.dataList
        this.total = parseInt(response.total)
        this.loading = false
      })
    },
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      let fid = this.form.id
      this.form = {
        bizKey: undefined,
        fieldName: undefined,
        showName: undefined,
        widthPx: undefined,
        sortIndex: undefined,
        isPicture: undefined,
        planStatus: undefined,
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
      this.reset()
      this.title = '添加表头配置表'
      this.open = true
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      let req = { idList: [row.id], pageSize: 1, pageNum: 1 }
      getById(req).then(response => {
        this.form = response.data.dataList[0]
        this.title = '修改表头配置表'
        this.open = true
      })

    },

    /** 提交按钮 */
    submitForm: function() {
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
      this.$modal.confirm('是否确认删序号为 <span style="color:red">' + idList + '</span> 的数据项？', '删除提示').then(function() {
        let req = {
          idList: idList
        }
        return deleteByIdList(req)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess('删除成功')
      })
      document.getElementsByClassName('el-message-box')[0].style.width = '520px'
    }
  }

}


</script>

