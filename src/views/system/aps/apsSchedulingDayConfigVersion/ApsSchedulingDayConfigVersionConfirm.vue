<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryForm" :inline="true" :model="queryParams" label-width="88px" size="small">

      <el-form-item label="当前日期" prop="currentDay">
        <el-date-picker v-model="queryParams.data.currentDay" clearable placeholder="请输入当前日期"
                        @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="订单号" prop="orderNo">
        <el-input v-model="queryParams.data.orderNo" clearable placeholder="请输入订单号"
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

    <el-table v-loading="loading" :data="apsSchedulingVersionItemPreList" @selection-change="handleSelectionChange">
      <el-table-column align="center" label="全选" prop="id" type="selection" width="50"/>
      <el-table-column v-for="(item,index) in  tableHeaderList" :key="index" :label="item.showName"
                       :prop="item.fieldName" align="center" :width="item.width+'px'"
      />

      <el-table-column v-for="of in apsSchedulingDayConfigVersion.orderFieldList" :label="of.label" width="200">
        <template slot-scope="scope">
          {{ scope.row.showField['order_' + of.value] }}
        </template>
      </el-table-column>
      <el-table-column v-for="of in apsSchedulingDayConfigVersion.orderUserFieldList" :label="of.label" width="200">
        <template slot-scope="scope">
          {{ scope.row.showField['orderUser_' + of.value] }}
        </template>
      </el-table-column>
      <el-table-column v-for="of in apsSchedulingDayConfigVersion.saleConfigIdList" :label="of.label" width="200">
        <template slot-scope="scope">
          {{ scope.row.showField['sale_' + of.value] }}
        </template>
      </el-table-column>

      <el-table-column align="center" class-name="small-padding fixed-width" label="操作" width="150px">
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
    <el-dialog :title="title" :visible.sync="open" width="500px" @close="cancel">

      <el-form ref="addOrderFormRef" :model="addOrderFormData" :validate-on-rule-change="true" :rules="addOrderFormRules" label-width="80px">
        <el-form-item label="类型" prop="type">
          <el-select v-model="addOrderFormData.type">
            <el-option label="订单号" value="orderNo"></el-option>
            <el-option label="上级订单号" value="orderNoParent"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="订单值" prop="valueList">
          <el-input
            :autosize="{ minRows: 2, maxRows: 40}"
            placeholder="请输入内容,每行支持一个"
            type="textarea"
            autosize
            v-model="addOrderFormData.valueList"
          ></el-input>
        </el-form-item>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="subAddOrderForm">保 存</el-button>
      </div>
    </el-dialog>

  </div>
</template>


<script>

import { deleteList, getById, insetOrUpdate, post, queryPageList } from '@/api/common'

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
      apsSchedulingVersionItemPreList: [],
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
      apsSchedulingDayConfigVersion: {
        orderFieldList: []
      },
      // 表单参数
      form: {
        schedulingVersionId: undefined,
        currentDay: undefined,
        orderId: undefined,
        goodsId: undefined,
        numberIndex: undefined,
        factoryId: undefined,
        showField: undefined,
        orderNo: undefined,
        id: undefined
      },
      schedulingVersionId: 0,

      tableHeaderList: [],
      addOrderFormData: {
        schedulingVersionId: undefined,
        type: '',
        valueList: ''
      },
      addOrderFormRules: {
        type: [{ required: true, message: '不能为空', trigger: 'blur' }],
        valueList: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { min: 2, message: '长度不能小于 2', trigger: 'blur' }
        ]
      }

    }
  },
  created() {
    document['pagePath'] = '/apsSchedulingVersionItemPre'
    this.schedulingVersionId = this.$route.params.id
    this.queryParams.data.schedulingVersionId = this.schedulingVersionId
    // post("/apsSchedulingDayConfigVersion/queryById")
    post('/apsSchedulingDayConfigVersion/queryByIdList', { idList: [this.schedulingVersionId] }, false).then(t => {
      if (t.data.dataList.length < 1) {
        this.$message.error('查询错误，请关闭页面。')
        Promise.reject('查询错误，请关闭页面。')
        return
      }
      this.apsSchedulingDayConfigVersion = t.data.dataList[0]

    }).then(t => {
      console.info('apsSchedulingDayConfigVersion.orderFieldList', this.apsSchedulingDayConfigVersion.orderFieldList)
      this.getList()
    })

  },
  methods: {
    /** 查询公告列表 */
    getList() {
      this.loading = true
      queryPageList(this.queryParams).then(response => {
        response = response.data
        this.tableHeaderList = response.headerList
        this.apsSchedulingVersionItemPreList = response.dataList
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
        schedulingVersionId: undefined,
        currentDay: undefined,
        orderId: undefined,
        goodsId: undefined,
        numberIndex: undefined,
        factoryId: undefined,
        showField: undefined,
        orderNo: undefined,
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
      this.title = '添加排产下发订单'
      this.open = true
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      let req = { idList: [row.id], pageSize: 1, pageNum: 1 }
      getById(req).then(response => {
        this.form = response.data.dataList[0]
        this.title = '修改排产下发订单'
        this.open = true
      })

    },
    subAddOrderForm() {
      this.addOrderFormData.schedulingVersionId = this.schedulingVersionId
      this.$refs.addOrderFormRef.validate(valid => {
        if (valid) {
          post('/apsSchedulingDayConfigVersion/addOrder', this.addOrderFormData).then(t => this.getList())
        } else {
          console.info('error')
        }

      })
    },

    /** 提交按钮 */
    submitForm: function() {
      insetOrUpdate(this)
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      let fgl = this.getList
      deleteList(row, this.ids, fgl)
    }
  }

}


</script>

