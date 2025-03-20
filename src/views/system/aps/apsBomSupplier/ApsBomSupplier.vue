<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryForm" :inline="true" :model="queryParams" label-width="88px" size="small">
      <el-form-item label="名称" prop="bomSupplierName">
        <el-input v-model="queryParams.data.bomSupplierName" clearable placeholder="请输入名称"
        />
      </el-form-item>
      <el-form-item label="编号" prop="bomSupplierCode">
        <el-input v-model="queryParams.data.bomSupplierCode" clearable placeholder="请输入编号"
        />
      </el-form-item>
      <el-form-item label="手机" prop="bomSupplierPhone">
        <el-input v-model="queryParams.data.bomSupplierPhone" clearable placeholder="请输入手机"
        />
      </el-form-item>
      <el-form-item label="省" prop="provinceCode">
        <el-select v-model="queryParams.data.provinceCode" clearable placeholder="请选择省">
          <el-option v-for="p in provinceCodeList" :label="p.name" :value="p.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="市" prop="cityCode">
        <el-select v-model="queryParams.data.cityCode" clearable>
          <el-option v-for="pc in cityCodeList" :value="pc.code" :label="pc.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="县" prop="areaCode">
        <el-select v-model="queryParams.data.areaCode" clearable>
          <el-option v-for="p in areaCodeList" :label="p.name" :value="p.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="地址" prop="bomSupplierAddr">
        <el-input v-model="queryParams.data.bomSupplierAddr" clearable placeholder="请输入地址"
        />
      </el-form-item>
      <el-form-item label="状态" prop="supplierStatus">
        <el-select v-model="queryParams.data.supplierStatus" clearable>
          <el-option :value="1" label="启用"></el-option>
          <el-option :value="0" label="禁用"></el-option>
        </el-select>
      </el-form-item>
      <el-button size="mini" @click="handleQuery" type="primary">查询</el-button>
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

    <el-table v-loading="loading" :data="apsBomSupplierList" @selection-change="handleSelectionChange">
      <el-table-column align="center" label="全选" prop="id" type="selection" width="50"/>
      <el-table-column v-for="(item,index) in  tableHeaderList" :key="index" :label="item.showName"
                       :prop="item.fieldName" :width="item.width+'px'" align="center"
      />
      <el-table-column align="center" class-name="small-padding fixed-width" label="操作" width="140px" fixed="right">
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
    <el-dialog :title="title" :visible.sync="open" append-to-body width="700px">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px" inline>

        <el-form-item label="名称" prop="bomSupplierName">
          <el-input v-model="form.bomSupplierName" clearable placeholder="请输入名称" @blur="loadSzm"/>
        </el-form-item>
        <el-form-item label="编号" prop="bomSupplierCode">
          <el-input v-model="form.bomSupplierCode" clearable placeholder="请输入编号"/>
        </el-form-item>
        <el-form-item label="手机" prop="bomSupplierPhone">
          <el-input v-model="form.bomSupplierPhone" clearable placeholder="请输入手机"/>
        </el-form-item>
        <el-form-item label="座机" prop="bomSupplierTel">
          <el-input v-model="form.bomSupplierTel" clearable placeholder="请输入座机"/>
        </el-form-item>
        <el-form-item label="邮件" prop="bomSupplierEmail">
          <el-input v-model="form.bomSupplierEmail" clearable placeholder="请输入邮件"/>
        </el-form-item>
        <el-form-item label="省" prop="provinceCode">
          <el-select v-model="form.provinceCode" clearable>
            <el-option v-for="p in provinceCodeList" :label="p.name" :value="p.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="市" prop="cityCode">
          <el-select v-model="form.cityCode" clearable>
            <el-option v-for="p in cityCodeList" :label="p.name" :value="p.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="县" prop="areaCode">
          <el-select v-model="form.areaCode" clearable>
            <el-option v-for="p in areaCodeList" :label="p.name" :value="p.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="地址" prop="bomSupplierAddr">
          <el-input v-model="form.bomSupplierAddr" clearable placeholder="请输入地址"/>
        </el-form-item>
        <el-form-item label="备注" prop="bomSupplierRemark">
          <el-input v-model="form.bomSupplierRemark" clearable placeholder="请输入备注"/>
        </el-form-item>
        <el-form-item label="状态" prop="supplierStatus">
          <el-select v-model="form.supplierStatus" clearable>
            <el-option :value="true" label="启用"></el-option>
            <el-option :value="false" label="禁用"></el-option>
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

import { deleteList, getById, getDistrictByParentCode, insetOrUpdate, pinyin4jSzm, queryPageList } from '@/api/common'

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
      apsBomSupplierList: [],
      provinceCodeList: [],
      cityCodeList: [],
      areaCodeList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        data: {
          bomSupplierName: undefined,
          bomSupplierCode: undefined,
          bomSupplierPhone: undefined,
          bomSupplierTel: undefined,
          bomSupplierEmail: undefined,
          provinceCode: undefined,
          cityCode: undefined,
          areaCode: undefined,
          bomSupplierAddr: undefined,
          bomSupplierRemark: undefined,
          supplierStatus: undefined,
          id: undefined
        }
      },
      // 表单参数
      form: {
        bomSupplierName: undefined,
        bomSupplierCode: undefined,
        bomSupplierPhone: undefined,
        bomSupplierTel: undefined,
        bomSupplierEmail: undefined,
        provinceCode: undefined,
        cityCode: undefined,
        areaCode: undefined,
        bomSupplierAddr: undefined,
        bomSupplierRemark: undefined,
        supplierStatus: undefined,
        id: undefined
      },
      // 表单校验
      rules: {
        bomSupplierName: [{ required: true, message: '不能为空', trigger: 'blur' }, {
          min: 5,
          max: 20,
          message: '长度在 5 到 20 个字符',
          trigger: 'blur'
        }],
        bomSupplierCode: [{ required: true, message: '不能为空', trigger: 'blur' }, {
          min: 5,
          max: 20,
          message: '长度在 5 到 20 个字符',
          trigger: 'blur'
        }],
        bomSupplierPhone: [{ required: true, message: '不能为空', trigger: 'blur' }, {
          min: 5,
          max: 20,
          message: '长度在 5 到 20 个字符',
          trigger: 'blur'
        }],
        // bomSupplierTel: [{ required: true, message: '不能为空', trigger: 'blur' }, {
        //   min: 5,
        //   max: 20,
        //   message: '长度在 5 到 20 个字符',
        //   trigger: 'blur'
        // }],
        // bomSupplierEmail: [{ required: true, message: '不能为空', trigger: 'blur' }, {
        //   min: 2,
        //   max: 120,
        //   message: '长度在 2 到 120 个字符',
        //   trigger: 'blur'
        // },
        //   {
        //    required: true,
        //     validator: (rule, value, callback) => {
        //       if (value === "") {
        //         callback(new Error("邮件地址不能为空"))
        //         return;
        //       }
        //       if (
        //         !/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(
        //           value
        //         )
        //       ) {
        //         callback(new Error("邮箱格式不正确"))
        //         return;
        //       }
        //       callback();
        //   },
        //   trigger:'blur'
        // }],
        provinceCode: [{ required: true, message: '必选', trigger: 'blur' } ],
        cityCode: [{ required: true, message: '必选', trigger: 'blur' } ],
        areaCode: [{ required: true, message: '必选', trigger: 'blur' }],
        bomSupplierAddr: [{ required: true, message: '必选', trigger: 'blur' }, {
          min: 5,
          max: 64,
          message: '长度在 5 到 64 个字符',
          trigger: 'blur'
        }],
        bomSupplierRemark: [{ required: true, message: '不能为空', trigger: 'blur' }, {
          min: 1,
          max: 120,
          message: '长度在 1 到 120 个字符',
          trigger: 'blur'
        }],
        supplierStatus: [{ required: true, message: '必选', trigger: 'blur' }]
      },
      tableHeaderList: []
    }
  },
  created() {
    document['pagePath'] = '/apsBomSupplier'
    this.getList()
    getDistrictByParentCode('0').then(t => this.provinceCodeList = t.data.dataList)
  },
  watch: {
    'queryParams.data.provinceCode': {
      handler:function(n, o) {
        this.loadCity(n)
      },
      deep: true
    },
    'form.provinceCode': function(n, o) {
      this.loadCity(n)
    },
    'queryParams.data.cityCode': {
      handler:function(n, o) {
        this.loadArea(n)
      },
      deep: true
    }, 'form.cityCode': function(n, o) {
      this.loadArea(n)
    }
  },
  methods: {
    loadCity(code) {
      this.cityCodeList.splice(0, this.cityCodeList.length)
      // this.queryParams.data.areaCode = this.form.areaCode = undefined
      // this.queryParams.data.cityCode = this.form.cityCode = undefined
      getDistrictByParentCode(code).then(t => this.cityCodeList = t.data.dataList)
    },
    loadArea(code) {
      // this.areaCodeList.splice(0, this.areaCodeList.length)
      // this.queryParams.data.areaCode = this.form.areaCode = undefined
      getDistrictByParentCode(code).then(t => this.areaCodeList = t.data.dataList)
    },
    /** 查询公告列表 */
    getList() {
      this.loading = true
      queryPageList(this.queryParams).then(response => {
        response = response.data
        this.tableHeaderList = response.headerList
        this.apsBomSupplierList = response.dataList
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
        bomSupplierName: undefined,
        bomSupplierCode: undefined,
        bomSupplierPhone: undefined,
        bomSupplierTel: undefined,
        bomSupplierEmail: undefined,
        provinceCode: undefined,
        cityCode: undefined,
        areaCode: undefined,
        bomSupplierAddr: undefined,
        bomSupplierRemark: undefined,
        supplierStatus: undefined,
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
 this.form.id=undefined;
    this.title = '添加供应商表'
      this.open = true
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
     this.form.id=undefined;
     let _this=this;
    let req = { idList: [row.id], pageSize: 1, pageNum: 1 }
      getById(req).then(response => {
        this.form = response.data.dataList[0]
        this.title = '修改供应商表'
        this.open = true
        // let cityCode = response.data.dataList[0]["cityCode"]
        // this.form.cityCode= cityCode;
        // console.info("_this.form.cityCode",this.form)
        // getDistrictByParentCode(cityCode).then(r=>  _this.areaCodeList=r.data.dataList)
      });

    },

    /** 提交按钮 */
    submitForm: function() {
      insetOrUpdate(this)
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      deleteList(row, this.ids, this.getList())
    },
    loadSzm(){
      pinyin4jSzm(this.form.bomSupplierName,(r)=>{
        this.form.bomSupplierCode=r.szmUpper;
        this.$forceUpdate();
      })
    }
  }

}


</script>

