<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryForm" :inline="true" :model="queryParams" label-width="88px" size="small">
      <el-form-item label="应用ID" prop="appId">
        <!--        <el-input v-model="queryParams.data.appId" clearable placeholder="请输入应用ID" @keyup.enter.native="handleQuery"/>-->
        <el-select v-model="queryParams.data.appId" placeholder="请选择应用ID" @change="handleQuery">
          <el-option v-for="item in appList" :key="item.id" :label="item.appName" :value="item.id"></el-option>
        </el-select>
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

    <el-tabs>
      <el-tab-pane label="表格显示">
        <el-table v-loading="loading" :data="baseAppResourceList" @selection-change="handleSelectionChange">
          <el-table-column align="center" label="全选" prop="id" type="selection" width="50"/>
          <el-table-column v-for="(item,index) in  tableHeaderList" :key="index" :label="item.showName" :prop="item.fieldName" align="center" :width="item.width+'px'"/>
          <el-table-column align="center" class-name="small-padding fixed-width" label="操作">
            <template slot-scope="scope">
              <el-button icon="el-icon-edit" size="mini" type="text" @click="handleUpdate(scope.row)">修改</el-button>
              <el-button icon="el-icon-delete" size="mini" type="text" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="树形显示">
        <el-input
            placeholder="输入关键字进行过滤"
            v-model="appNameFilterText"
        >
        </el-input>
        <el-tree
            :data="baseAppResourceTree"
            node-key="id"
            default-expand-all
            :props="{
            label: 'treeName',
            children: 'children'
            } "
            :filter-node-method="filterNode"
            ref="tree">
        </el-tree>


      </el-tab-pane>
    </el-tabs>

    <pagination
        v-show="total>0"
        :limit.sync="queryParams.pageSize"
        :page.sync="queryParams.pageNum"
        :total="total"
        @pagination="getList"
    />

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" append-to-body width="700px">
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">

        <el-form-item label="应用ID" prop="appId">
          <!--          <el-input v-model="form.appId" clearable placeholder="请输入应用ID"/>-->
          <el-select v-model="form.appId" placeholder="请选择应用ID">
            <el-option v-for="item in appList" :key="item.id" :label="item.appName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <!--        <el-form-item label="应用编码" prop="appCode">-->
        <!--          <el-input v-model="form.appCode" clearable placeholder="请输入应用编码"/>-->
        <!--        </el-form-item>-->
        <el-form-item label="菜单编码" prop="resourceCode">
          <el-input v-model="form.resourceCode" clearable placeholder="请输入菜单编码"/>
        </el-form-item>
        <el-form-item label="菜单名称" prop="resourceName">
          <el-input v-model="form.resourceName" clearable placeholder="请输入菜单名称"/>
        </el-form-item>
        <el-form-item label="菜单URL" prop="resourceUrl">
          <el-input v-model="form.resourceUrl" clearable placeholder="请输入菜单URL"/>
        </el-form-item>
        <!--        <el-form-item label="菜单图标" prop="resourceIcon">-->
        <!--          <el-input v-model="form.resourceIcon" clearable placeholder="请输入菜单图标"/>-->
        <!--        </el-form-item>-->
        <!--        <el-form-item label="菜单类型" prop="resourceType">-->
        <!--          <el-input v-model="form.resourceType" clearable placeholder="请输入菜单类型"/>-->
        <!--        </el-form-item>-->
        <el-form-item label="是否按钮" prop="isButton">
          <el-select v-model="form.isButton" placeholder="请选择是否按钮">
            <el-option label="否" :value="false"></el-option>
            <el-option label="是" :value="true"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="父菜单ID" prop="parentId">
          <!--          <el-input v-model="form.parentId" clearable placeholder="请输入父菜单ID"/>-->
          <el-select v-model="form.parentId" placeholder="请选择父菜单ID" filterable>
            <el-option label="顶层" value="0"></el-option>
            <el-option v-for="item in baseAppResourceList" :key="item.id" :label="item.resourceName" :value="item.id"></el-option>
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

import { add, deleteByIdList, getById, queryPageList, queryUrlNoPageList, updateById } from '@/api/common'
import { handleTree } from '@/utils/ruoyi'

export default {
  name: 'tenantName',
  watch: {
    appNameFilterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  data() {

    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      appList: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      baseAppResourceList: [],
      baseAppResourceTree: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        queryPage: false,
        pageNum: 1,
        pageSize: 10,
        appId: undefined,
        data: {
          appId: undefined
        }
      },
      // 表单参数
      form: {
        appId: undefined,
        appCode: undefined,
        resourceCode: undefined,
        resourceName: undefined,
        resourceUrl: undefined,
        resourceIcon: undefined,
        resourceType: undefined,
        isButton: undefined,
        parentId: undefined,
        path: undefined,
        id: undefined
      },
      // 表单校验
      rules: {},
      tableHeaderList: [],
      appNameFilterText:""
    }
  },
  created() {
    document['pagePath'] = '/baseAppResource'
    queryUrlNoPageList('/baseApp').then(t => {
      this.appList = t.data.dataList
      this.queryParams.data.appId = t.data.dataList[0].id
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
        this.baseAppResourceList = response.dataList
        this.baseAppResourceList.forEach(item => {
          item.treeName = item.resourceName + '(' + item.resourceCode + ')' + item.id
        })
        this.baseAppResourceTree = handleTree(this.baseAppResourceList, 'id', 'parentId')
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
        appId: undefined,
        appCode: undefined,
        resourceCode: undefined,
        resourceName: undefined,
        resourceUrl: undefined,
        resourceIcon: undefined,
        resourceType: undefined,
        isButton: undefined,
        parentId: undefined,
        path: undefined,
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
      this.title = '添加资源'
      this.open = true
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      let req = { idList: [row.id], pageSize: 1, pageNum: 1 }
      getById(req).then(response => {
        this.form = response.data.dataList[0]
        this.title = '修改资源'
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
    filterNode(value, data) {
      if (!value) return true;
      return data.treeName.indexOf(value) !== -1;
    }
  }

}


</script>

