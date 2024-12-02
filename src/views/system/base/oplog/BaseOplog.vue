<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryForm" :inline="true" :model="queryParams" label-width="88px" size="small">
      <el-form-item label="操作内容" prop="content">
        <el-input v-model="queryParams.data.content" clearable placeholder="请输入操作内容"
        />
      </el-form-item>
      <el-form-item label="业务类型" prop="businessType">
        <el-input v-model="queryParams.data.businessType" clearable placeholder="请输入业务类型"
        />
      </el-form-item>
      <el-form-item label="业务Key" prop="businessKey">
        <el-input v-model="queryParams.data.businessKey" clearable placeholder="请输入业务Key"
        />
      </el-form-item>
      <el-form-item label="请求地址" prop="url">
        <el-input v-model="queryParams.data.url" clearable placeholder="请输入请求地址"
        />
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
<!--      <el-col :span="1.5" >-->
<!--        <el-button icon="el-icon-plus" plain size="mini" type="primary" @click="handleAdd"></el-button>-->
<!--      </el-col>-->
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="baseOplogList" @selection-change="handleSelectionChange">
      <el-table-column align="center" label="全选" prop="id" type="selection" width="50"/>
      <el-table-column v-for="(item,index) in  tableHeaderList" :key="index" :label="item.showName"
                       :prop="item.fieldName" align="center" :width="item.width+'px'"
      />
      <el-table-column align="center" class-name="small-padding fixed-width" label="操作" width="140px" fixed="right">
        <template slot-scope="scope">
          <el-button icon="el-icon-info" size="mini" type="text" @click="handleUpdate(scope.row)">详情</el-button>
          <!--          <el-button icon="el-icon-delete" size="mini" type="text" @click="handleDelete(scope.row)">删除</el-button>-->
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
    <el-dialog :title="title" :visible.sync="open" append-to-body width="800px">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">

        <el-form-item label="操作内容" prop="content">
          <div v-text="form.content"/>
        </el-form-item>
        <el-form-item label="业务类型" prop="businessType">
          <div v-text="form.businessType"/>
        </el-form-item>
        <el-form-item label="方法名" prop="businessType">
          <div v-text="form.methodName"/>
        </el-form-item>
        <el-form-item label="业务Key" prop="businessKey">
          <div v-text="form.businessKey"/>
        </el-form-item>
        <el-form-item label="请求地址" prop="url">
          <div v-text="form.url"/>
        </el-form-item>
        <el-form-item label="耗时" prop="useTime">
          <div v-text="form.useTime"/>
        </el-form-item>
        <el-form-item label="参数名" prop="paramName">
          <div v-text="form.paramName"/>
        </el-form-item>
        <el-form-item label="请求入参" prop="reqBody">
          <div v-text="form.reqBody"/>
        </el-form-item>
        <el-form-item label="请求返回值" prop="resultStr">
          <div v-text="form.resultStr"/>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <div v-text="form.remark"/>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
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
      baseOplogList: [],
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
        content: undefined,
        businessType: undefined,
        businessKey: undefined,
        url: undefined,
        useTime: undefined,
        paramName: undefined,
        reqBody: undefined,
        resultStr: undefined,
        remark: undefined,
        id: undefined
      },
      // 表单校验
      rules: {},
      tableHeaderList: []
    }
  },
  created() {
    document['pagePath'] = '/baseOplog'
    this.getList()
  },
  methods: {
    /** 查询公告列表 */
    getList() {
      this.loading = true
      queryPageList(this.queryParams).then(response => {
        response = response.data
        this.tableHeaderList = response.headerList
        this.baseOplogList = response.dataList
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
        content: undefined,
        businessType: undefined,
        businessKey: undefined,
        url: undefined,
        useTime: undefined,
        paramName: undefined,
        reqBody: undefined,
        resultStr: undefined,
        remark: undefined,
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
      this.title = '添加操作日志'
      this.open = true
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      let req = { idList: [row.id], pageSize: 1, pageNum: 1 }
      getById(req).then(response => {
        this.form = response.data.dataList[0]
        this.title = '修改操作日志'
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

