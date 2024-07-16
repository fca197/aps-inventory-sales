<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryForm" :inline="true" :model="queryParams" label-width="88px" size="small">
      <el-form-item label="唯一编码" prop="rollCode">
        <el-input v-model="queryParams.data.rollCode" clearable placeholder="请输入唯一编码" @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="名称" prop="rollName">
        <el-input v-model="queryParams.data.rollName" clearable placeholder="请输入名称" @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="开始时间" prop="beginTime">
        <el-input v-model="queryParams.data.beginTime" clearable placeholder="请输入开始时间" @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="结束时间" prop="endTime">
        <el-input v-model="queryParams.data.endTime" clearable placeholder="请输入结束时间" @keyup.enter.native="handleQuery"/>
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

    <el-table v-loading="loading" :data="apsOrderRollingForecastList" @selection-change="handleSelectionChange">
      <el-table-column align="center" label="全选" prop="id" type="selection" width="50"/>
      <el-table-column v-for="(item,index) in  tableHeaderList" :key="index" :label="item.showName" :prop="item.fieldName" align="center" :width="item.width+'px'"/>
      <el-table-column align="center" class-name="small-padding fixed-width" label="操作" fixed="right" width="140px">
        <template slot-scope="scope">
          <el-button icon="el-icon-download" size="mini" type="text" @click="handleDownLoad(scope.row)">下载</el-button>
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
        <!--factoryId -->
        <el-form-item label="工厂" prop="factoryId">
          <el-select v-model="form.factoryId" placeholder="请选择工厂">
            <el-option
                v-for="item in factoryList"
                :key="item.id"
                :label="item.factoryName"
                :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="唯一编码" prop="rollCode">
          <el-input v-model="form.rollCode" clearable placeholder="请输入唯一编码"/>
        </el-form-item>
        <el-form-item label="名称" prop="rollName">
          <el-input v-model="form.rollName" clearable placeholder="请输入名称"/>
        </el-form-item>
        <el-form-item label="开始时间" prop="beginTime">
          <!--          <el-input v-model="form.beginTime" clearable placeholder="请输入开始时间" />-->
          <el-date-picker
              v-model="form.beginTime"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-date-picker
              v-model="form.endTime"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <!--beginStatusId -->
        <el-form-item label="开始状态" prop="beginStatusId">
          <el-select v-model="form.beginStatusId" placeholder="请选择开始状态">
            <el-option
                v-for="item in statusList"
                :key="item.id"
                :label="item.statusName"
                :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="结束状态" prop="endStatusId">
          <el-select v-model="form.endStatusId" placeholder="请选择结束状态">
            <el-option
                v-for="item in statusList"
                :key="item.id"
                :label="item.statusName"
                :value="item.id"
            />
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

import { add, deleteByIdList, getById, queryPageList, queryUrlPageList, updateById } from '@/api/common'
import { downloadForm } from '@/utils/request'
import { getFactoryList } from '@/api/factory'

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
      apsOrderRollingForecastList: [],
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
        rollCode: undefined,
        rollName: undefined,
        beginTime: undefined,
        endTime: undefined,
        id: undefined
      },
      // 表单校验
      rules: {},
      tableHeaderList: [],
      factoryList: [],
      statusList: []
    }
  },
  created() {
    document['pagePath'] = '/apsRollingForecastOrder'
    getFactoryList({ queryPage: false }).then(t => {
      this.getList()
      this.factoryList = t.data.dataList
      queryUrlPageList('/apsStatus', { queryPage: false }).then(t2 => {
        this.statusList = t2.data.dataList
      })
    })
  },
  methods: {
    /** 查询公告列表 */
    getList() {
      this.loading = true
      queryPageList(this.queryParams).then(response => {
        response = response.data
        this.tableHeaderList = response.headerList
        this.apsOrderRollingForecastList = response.dataList
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
        rollCode: undefined,
        rollName: undefined,
        beginTime: undefined,
        endTime: undefined,
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
      this.title = '添加滚动预测'
      var code = this.formatDates(new Date(), true)
      this.form.rollCode = 'RF-' + code
      this.form.rollName = 'GDYC-' + code
      this.form.beginTime = this.formatDates(new Date()).substring(0, 10)
      this.form.endTime = this.formatDates(new Date(new Date().getTime() + 96 * 26 * 60 * 60 * 1000)).substring(0, 10)
      this.open = true
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      let req = { idList: [row.id], pageSize: 1, pageNum: 1 }
      getById(req).then(response => {
        this.form = response.data.dataList[0]
        this.title = '修改滚动预测'
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
    },
    handleDownLoad(row) {
      downloadForm('/apsRollingForecastOrderItem/exportQueryPageList', { data: { forecastId: row.id } }, '滚动预测订单明细.xlsx')
    }
  }

}


</script>

