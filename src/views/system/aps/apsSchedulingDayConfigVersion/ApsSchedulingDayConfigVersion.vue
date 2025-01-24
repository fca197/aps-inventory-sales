<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryForm" :inline="true" :model="queryParams" label-width="88px" size="small">
      <el-form-item label="工厂" prop="factoryId">
        <el-select v-model="queryParams.data.factoryId" filterable placeholder="请选择工厂">
          <el-option v-for="item in factoryList" :key="item.id" :label="item.factoryName" :value="item.id"/>
        </el-select>
        <!--        <el-input v-model="queryParams.data.factoryId" clearable placeholder="请输入工厂" @keyup.enter.native="handleQuery"/>-->
      </el-form-item>
<!--      <el-form-item label="排程版本号" prop="schedulingDayVersionNo">-->
<!--        <el-input v-model="queryParams.data.schedulingDayVersionNo" clearable placeholder="请输入排程版本号" @keyup.enter.native="handleQuery"/>-->
<!--      </el-form-item>-->
      <el-form-item label="排程日期" prop="schedulingDay">
        <!--        <el-input v-model="queryParams.data.schedulingDay" clearable placeholder="请输入排程日期" @keyup.enter.native="handleQuery"/>-->
        <el-date-picker v-model="queryParams.data.schedulingDay" type="date" value-format="yyyy-MM-dd" placeholder="选择日期"/>
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

    <el-table v-loading="loading" :data="apsSchedulingDayConfigVersionList" @selection-change="handleSelectionChange">
      <el-table-column align="center" label="全选" prop="id" type="selection" width="50"/>
      <el-table-column v-for="(item,index) in  tableHeaderList" :key="index" :label="item.showName" :prop="item.fieldName" align="center" :width="item.width+'px'"/>
      <el-table-column align="center" class-name="small-padding fixed-width" label="操作">
        <template slot-scope="scope">
          <el-button icon="el-icon-s-data" size="mini" type="text" @click="handleInfo(scope.row)">详情</el-button>
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
    <el-dialog :title="title" :visible.sync="open" append-to-body width="600px">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">

        <el-form-item label="排程配置" prop="schedulingDayConfigId">
          <el-select v-model="form.schedulingDayConfigId" filterable placeholder="请选择排程配置" @change="selectConfig"   style="width: 100%">
            <el-option v-for="item in apsSchedulingDayConfigList" :key="item.id" :label="item.schedulingDayName" :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="排程版本号" prop="schedulingDayVersionNo">
          <el-input v-model="form.schedulingDayVersionNo" clearable placeholder="请输入排程版本号"/>
        </el-form-item>
        <el-form-item label="排程日期" prop="schedulingDay">
          <!--          <el-input v-model="form.schedulingDay" clearable placeholder="请输入排程日期"/>-->
          <el-date-picker v-model="form.schedulingDay" type="date" value-format="yyyy-MM-dd" placeholder="选择日期"  style="width: 100%"/>
        </el-form-item>
        <el-form-item label="排程配置" prop="productType">
          <el-select v-model="form.productType" filterable placeholder="请选择排程类型"   style="width: 100%">
            <el-option v-for="item in productTypeList" :key="item.code" :label="item.desc" :value="item.code"/>
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

import { add, deleteByIdList, getById, queryPageList, queryUrlNoPageList, queryUrlPageList, updateById } from '@/api/common'
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
      apsSchedulingDayConfigVersionList: [],
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
        productType:undefined,
        factoryId: undefined,
        schedulingDayConfigId: undefined,
        processId: undefined,
        schedulingDayVersionNo: undefined,
        schedulingDay: undefined,
        isIssuedThird: 0,
        id: undefined
      },
      // 表单校验
      rules: {},
      tableHeaderList: [],
      factoryList: [],
      processList: [],
      productTypeList: [{ code: "MAKE", desc : "制造路径" },{ code: "PROCESS", desc : "工艺路径" }],
      processMap: {},
      apsSchedulingDayConfigList:[],

    }
  },
  created() {

    queryUrlPageList('/apsSchedulingDayConfig', { queryPage: false }).then(t => {
      this.apsSchedulingDayConfigList = t.data.dataList
      this.apsSchedulingDayConfigList.forEach(p => {
        p.schedulingDayName = p.factoryName+"-"+ p.schedulingDayName + '(' + p.schedulingDayNo + ')'
      })
    })
    queryUrlPageList('/apsProcessPath', { queryPage: false }).then(t => {
      this.processList = t.data.dataList
      this.processMap=this.groupBy(this.processList, 'factoryId')
    })
    document['pagePath'] = '/apsSchedulingDayConfigVersion'
    getFactoryList({ queryPage: false }).then(t => {
      this.factoryList = t.data.dataList
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
        this.apsSchedulingDayConfigVersionList = response.dataList
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
        schedulingDayConfigId: undefined,
        processId: undefined,
        schedulingDayVersionNo: undefined,
        schedulingDay: undefined,
        isIssuedThird: 0,
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
      this.form.schedulingDayVersionNo="PC-"+ this.formatDates(new Date(), true);
      this.title = '添加排程版本'
      this.open = true
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      let req = { idList: [row.id], pageSize: 1, pageNum: 1 }
      getById(req).then(response => {
        this.form = response.data.dataList[0]
        this.title = '修改排程版本'
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
    selectConfig(id){
      this.apsSchedulingDayConfigList.filter(t=>t.id===id).forEach(t=>{
        this.form.factoryId=t.factoryId
        this.form.processId=t.processId
      })
    },
    handleInfo(row) {

      this.$router.push({ path: '/apsSchedulingDayConfigVersion/detailList', query: { id: row.id ,productType:row.productType} })
    }
  }

}


</script>

