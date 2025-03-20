<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryForm" :inline="true" :model="queryParams" label-width="88px" size="small">

      <el-form-item label="零件名称" prop="brandName">
        <el-input v-model="queryParams.data.bomName" clearable placeholder="请输入零件名称" @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="购买方式" prop="supplyMode">
        <el-select v-model="queryParams.data.supplyMode" clearable>
          <el-option v-for="(sm) in supplyModeList" :value="sm.val" :key="sm.name" :label="sm.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" size="mini" type="primary" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button icon="el-icon-plus" plain size="mini" type="primary" @click="handleAdd"></el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button icon="el-icon-upload" plain size="mini" type="primary" @click="uploadBomOpen=true"></el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button :disabled="multiple" icon="el-icon-delete" plain size="mini" type="danger" @click="handleDelete"></el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-row>
      <el-col :span="3" style="border: 1px solid #ccc;">
        <el-tree
          style="margin: 10px 5px;height: 600px"
          class="filter-tree"
          :data="groupData"
          default-expand-all
          @node-click="bomGroupClick"
          :props="{ children: 'children',label: 'groupName'}"
          ref="tree"
        >
        </el-tree>

      </el-col>
      <el-col :span="21">
        <el-table v-loading="loading" :data="brandNameList" @selection-change="handleSelectionChange">

          <el-table-column align="center" label="全选" prop="id" type="selection" width="50"/>

          <el-table-column v-for="(item,index) in  tableHeaderList" :key="index" :label="item.showName" :prop="item.fieldName" align="center" width="180px"/>
          <el-table-column align="center" class-name="small-padding fixed-width" label="操作" fixed="right" width="150">
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

      </el-col>

    </el-row>
    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" append-to-body width="700px">
      <el-form ref="form" :model="form" :rules="rules" label-width="130px">

        <el-form-item label="零件名称" prop="bomName">
          <el-input v-model="form.bomName" placeholder="请输入名称" clearable @blur="loadSzm"/>
        </el-form-item>
        <el-form-item label="零件编号" prop="bomCode">
          <el-input v-model="form.bomCode" placeholder="请输入编号" clearable/>
        </el-form-item>
        <el-form-item label="零件价格" prop="bomCostPrice">
          <el-input v-model="form.bomCostPrice" placeholder="请输入价格"/>
        </el-form-item>
        <el-form-item label="价格规格" prop="bomCostPriceUnit">
          <el-input v-model="form.bomCostPriceUnit" placeholder="请输入价格规格如:  45元/瓶" />
        </el-form-item>

        <el-form-item label="库存" prop="bomInventory">
          <el-input v-model="form.bomInventory" placeholder="请输入库存如： 123.909" />
        </el-form-item>
        <el-form-item label="购买方式" prop="supplyMode">
          <el-select v-model="form.supplyMode">
            <el-option v-for="(sm) in supplyModeList" :value="sm.val" :key="sm.val" :label="sm.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="规格" prop="bomUnit">
          <el-input v-model="form.bomUnit" placeholder="请输入规格如： 550ML"/>
        </el-form-item>
        <el-form-item label="使用规格" prop="useUnit">
          <el-input v-model="form.useUnit" placeholder="请输入使用规格如：10ML "/>
        </el-form-item>
        <el-form-item label="供货周期(天)" prop="deliveryCycleDay">
          <el-input v-model.number="form.deliveryCycleDay" placeholder="请输入供货周期 如： 1"/>
        </el-form-item>
        <el-form-item label="制造路径" v-show="form.supplyMode==='make'" prop="apsBomSupplierId">
          <el-select v-model="form.produceProcessId">
            <el-option v-for="(p,i) in produceProcessList"   :key="p.id" :value="p.id" :label="p.produceProcessName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="供应商" v-show="form.supplyMode==='buy'" prop="apsBomSupplierId">
          <el-select v-model="form.apsBomSupplierId">
            <el-option v-for="(p,i) in apsBomSupplierList"  :key="p.id" :value="p.id" :label="p.bomSupplierName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="零件组" prop="groupId">
          <tree-select  ref="treeSelect" :list="groupData.filter(t=>t.id!=='0')" :multiple="false" :clearable="true" :checkStrictly="true" width="120px" v-model="form.groupId"
          ></tree-select>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="上传零件" :visible.sync="uploadBomOpen" append-to-body width="500px">
      <el-form>
        <el-form-item label="模板下载">
          <el-button icon="el-icon-download" size="mini" @click="downloadUploadTemplate"> 下载</el-button>
        </el-form-item>
        <el-form-item label="文件上传">
          <file-upload :fileType="['xlsx']" :file-upload-success="fileUploadSuccess" upload-url="/apsBom/importData" :value="form.fileId"></file-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import { add, deleteByIdList, getById, log, pinyin4jSzm, queryPageList, queryUrlNoPageList, updateById } from '@/api/common'
import { queryBomGroupTree } from '@/api/aps/apsGroup'
import bomGroup from '@/views/system/aps/bomGroup/index.vue'
import treeSelect from '@/views/components/treeSelect/index.vue'
import FileUpload from '@/components/FileUpload/index.vue'
import { downloadForm } from '@/utils/request'
// console.info("xxx: ",uc.urlPrefix)
export default {
  name: 'tenantName',
  components: { treeSelect, FileUpload },
  computed: {
    bomGroup() {
      return bomGroup
    }
  },
  data() {

    return {
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      // 遮罩层
      loading: true,
      uploadBomOpen: false,
      // 选中数组
      ids: [],
      groupData: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: false,
      // 总条数
      total: 0,
      filterGroupName: '',
      brandNameList: [],
      produceProcessList: [],
      apsBomSupplierList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        data: {
          bomCode :undefined,
          bomName :undefined,
          bomCostPrice :undefined,
          bomCostPriceUnit :undefined,
          bomInventory :undefined,
          groupId :undefined,
          supplyMode :undefined,
          useUnit :undefined,
          bomUnit :undefined,
          produceProcessId :undefined,
          deliveryCycleDay :undefined,
          apsBomSupplierId :undefined,
          id: undefined
        }
      },
      // 表单参数
      form: {
        bomCode :undefined,
        bomName :undefined,
        bomCostPrice :undefined,
        bomCostPriceUnit :undefined,
        bomInventory :undefined,
        groupId :undefined,
        supplyMode :undefined,
        useUnit :undefined,
        bomUnit :undefined,
        produceProcessId :undefined,
        deliveryCycleDay :undefined,
        apsBomSupplierId :undefined,
        id: undefined
      },
      // 表单校验
      rules: {
        bomCode :[{required: true, message: "不能为空", trigger: "blur"},{ min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }],
        bomName :[{required: true, message: "不能为空", trigger: "blur"},{ min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }],
        bomCostPrice :[{required: true, message: "不能为空", trigger: "blur"}],
        bomCostPriceUnit :[{required: true, message: "不能为空", trigger: "blur"},{ min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }],
        bomInventory :[{required: true, message: "不能为空", trigger: "blur"}],
        groupId :[{required: true, message: "不能为空", trigger: "blur"}],
        supplyMode :[{required: true, message: "不能为空", trigger: "blur"},{ min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }],
        useUnit :[{required: true, message: "不能为空", trigger: "blur"},{ min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }],
        bomUnit :[{required: true, message: "不能为空", trigger: "blur"},{ min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }],
        produceProcessId :[{required: true, message: "不能为空", trigger: "blur"}],

      },
      tableHeaderList: [],
      supplyModeList: [
        { val: 'buy', name: '购买' },
        { val: 'make', name: '自制' }
      ]
    }
  },
  created() {
    document['pagePath'] = '/apsBom'
    queryUrlNoPageList('apsProduceProcess').then(t=>this.produceProcessList=t.data.dataList)
    queryUrlNoPageList('apsBomSupplier').then(t=>this.apsBomSupplierList=t.data.dataList)
    // process.env.pagePath = "/tenant"
    queryBomGroupTree(false).then(t => {
      this.groupData = []
      let tt = {
        parentId: undefined,
        id: undefined,
        groupName: '全部',
        name: '全部'
      }
      this.groupData.push(tt)
      for (let i = 0; i < t.length; i++) {
        this.groupData.push(t[i])
      }
      // console.info('groupData: ', this.groupData)
    }).then(t => {
      this.getList()
    })

  },
  methods: {
    bomGroupClick(data) {
      this.queryParams.data.groupId = data.id
      this.getList()
    },
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
      this.uploadBomOpen = false
      this.reset();
       this.form.id=undefined;
  },
    // 表单重置
    reset() {
      this.form = {
        bomCode :undefined,
        bomName :undefined,
        bomCostPrice :undefined,
        bomCostPriceUnit :undefined,
        bomInventory :undefined,
        groupId :undefined,
        supplyMode :undefined,
        useUnit :undefined,
        bomUnit :undefined,
        produceProcessId :undefined,
        deliveryCycleDay :undefined,
        apsBomSupplierId :undefined,
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
      this.reset();
 this.form.id=undefined;
    this.open = true
      this.title = '添加零件'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
 this.form.id=undefined;
    let req = { idList: [row.id], pageSize: 1, pageNum: 1 }
      getById(req).then(response => {
        this.form = response.data.dataList[0]
        this.open = true
        this.title = '修改零件'
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
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    fileUploadSuccess(res) {
      log(res)
      this.cancel();
    },
    downloadUploadTemplate(){
      downloadForm("/apsBom/exportQueryPageList",{data:{id:-1}},"零件模板.xlsx",{})
    },
    loadSzm(){
      pinyin4jSzm(this.form.bomName,(r)=>{
        this.form.bomCode=r.szmUpper;
        this.$forceUpdate()
      })
    }
  }
}
</script>
