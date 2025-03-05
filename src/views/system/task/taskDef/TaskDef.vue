<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryForm" :inline="true" :model="queryParams" label-width="88px" size="small">
      <el-form-item label="任务名称" prop="taskName">
        <el-input v-model="queryParams.data.taskName" clearable placeholder="请输入任务名称"
                  @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="任务编号" prop="tasCode">
        <el-input v-model="queryParams.data.tasCode" clearable placeholder="请输入任务编号"
                  @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="任务备注" prop="taskRemark">
        <el-input v-model="queryParams.data.taskRemark" clearable placeholder="请输入任务备注"
                  @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="任务名内容" prop="taskDefContent">
        <el-input v-model="queryParams.data.taskDefContent" clearable placeholder="请输入任务名称"
                  @keyup.enter.native="handleQuery"
        />
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button icon="el-icon-plus" plain size="mini" type="primary" @click="handleAdd"></el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button :disabled="multiple" icon="el-icon-delete" plain size="mini" type="danger"
                   @click="handleDelete"
        ></el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="taskDefList" @selection-change="handleSelectionChange">
      <el-table-column align="center" label="全选" prop="id" type="selection" width="50"/>
      <el-table-column v-for="(item,index) in  tableHeaderList" :key="index" :label="item.showName"
                       :prop="item.fieldName" align="center" :width="item.width+'px'"
      />
      <el-table-column align="center" class-name="small-padding fixed-width" label="操作">
        <template slot-scope="scope">
          <el-button icon="el-icon-edit" size="mini" type="text" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button icon="el-icon-delete" size="mini" type="text" @click="handleDelete(scope.row)">删除</el-button>
          <el-button icon="el-icon-eleme" size="mini" type="text" @click="handleDefEdit(scope.row)">任务</el-button>
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

        <el-form-item label="任务名称" prop="taskName">
          <el-input v-model="form.taskName" clearable placeholder="请输入任务名称"/>
        </el-form-item>
        <el-form-item label="任务编号" prop="tasCode">
          <el-input v-model="form.tasCode" clearable placeholder="请输入任务编号"/>
        </el-form-item>
        <el-form-item label="任务备注" prop="taskRemark">
          <el-input v-model="form.taskRemark" clearable placeholder="请输入任务备注"/>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="title" :key="'xxx'+Math.random()" :visible.sync="handleDefEditShow" width="1400px" :close-on-press-escape="false" :close-on-click-modal=false>
      <task-def-edit :task-id="task.id" ></task-def-edit>
    </el-dialog>

  </div>
</template>


<script>

import taskDefEdit from '@/views/system/task/taskDef/TaskDefEdit.vue'
import { deleteList, getById, insetOrUpdate, queryPageList } from '@/api/common'

export default {
  name: 'tenantName',
  components: {
    taskDefEdit
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
      handleDefEditShow: false,
      // 总条数
      total: 0,
      currentTaskId: 0,
      taskDefList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      task: {},
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        data: {}
      },
      // 表单参数
      form: {
        taskName: undefined,
        tasCode: undefined,
        taskRemark: undefined,
        taskDefContent: undefined,
        id: undefined
      },
      // 表单校验
      rules: {
        taskName: [{ required: true, message: '不能为空', trigger: 'blur' }, {
          min: 5,
          max: 20,
          message: '长度在 5 到 20 个字符',
          trigger: 'blur'
        }],
        tasCode: [{ required: true, message: '不能为空', trigger: 'blur' }, {
          min: 5,
          max: 20,
          message: '长度在 5 到 20 个字符',
          trigger: 'blur'
        }],
        taskRemark: [{ required: true, message: '不能为空', trigger: 'blur' }, {
          min: 5,
          max: 20,
          message: '长度在 5 到 20 个字符',
          trigger: 'blur'
        }],
        taskDefContent: [{ required: true, message: '不能为空', trigger: 'blur' }, {
          min: 5,
          max: 20,
          message: '长度在 5 到 20 个字符',
          trigger: 'blur'
        }]
      },
      tableHeaderList: []
    }
  },
  created() {
    document['pagePath'] = '/taskDef'
    this.getList()
  },
  methods: {
    /** 查询公告列表 */
    getList() {
      this.loading = true
      queryPageList(this.queryParams).then(response => {
        response = response.data
        this.tableHeaderList = response.headerList
        this.taskDefList = response.dataList
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
        taskName: undefined,
        tasCode: undefined,
        taskRemark: undefined,
        taskDefContent: undefined,
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
      this.title = '添加任务定义'
      this.open = true
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      let req = { idList: [row.id], pageSize: 1, pageNum: 1 }
      getById(req).then(response => {
        this.form = response.data.dataList[0]
        this.title = '修改任务定义'
        this.open = true
      })
    },

    /** 提交按钮 */
    submitForm: function() {
      insetOrUpdate(this)
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      deleteList(row, this.ids, this.getList())
    },

    handleDefEdit(row) {
      this.title = '编辑任务流转'
      this.handleDefEditShow = true
      this.task = row
    }
  }

}


</script>

