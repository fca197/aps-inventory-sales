<template>
  <div class="app-container">
      <el-form v-show="showSearch" ref="queryForm" :inline="true" :model="queryParams" label-width="88px" size="small">
        <!--        <el-form-item label="工厂ID" prop="factoryId">-->
        <!--          <el-input v-model="queryParams.data.factoryId" clearable placeholder="请输入工厂ID" @keyup.enter.native="handleQuery"/>-->
        <!--        </el-form-item>-->
        <!--        <el-form-item label="商品ID" prop="goodsId">-->
        <!--          <el-input v-model="queryParams.data.goodsId" clearable placeholder="请输入商品ID" @keyup.enter.native="handleQuery"/>-->
        <!--        </el-form-item>-->
        <el-form-item label="年份" prop="year">
          <el-select v-model="queryParams.data.year" @change="handleQuery">
            <el-option v-for="year in yearList"    :key="year+'year'" :label="year+''" :value="year"></el-option>
          </el-select>

        </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button icon="el-icon-refresh" plain size="mini" type="primary" @click="refreshHistory(1)">上月</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button icon="el-icon-refresh" plain size="mini" type="primary" @click="refreshHistory(0)">当月</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="apsOrderGoodsSaleHistoryList" @selection-change="handleSelectionChange">
      <el-table-column align="center" label="全选" prop="id" type="selection" width="50"/>
      <el-table-column v-for="(item,index) in  tableHeaderList" :key="index" :label="item.showName"
                       :prop="item.fieldName" :width="item.width+'px'" align="center"/>
      <el-table-column v-for="m in monthList" width="200" :key="m+'month'" :label="m+'月'">
        <template slot-scope="scope">
          {{ scope.row['monthRatio' + m] !== null ? scope.row['monthRatio' + m]  + '%' : '' }}/{{scope.row['monthCount' + m] !==null ? parseInt(scope.row['monthCount' + m]):'' }}
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

import { deleteList, getById, insetOrUpdate, post, queryPageList } from '@/api/common'

export default {
  name: 'tenantName',
  data() {

    return {
      yearList: [2023, 2024, 2025, 2026],
      monthList: ['01', '02', '03', '05', '06', '07', '08', '09', '10', '11', '12'],
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
      apsOrderGoodsSaleHistoryList: [],
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
        goodsId: undefined,
        saleParentId: undefined,
        saleConfigId: undefined,
        monthCount01: undefined,
        monthRatio01: undefined,
        monthCount02: undefined,
        monthRatio02: undefined,
        monthCount03: undefined,
        monthRatio03: undefined,
        monthCount04: undefined,
        monthRatio04: undefined,
        monthCount05: undefined,
        monthRatio05: undefined,
        monthCount06: undefined,
        monthRatio06: undefined,
        monthCount07: undefined,
        monthRatio07: undefined,
        monthCount08: undefined,
        monthRatio08: undefined,
        monthCount09: undefined,
        monthRatio09: undefined,
        monthCount10: undefined,
        monthRatio10: undefined,
        monthCount11: undefined,
        monthRatio11: undefined,
        monthCount12: undefined,
        monthRatio12: undefined,
        id: undefined
      },
      // 表单校验
      rules: {
        factoryId: [{required: true, message: "不能为空", trigger: "blur"}, {
          min: 5,
          max: 20,
          message: '长度在 5 到 20 个字符',
          trigger: 'blur'
        }],
        goodsId: [{required: true, message: "不能为空", trigger: "blur"}, {
          min: 5,
          max: 20,
          message: '长度在 5 到 20 个字符',
          trigger: 'blur'
        }],
        saleParentId: [{required: true, message: "不能为空", trigger: "blur"}, {
          min: 5,
          max: 20,
          message: '长度在 5 到 20 个字符',
          trigger: 'blur'
        }],
        saleConfigId: [{required: true, message: "不能为空", trigger: "blur"}, {
          min: 5,
          max: 20,
          message: '长度在 5 到 20 个字符',
          trigger: 'blur'
        }],
        monthCount01: [{required: true, message: "不能为空", trigger: "blur"}, {
          min: 5,
          max: 20,
          message: '长度在 5 到 20 个字符',
          trigger: 'blur'
        }],
        monthRatio01: [{required: true, message: "不能为空", trigger: "blur"}, {
          min: 5,
          max: 20,
          message: '长度在 5 到 20 个字符',
          trigger: 'blur'
        }],
        monthCount02: [{required: true, message: "不能为空", trigger: "blur"}, {
          min: 5,
          max: 20,
          message: '长度在 5 到 20 个字符',
          trigger: 'blur'
        }],
        monthRatio02: [{required: true, message: "不能为空", trigger: "blur"}, {
          min: 5,
          max: 20,
          message: '长度在 5 到 20 个字符',
          trigger: 'blur'
        }],
        monthCount03: [{required: true, message: "不能为空", trigger: "blur"}, {
          min: 5,
          max: 20,
          message: '长度在 5 到 20 个字符',
          trigger: 'blur'
        }],
        monthRatio03: [{required: true, message: "不能为空", trigger: "blur"}, {
          min: 5,
          max: 20,
          message: '长度在 5 到 20 个字符',
          trigger: 'blur'
        }],
        monthCount04: [{required: true, message: "不能为空", trigger: "blur"}, {
          min: 5,
          max: 20,
          message: '长度在 5 到 20 个字符',
          trigger: 'blur'
        }],
        monthRatio04: [{required: true, message: "不能为空", trigger: "blur"}, {
          min: 5,
          max: 20,
          message: '长度在 5 到 20 个字符',
          trigger: 'blur'
        }],
        monthCount05: [{required: true, message: "不能为空", trigger: "blur"}, {
          min: 5,
          max: 20,
          message: '长度在 5 到 20 个字符',
          trigger: 'blur'
        }],
        monthRatio05: [{required: true, message: "不能为空", trigger: "blur"}, {
          min: 5,
          max: 20,
          message: '长度在 5 到 20 个字符',
          trigger: 'blur'
        }],
        monthCount06: [{required: true, message: "不能为空", trigger: "blur"}, {
          min: 5,
          max: 20,
          message: '长度在 5 到 20 个字符',
          trigger: 'blur'
        }],
        monthRatio06: [{required: true, message: "不能为空", trigger: "blur"}, {
          min: 5,
          max: 20,
          message: '长度在 5 到 20 个字符',
          trigger: 'blur'
        }],
        monthCount07: [{required: true, message: "不能为空", trigger: "blur"}, {
          min: 5,
          max: 20,
          message: '长度在 5 到 20 个字符',
          trigger: 'blur'
        }],
        monthRatio07: [{required: true, message: "不能为空", trigger: "blur"}, {
          min: 5,
          max: 20,
          message: '长度在 5 到 20 个字符',
          trigger: 'blur'
        }],
        monthCount08: [{required: true, message: "不能为空", trigger: "blur"}, {
          min: 5,
          max: 20,
          message: '长度在 5 到 20 个字符',
          trigger: 'blur'
        }],
        monthRatio08: [{required: true, message: "不能为空", trigger: "blur"}, {
          min: 5,
          max: 20,
          message: '长度在 5 到 20 个字符',
          trigger: 'blur'
        }],
        monthCount09: [{required: true, message: "不能为空", trigger: "blur"}, {
          min: 5,
          max: 20,
          message: '长度在 5 到 20 个字符',
          trigger: 'blur'
        }],
        monthRatio09: [{required: true, message: "不能为空", trigger: "blur"}, {
          min: 5,
          max: 20,
          message: '长度在 5 到 20 个字符',
          trigger: 'blur'
        }],
        monthCount10: [{required: true, message: "不能为空", trigger: "blur"}, {
          min: 5,
          max: 20,
          message: '长度在 5 到 20 个字符',
          trigger: 'blur'
        }],
        monthRatio10: [{required: true, message: "不能为空", trigger: "blur"}, {
          min: 5,
          max: 20,
          message: '长度在 5 到 20 个字符',
          trigger: 'blur'
        }],
        monthCount11: [{required: true, message: "不能为空", trigger: "blur"}, {
          min: 5,
          max: 20,
          message: '长度在 5 到 20 个字符',
          trigger: 'blur'
        }],
        monthRatio11: [{required: true, message: "不能为空", trigger: "blur"}, {
          min: 5,
          max: 20,
          message: '长度在 5 到 20 个字符',
          trigger: 'blur'
        }],
        monthCount12: [{required: true, message: "不能为空", trigger: "blur"}, {
          min: 5,
          max: 20,
          message: '长度在 5 到 20 个字符',
          trigger: 'blur'
        }],
        monthRatio12: [{required: true, message: "不能为空", trigger: "blur"}, {
          min: 5,
          max: 20,
          message: '长度在 5 到 20 个字符',
          trigger: 'blur'
        }],
      },
      tableHeaderList: []
    }
  },
  created() {
    document['pagePath'] = '/apsOrderGoodsSaleHistory'
    this.getList()
  },
  methods: {
    /** 查询公告列表 */
    getList() {
      this.loading = true
      queryPageList(this.queryParams).then(response => {
        response = response.data
        this.tableHeaderList = response.headerList
        this.apsOrderGoodsSaleHistoryList = response.dataList
        this.total = parseInt(response.total)
        this.loading = false
      })
    },
    cancel() {
      this.open = false
      this.reset();
 this.form.id=undefined;
  },
    // 表单重置
    reset() {
      let fid = this.form.id
      this.form = {
        factoryId: undefined,
        goodsId: undefined,
        saleParentId: undefined,
        saleConfigId: undefined,
        monthCount01: undefined,
        monthRatio01: undefined,
        monthCount02: undefined,
        monthRatio02: undefined,
        monthCount03: undefined,
        monthRatio03: undefined,
        monthCount04: undefined,
        monthRatio04: undefined,
        monthCount05: undefined,
        monthRatio05: undefined,
        monthCount06: undefined,
        monthRatio06: undefined,
        monthCount07: undefined,
        monthRatio07: undefined,
        monthCount08: undefined,
        monthRatio08: undefined,
        monthCount09: undefined,
        monthRatio09: undefined,
        monthCount10: undefined,
        monthRatio10: undefined,
        monthCount11: undefined,
        monthRatio11: undefined,
        monthCount12: undefined,
        monthRatio12: undefined,
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
      this.reset();  this.form.id=undefined;
      this.title = '添加销售规划订单历史销售占比'
      this.open = true
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
 this.form.id=undefined;
    let req = {idList: [row.id], pageSize: 1, pageNum: 1}
      getById(req).then(response => {
        this.form = response.data.dataList[0]
        this.title = '修改销售规划订单历史销售占比'
        this.open = true
      })

    },

    /** 提交按钮 */
    submitForm: function () {
      insetOrUpdate(this);
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      deleteList(row, this.ids, this.getList());
    },
    refreshHistory(type) {
      post('/apsOrderGoodsSaleHistory/selectOrder2History', {
        selectType: type === 1 ? 'LAST_MONTH' : 'CURRENT_MONTH'
      }).then(r => this.getList())
    }
  }

}


</script>

