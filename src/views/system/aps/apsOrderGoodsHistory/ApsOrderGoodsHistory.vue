<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryForm" :inline="true" :model="queryParams" label-width="88px" size="small">
        <el-form-item label="工厂ID" prop="factoryId">
          <el-input v-model="queryParams.data.factoryId" clearable placeholder="请输入工厂ID" @keyup.enter.native="handleQuery"/>
        </el-form-item>
        <el-form-item label="商品ID" prop="goodsId">
          <el-input v-model="queryParams.data.goodsId" clearable placeholder="请输入商品ID" @keyup.enter.native="handleQuery"/>
        </el-form-item>
        <el-form-item label="年份" prop="year">
          <el-input v-model="queryParams.data.year" clearable placeholder="请输入年份" @keyup.enter.native="handleQuery"/>
        </el-form-item>
        <el-form-item label="1月销售数量" prop="monthCount01">
          <el-input v-model="queryParams.data.monthCount01" clearable placeholder="请输入1月销售数量" @keyup.enter.native="handleQuery"/>
        </el-form-item>
        <el-form-item label="1月销售占比" prop="monthRatio01">
          <el-input v-model="queryParams.data.monthRatio01" clearable placeholder="请输入1月销售占比" @keyup.enter.native="handleQuery"/>
        </el-form-item>
        <el-form-item label="2月销售数量" prop="monthCount02">
          <el-input v-model="queryParams.data.monthCount02" clearable placeholder="请输入2月销售数量" @keyup.enter.native="handleQuery"/>
        </el-form-item>
        <el-form-item label="2月销售占比" prop="monthRatio02">
          <el-input v-model="queryParams.data.monthRatio02" clearable placeholder="请输入2月销售占比" @keyup.enter.native="handleQuery"/>
        </el-form-item>
        <el-form-item label="3月销售数量" prop="monthCount03">
          <el-input v-model="queryParams.data.monthCount03" clearable placeholder="请输入3月销售数量" @keyup.enter.native="handleQuery"/>
        </el-form-item>
        <el-form-item label="3月销售占比" prop="monthRatio03">
          <el-input v-model="queryParams.data.monthRatio03" clearable placeholder="请输入3月销售占比" @keyup.enter.native="handleQuery"/>
        </el-form-item>
        <el-form-item label="4月销售数量" prop="monthCount04">
          <el-input v-model="queryParams.data.monthCount04" clearable placeholder="请输入4月销售数量" @keyup.enter.native="handleQuery"/>
        </el-form-item>
        <el-form-item label="4月销售占比" prop="monthRatio04">
          <el-input v-model="queryParams.data.monthRatio04" clearable placeholder="请输入4月销售占比" @keyup.enter.native="handleQuery"/>
        </el-form-item>
        <el-form-item label="5月销售数量" prop="monthCount05">
          <el-input v-model="queryParams.data.monthCount05" clearable placeholder="请输入5月销售数量" @keyup.enter.native="handleQuery"/>
        </el-form-item>
        <el-form-item label="5月销售占比" prop="monthRatio05">
          <el-input v-model="queryParams.data.monthRatio05" clearable placeholder="请输入5月销售占比" @keyup.enter.native="handleQuery"/>
        </el-form-item>
        <el-form-item label="6月销售数量" prop="monthCount06">
          <el-input v-model="queryParams.data.monthCount06" clearable placeholder="请输入6月销售数量" @keyup.enter.native="handleQuery"/>
        </el-form-item>
        <el-form-item label="6月销售占比" prop="monthRatio06">
          <el-input v-model="queryParams.data.monthRatio06" clearable placeholder="请输入6月销售占比" @keyup.enter.native="handleQuery"/>
        </el-form-item>
        <el-form-item label="7月销售数量" prop="monthCount07">
          <el-input v-model="queryParams.data.monthCount07" clearable placeholder="请输入7月销售数量" @keyup.enter.native="handleQuery"/>
        </el-form-item>
        <el-form-item label="7月销售占比" prop="monthRatio07">
          <el-input v-model="queryParams.data.monthRatio07" clearable placeholder="请输入7月销售占比" @keyup.enter.native="handleQuery"/>
        </el-form-item>
        <el-form-item label="8月销售数量" prop="monthCount08">
          <el-input v-model="queryParams.data.monthCount08" clearable placeholder="请输入8月销售数量" @keyup.enter.native="handleQuery"/>
        </el-form-item>
        <el-form-item label="8月销售占比" prop="monthRatio08">
          <el-input v-model="queryParams.data.monthRatio08" clearable placeholder="请输入8月销售占比" @keyup.enter.native="handleQuery"/>
        </el-form-item>
        <el-form-item label="9月销售数量" prop="monthCount09">
          <el-input v-model="queryParams.data.monthCount09" clearable placeholder="请输入9月销售数量" @keyup.enter.native="handleQuery"/>
        </el-form-item>
        <el-form-item label="9月销售占比" prop="monthRatio09">
          <el-input v-model="queryParams.data.monthRatio09" clearable placeholder="请输入9月销售占比" @keyup.enter.native="handleQuery"/>
        </el-form-item>
        <el-form-item label="10月销售数量" prop="monthCount10">
          <el-input v-model="queryParams.data.monthCount10" clearable placeholder="请输入10月销售数量" @keyup.enter.native="handleQuery"/>
        </el-form-item>
        <el-form-item label="10月销售占比" prop="monthRatio10">
          <el-input v-model="queryParams.data.monthRatio10" clearable placeholder="请输入10月销售占比" @keyup.enter.native="handleQuery"/>
        </el-form-item>
        <el-form-item label="11月销售数量" prop="monthCount11">
          <el-input v-model="queryParams.data.monthCount11" clearable placeholder="请输入11月销售数量" @keyup.enter.native="handleQuery"/>
        </el-form-item>
        <el-form-item label="11月销售占比" prop="monthRatio11">
          <el-input v-model="queryParams.data.monthRatio11" clearable placeholder="请输入11月销售占比" @keyup.enter.native="handleQuery"/>
        </el-form-item>
        <el-form-item label="12月销售数量" prop="monthCount12">
          <el-input v-model="queryParams.data.monthCount12" clearable placeholder="请输入12月销售数量" @keyup.enter.native="handleQuery"/>
        </el-form-item>
        <el-form-item label="12月销售占比" prop="monthRatio12">
          <el-input v-model="queryParams.data.monthRatio12" clearable placeholder="请输入12月销售占比" @keyup.enter.native="handleQuery"/>
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

    <el-table v-loading="loading" :data="apsOrderGoodsHistoryList" @selection-change="handleSelectionChange">
      <el-table-column align="center" label="全选" prop="id" type="selection" width="50"/>
      <el-table-column v-for="(item,index) in  tableHeaderList" :key="index" :label="item.showName" :prop="item.fieldName" align="center" :width="item.width+'px'"/>
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


  </div>
</template>


<script>

import { add, insetOrUpdate,deleteList,deleteByIdList, getById, queryPageList, updateById } from '@/api/common'
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
      apsOrderGoodsHistoryList: [],
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
        factoryId :undefined,
        goodsId :undefined,
        year :undefined,
        monthCount01 :undefined,
        monthRatio01 :undefined,
        monthCount02 :undefined,
        monthRatio02 :undefined,
        monthCount03 :undefined,
        monthRatio03 :undefined,
        monthCount04 :undefined,
        monthRatio04 :undefined,
        monthCount05 :undefined,
        monthRatio05 :undefined,
        monthCount06 :undefined,
        monthRatio06 :undefined,
        monthCount07 :undefined,
        monthRatio07 :undefined,
        monthCount08 :undefined,
        monthRatio08 :undefined,
        monthCount09 :undefined,
        monthRatio09 :undefined,
        monthCount10 :undefined,
        monthRatio10 :undefined,
        monthCount11 :undefined,
        monthRatio11 :undefined,
        monthCount12 :undefined,
        monthRatio12 :undefined,
        id: undefined
      },
      // 表单校验
      rules: {
        factoryId :[{required: true, message: "不能为空", trigger: "blur"},{ min: 5, max: 20, message: '长度在 5 到 20 个字符', trigger: 'blur' }],
        goodsId :[{required: true, message: "不能为空", trigger: "blur"},{ min: 5, max: 20, message: '长度在 5 到 20 个字符', trigger: 'blur' }],
        year :[{required: true, message: "不能为空", trigger: "blur"},{ min: 5, max: 20, message: '长度在 5 到 20 个字符', trigger: 'blur' }],
        monthCount01 :[{required: true, message: "不能为空", trigger: "blur"},{ min: 5, max: 20, message: '长度在 5 到 20 个字符', trigger: 'blur' }],
        monthRatio01 :[{required: true, message: "不能为空", trigger: "blur"},{ min: 5, max: 20, message: '长度在 5 到 20 个字符', trigger: 'blur' }],
        monthCount02 :[{required: true, message: "不能为空", trigger: "blur"},{ min: 5, max: 20, message: '长度在 5 到 20 个字符', trigger: 'blur' }],
        monthRatio02 :[{required: true, message: "不能为空", trigger: "blur"},{ min: 5, max: 20, message: '长度在 5 到 20 个字符', trigger: 'blur' }],
        monthCount03 :[{required: true, message: "不能为空", trigger: "blur"},{ min: 5, max: 20, message: '长度在 5 到 20 个字符', trigger: 'blur' }],
        monthRatio03 :[{required: true, message: "不能为空", trigger: "blur"},{ min: 5, max: 20, message: '长度在 5 到 20 个字符', trigger: 'blur' }],
        monthCount04 :[{required: true, message: "不能为空", trigger: "blur"},{ min: 5, max: 20, message: '长度在 5 到 20 个字符', trigger: 'blur' }],
        monthRatio04 :[{required: true, message: "不能为空", trigger: "blur"},{ min: 5, max: 20, message: '长度在 5 到 20 个字符', trigger: 'blur' }],
        monthCount05 :[{required: true, message: "不能为空", trigger: "blur"},{ min: 5, max: 20, message: '长度在 5 到 20 个字符', trigger: 'blur' }],
        monthRatio05 :[{required: true, message: "不能为空", trigger: "blur"},{ min: 5, max: 20, message: '长度在 5 到 20 个字符', trigger: 'blur' }],
        monthCount06 :[{required: true, message: "不能为空", trigger: "blur"},{ min: 5, max: 20, message: '长度在 5 到 20 个字符', trigger: 'blur' }],
        monthRatio06 :[{required: true, message: "不能为空", trigger: "blur"},{ min: 5, max: 20, message: '长度在 5 到 20 个字符', trigger: 'blur' }],
        monthCount07 :[{required: true, message: "不能为空", trigger: "blur"},{ min: 5, max: 20, message: '长度在 5 到 20 个字符', trigger: 'blur' }],
        monthRatio07 :[{required: true, message: "不能为空", trigger: "blur"},{ min: 5, max: 20, message: '长度在 5 到 20 个字符', trigger: 'blur' }],
        monthCount08 :[{required: true, message: "不能为空", trigger: "blur"},{ min: 5, max: 20, message: '长度在 5 到 20 个字符', trigger: 'blur' }],
        monthRatio08 :[{required: true, message: "不能为空", trigger: "blur"},{ min: 5, max: 20, message: '长度在 5 到 20 个字符', trigger: 'blur' }],
        monthCount09 :[{required: true, message: "不能为空", trigger: "blur"},{ min: 5, max: 20, message: '长度在 5 到 20 个字符', trigger: 'blur' }],
        monthRatio09 :[{required: true, message: "不能为空", trigger: "blur"},{ min: 5, max: 20, message: '长度在 5 到 20 个字符', trigger: 'blur' }],
        monthCount10 :[{required: true, message: "不能为空", trigger: "blur"},{ min: 5, max: 20, message: '长度在 5 到 20 个字符', trigger: 'blur' }],
        monthRatio10 :[{required: true, message: "不能为空", trigger: "blur"},{ min: 5, max: 20, message: '长度在 5 到 20 个字符', trigger: 'blur' }],
        monthCount11 :[{required: true, message: "不能为空", trigger: "blur"},{ min: 5, max: 20, message: '长度在 5 到 20 个字符', trigger: 'blur' }],
        monthRatio11 :[{required: true, message: "不能为空", trigger: "blur"},{ min: 5, max: 20, message: '长度在 5 到 20 个字符', trigger: 'blur' }],
        monthCount12 :[{required: true, message: "不能为空", trigger: "blur"},{ min: 5, max: 20, message: '长度在 5 到 20 个字符', trigger: 'blur' }],
        monthRatio12 :[{required: true, message: "不能为空", trigger: "blur"},{ min: 5, max: 20, message: '长度在 5 到 20 个字符', trigger: 'blur' }],
      },
      tableHeaderList: []
    }
  },
  created() {
    document['pagePath'] = '/apsOrderGoodsHistory'
    this.getList()
  },
   methods: {
    /** 查询公告列表 */
    getList() {
      this.loading = true
      queryPageList(this.queryParams).then(response => {
        response = response.data
        this.tableHeaderList = response.headerList
        this.apsOrderGoodsHistoryList = response.dataList
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
      let fid=this.form.id
      this.form = {
        factoryId :undefined,
        goodsId :undefined,
        year :undefined,
        monthCount01 :undefined,
        monthRatio01 :undefined,
        monthCount02 :undefined,
        monthRatio02 :undefined,
        monthCount03 :undefined,
        monthRatio03 :undefined,
        monthCount04 :undefined,
        monthRatio04 :undefined,
        monthCount05 :undefined,
        monthRatio05 :undefined,
        monthCount06 :undefined,
        monthRatio06 :undefined,
        monthCount07 :undefined,
        monthRatio07 :undefined,
        monthCount08 :undefined,
        monthRatio08 :undefined,
        monthCount09 :undefined,
        monthRatio09 :undefined,
        monthCount10 :undefined,
        monthRatio10 :undefined,
        monthCount11 :undefined,
        monthRatio11 :undefined,
        monthCount12 :undefined,
        monthRatio12 :undefined,
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
      this.title = '添加历史订单记录'
      this.open = true
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      let req = { idList: [row.id], pageSize: 1, pageNum: 1 }
      getById(req).then(response => {
        this.form = response.data.dataList[0]
        this.title = '修改历史订单记录'
        this.open = true
      })

    },

    /** 提交按钮 */
    submitForm: function() {
       insetOrUpdate(this);
    },
     /** 删除按钮操作 */
    handleDelete(row) {
      deleteList(row,this.ids,this.getList());
    }
  }

 }


</script>

