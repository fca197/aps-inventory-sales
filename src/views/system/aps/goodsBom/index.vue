<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="88px">
      <el-form-item label="工厂" prop="factoryList">
        <el-select v-model="queryParams.data.factoryId" placeholder="请选择工厂" clearable>
          <el-option v-for="item in factoryList" :key="item.id" :label="item.factoryName" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商品" prop="factoryList">
        <el-select v-model="queryParams.data.goodsId" placeholder="请选择商品" clearable>
          <el-option v-for="item in goodsList.filter(t=>t.factoryId===this.queryParams.data.factoryId)" :key="item.id" :label="item.goodsName" :value="item.id"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="零件名称" prop="brandName">
        <el-input v-model="queryParams.data.bomName" placeholder="请输入零件名称" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"></el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"></el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="brandNameList" @selection-change="handleSelectionChange">

      <el-table-column label="全选" type="selection" align="center" prop="id" width="50"/>

      <el-table-column v-for="(item,index) in  tableHeaderList" :key="index" align="center" :width="item.width" :prop="item.fieldName" :label="item.showName"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right" width="140px">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-col :span="8">
          <el-form-item label="工厂" prop="factoryId">
            <el-select v-model="form.factoryId" placeholder="请选择工厂" clearable>
              <el-option v-for="item in factoryList" :key="item.id" :label="item.factoryName" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="商品" prop="goodsId">
            <el-select v-model="form.goodsId" placeholder="请选择零件" clearable>
              <el-option v-for="item in goodsList.filter(t=>t.factoryId===this.form.factoryId)" :key="item.id" :label="item.goodsName" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="工位" prop="bomUseWorkStation">
            <el-select v-model="form.bomUseWorkStation" placeholder="请选择工位" clearable>
              <el-option v-for="item in workStationList" :key="item.id" :label="item.stationName" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="零件" prop="bomId">
            <el-select v-model="form.bomId" placeholder="请选择零件" filterable remote :remote-method="selectBomListFun" @change="bomChange">
              <el-option v-for="item in selectBomList" :key="item.id" :label="item.bomName" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="零件编码" prop="bomCode">
            <el-input v-model="form.bomCode" placeholder="请输入零件编码" readonly disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="零件名称" prop="bomName">
            <el-input v-model="form.bomName" placeholder="请输入零件名称" readonly disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="成本单价" prop="bomCostPrice">
            <el-input v-model="form.bomCostPrice" placeholder="请输入成本单价" readonly disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="用量规格" prop="bomCostPriceUnit">
            <el-input v-model="form.bomCostPriceUnit" placeholder="请输入单价规格" readonly disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="零件用量" prop="bomUsage">
            <el-input v-model="form.bomUsage" placeholder="请输入用量"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="用量规格" prop="bomUnit">
            <el-input v-model="form.bomUnit" placeholder="请输入用量规格"/>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="使用表达式" prop="bomUseExpression" ref="bomUseExpression">
            <el-input style="width: 590px" v-model="form.bomUseExpression" placeholder="请输入使用表达式"/>
            <el-button @click="checkBomUseExpression(1)">检查</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="是否关注" prop="isFollow">
            <el-radio-group v-model="form.isFollow" size="medium">
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import { add, deleteByIdList, getById, post, queryPageList, queryUrlPageList, updateById } from '@/api/common'
import { getFactoryList } from '@/api/factory'
import { getGoodsList } from '@/api/aps/goods'
import { getWorkStationList } from '@/api/aps/workStation'
// console.info("xxx: ",uc.urlPrefix)
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

      brandNameList: [],
      goodsList: [],
      selectBomList: [],
      workStationList: [],
      factoryList: [],
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
        goodsId: undefined,
        groupId: undefined,
        bomId: undefined,
        bomCode: undefined,
        bomName: undefined,
        bomUsage: undefined,
        bomUnit: undefined,
        bomCostPrice: undefined,
        bomCostPriceUnit: undefined,
        bomUseWorkStation: undefined,
        bomUseExpression: undefined,
        bomInventory: undefined,
        isFollow: undefined,
        factoryId: undefined,
        id: undefined
      },
      // 表单校验
      rules: {
        goodsId: [{ required: true, message: '不能为空', trigger: 'blur' }],
        groupId: [{ required: true, message: '不能为空', trigger: 'blur' }],
        bomId: [{ required: true, message: '不能为空', trigger: 'blur' }],
        bomCode: [{ required: true, message: '不能为空', trigger: 'blur' }],
        bomName: [{ required: true, message: '不能为空', trigger: 'blur' }],
        bomUsage: [{ required: true, message: '不能为空', trigger: 'blur' }],
        bomUnit: [{ required: true, message: '不能为空', trigger: 'blur' }],
        bomCostPrice: [{ required: true, message: '不能为空', trigger: 'blur' }],
        bomCostPriceUnit: [{ required: true, message: '不能为空', trigger: 'blur' }],
        bomUseWorkStation: [{ required: true, message: '不能为空', trigger: 'blur' }],
        bomUseExpression: [{ required: true, message: '不能为空', trigger: 'blur' }],
        bomInventory: [{ required: true, message: '不能为空', trigger: 'blur' }],
        isFollow: [{ required: true, message: '请选择', trigger: 'change' }],
        factoryId: [{ required: true, message: '请选择', trigger: 'change' }]

      },
      tableHeaderList: []
    }
  },
  created() {
    document['pagePath'] = '/apsGoodsBom'
    // process.env.pagePath = "/tenant"
    this.getList()
    getFactoryList({ queryPage: false }).then(data => {
      this.factoryList = data.data.dataList
      // console.info("factoryList: ", this.factoryList);
    })
    getGoodsList({ queryPage: false }).then(data => {
      this.goodsList = data.data.dataList
      //console.info("goodsList: ", this.goodsList);
    })
    getWorkStationList({ queryPage: false }).then(data => {
      this.workStationList = data.data.dataList
      //  console.info("workStationList: ", this.workStationList);
    })
    this.selectBomListFun('')
  },
  methods: {
    /** 查询公告列表 */
    getList() {
      this.loading = true
      queryPageList(this.queryParams).then(response => {
        response = response.data
        this.tableHeaderList = response.headerList
        this.brandNameList = response.dataList
        this.total = parseInt(response.total)
        this.loading = false
      })
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
      this.form.id = undefined
    },
    // 表单重置
    reset() {
      this.form = {
        goodsId: undefined,
        groupId: undefined,
        bomId: undefined,
        bomCode: undefined,
        bomName: undefined,
        bomUsage: undefined,
        bomUnit: undefined,
        bomCostPrice: undefined,
        bomCostPriceUnit: undefined,
        bomUseWorkStation: undefined,
        bomUseExpression: undefined,
        bomInventory: undefined,
        isFollow: false,
        factoryId: undefined,
        id: undefined
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
      this.form.id = undefined
      this.open = true
      this.title = '添加商品零件'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      this.form.id = undefined
      let req = { idList: [row.id], pageSize: 1, pageNum: 1 }
      getById(req).then(response => {
        this.form = response.data.dataList[0]
        this.open = true
        this.title = '修改加商品零件'
      })

    },
    /** 提交按钮 */
    submitForm: function() {
      this.checkBomUseExpression(0).then(check => {
        if (!check) {
          return
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
    selectBomListFun(v) {
      if (v.length === '') {
        this.selectBomList = []
      }
      queryUrlPageList('/apsBom', { queryPage: false, data: { bomName: v } }).then(t => {
        this.selectBomList = t.data.dataList
      })
    },
    bomChange(v) {
      console.info('v: ', v)
      this.selectBomList.filter(t => t.id === v).forEach(t => {
        console.info('t: ', t)
        this.form.bomId = v
        this.form.bomName = t.bomName
        this.form.bomCode = t.bomCode
        this.form.bomCostPriceUnit = t.bomCostPriceUnit
        this.form.bomUnit = t.bomCostPriceUnit
        this.form.bomCostPrice = t.bomCostPrice
      })
    },
    checkBomUseExpression(type) {
      this.$refs.bomUseExpression.$el.classList.remove('is-error')
      return post('/apsGoodsBom/check/bomUseExpression', { bomUseExpression: this.form.bomUseExpression }, false).then(t => {
        if (t.data?.isSuccess) {
          if (type === 1) {
            this.$message.success('检查通过')
          }
          return true
        }
        // console.log(this.$refs.bomUseExpression)
        this.$refs.bomUseExpression.$el.classList.add('is-error')
        this.$refs.bomUseExpression.$el.focus()
        return false
      })
    }
  }
}
</script>
