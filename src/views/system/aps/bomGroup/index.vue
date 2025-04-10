<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryForm" :inline="true" :model="queryParams" label-width="88px" size="small">

      <el-form-item label="零件组名称" prop="brandName">
        <el-input v-model="queryParams.data.groupName" clearable placeholder="请输入零件组名称" @keyup.enter.native="handleQuery"/>
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
        <el-button :disabled="multiple" icon="el-icon-delete" plain size="mini" type="danger" @click="handleDelete"></el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-row>
      <el-table v-loading="loading" :data="brandNameList" @selection-change="handleSelectionChange">

        <el-table-column align="center" label="全选" prop="id" type="selection" width="50"/>

        <el-table-column v-for="(item,index) in  tableHeaderList" :key="index" :label="item.showName" :prop="item.fieldName" align="center" width="180px"/>
        <el-table-column align="center" class-name="small-padding fixed-width" label="操作" fixed="right">
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


    </el-row>
    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" append-to-body width="500px">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="零件组名称" prop="groupName">
          <el-input v-model="form.groupName" placeholder="请输入名称" clearable @blur="loadSzm"/>
        </el-form-item>
        <el-form-item label="零件组编号" prop="groupCode">
          <el-input v-model="form.groupCode" placeholder="请输入编号"/>
        </el-form-item>

        <el-form-item label="上级" prop="parentId">

          <el-select ref="treeSelect" v-model="form.parentId" filterable>
            <el-option v-for="(it ) in bomGroupList" :label="it.groupName"   :value="it.id"></el-option>
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

import { add, deleteByIdList, getById, pinyin4jSzm, queryPageList, updateById } from '@/api/common'
import { queryBomGroupTree } from '@/api/aps/apsGroup'
import treeSelect from '@/views/components/treeSelect/index.vue'
// console.info("xxx: ",uc.urlPrefix)
// console.info("xxx: ",uc.urlPrefix)
export default {
  name: 'tenantName',
  components: { treeSelect },
  data() {

    return {
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      // 遮罩层
      loading: true,
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
        groupCode: undefined,
        groupName: undefined,
        parentId: undefined,
        pathId: undefined,
        id: undefined
      },
      // 表单校验
      rules: {
        groupCode: [{ required: true, message: '不能为空', trigger: 'blur' }, { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }],
        groupName: [{ required: true, message: '不能为空', trigger: 'blur' }, { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }],
        parentId: [{ required: true, message: '不能为空', trigger: 'blur' }, { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }]
      },
      tableHeaderList: [],
      bomGroupList: []
    }
  },
  created() {
    document['pagePath'] = '/apsBomGroup'
    // process.env.pagePath = "/tenant"

    this.getList()

  },
  methods: {
    parentIdClear() {
      this.form.parentId = 0
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
      this.reset()
      this.form.id = undefined
    },
    // 表单重置
    reset() {
      this.form = {
        groupCode: undefined,
        groupName: undefined,
        parentId: undefined,
        pathId: undefined,
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

      queryBomGroupTree(true).then(t => {
        this.bomGroupList.splice(0, this.bomGroupList.length)
        this.bomGroupList.push({
          id:0,
          groupCode: 0,
          groupName: '顶级'
        })
        this.bomGroupList = t
        console.log(this.bomGroupList)
      })

      this.reset()
      this.form.id = undefined
      this.open = true
      this.title = '添加零件组'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      this.form.id = undefined
      let req = { idList: [row.id], pageSize: 1, pageNum: 1 }
      getById(req).then(response => {
        this.form = response.data.dataList[0]
        this.open = true
        this.title = '修改零件组'
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
    loadSzm() {
      pinyin4jSzm(this.form.groupName, (r) => {
        this.form.groupCode = r.szmUpper
        this.$forceUpdate()
      })
    }
  }
}
</script>
