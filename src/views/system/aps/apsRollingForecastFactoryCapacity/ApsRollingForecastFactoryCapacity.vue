<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryForm" :inline="true" :model="queryParams" label-width="88px" size="small">
      <el-form-item label="工厂" prop="factoryId">
        <!--        <el-input v-model="queryParams.data.factoryId" clearable placeholder="请输入工厂ID" @keyup.enter.native="handleQuery"/>-->
        <el-select v-model="queryParams.data.factoryId" clearable placeholder="请输入工厂ID">
          <el-option v-for="item in factoryList" :key="item.id" :label="item.factoryName" :value="item.id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="年份" prop="year">
        <el-input v-model="queryParams.data.year" clearable placeholder="请输入年份" @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="月份" prop="month">
        <el-select v-model="queryParams.data.month" clearable placeholder="请输入月份">
          <el-option v-for="item in 12" :key="item" :label="item" :value="item"/>
        </el-select>
        <!--        <el-input v-model="queryParams.data.month" clearable placeholder="请输入月份" @keyup.enter.native="handleQuery"/>-->
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

    <el-table v-loading="loading" :data="apsRollingForecastFactoryCapacityList" @selection-change="handleSelectionChange">
      <el-table-column align="center" label="全选" prop="id" type="selection" width="50"/>
      <el-table-column v-for="(item,index) in  tableHeaderList" :key="index" :label="item.showName" :prop="item.fieldName" align="center" :width="item.width+'px'">
        <template slot-scope="scope">
          <span v-if="scope.row[item.fieldName]">{{ scope.row[item.fieldName] }}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column align="center" class-name="small-padding fixed-width" label="操作" fixed="right" width="140px">
        <template slot-scope="scope">
          <el-button icon="el-icon-edit" size="mini" type="text" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button icon="el-icon-delete" size="mini" type="text" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :limit.sync="queryParams.pageSize" :page.sync="queryParams.pageNum"
                :total="total" @pagination="getList"
    />

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" append-to-body width="900px">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="工厂ID" prop="factoryId">
          <el-select v-model="form.factoryId" clearable placeholder="请输入工厂ID" style="width: 700px">
            <el-option v-for="item in factoryList" :key="item.id" :label="item.factoryName" :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="产能" prop="capacityList" v-for="(c,i) in form.capacityList" :key="i">
          <el-date-picker v-model="c.timeRange" type="daterange" value-format="yyyy-MM-dd" placeholder="选择日期" style="width: 400px"/>
          <el-input v-model="c.capacity" clearable placeholder="请输入产能" style="width: 150px;margin: 0 5px 0"/>
          <el-button type="primary" size="small" class="el-icon-plus" @click="addCapacity()"></el-button>
          <el-button type="danger" size="small" class="el-icon-minus" @click="deleteCapacity(i)"></el-button>
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
      showSearch: true,
      // 总条数
      total: 0,
      apsRollingForecastFactoryCapacityList: [],
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
        factoryId: undefined,
        id: undefined,
        capacityList: [
          {
            timeRange: undefined,
            capacity: undefined
          }
        ]
      },
      // 表单校验
      rules: {},
      tableHeaderList: [],
      factoryList: []
    }
  },
  created() {
    document['pagePath'] = '/apsRollingForecastFactoryCapacity'

    getFactoryList({ queryPage: false }).then(t => {
      this.factoryList = t.data.dataList
    })
    this.getList()
  },
  methods: {
    /** 查询公告列表 */
    getList() {
      this.loading = true
      queryPageList(this.queryParams).then(response => {
        response = response.data
        this.tableHeaderList = response.headerList
        this.apsRollingForecastFactoryCapacityList = response.dataList
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
        factoryId: undefined,
        capacityList: [
          {
            timeRange: undefined,
            capacity: undefined
          }
        ],
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

      let list = this.form.capacityList

      for (let i = 0; i < list.length; i++) {
        let t = list[i]
        if (t.timeRange === undefined || t.timeRange.length !== 2) {
          this.$modal.msgError('请选择时间范围')
          return
        }
        if (t.capacity === undefined || t.capacity === '') {
          this.$modal.msgError('请输入产能')
          return
        }
        t.beginTime = t.timeRange[0]
        t.endTime = t.timeRange[1]
      }

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
    addCapacity() {
      this.form.capacityList.push({
        timeRange: undefined,
        capacity: undefined
      })
    },
    deleteCapacity(i) {
      if (this.form.capacityList.length <= 1) {
        this.$modal.msgError('至少保留一个')
        return
      }
      this.form.capacityList.splice(i, 1)
    }
  }

}


</script>

