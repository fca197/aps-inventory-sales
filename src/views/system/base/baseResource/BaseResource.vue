<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryForm" :inline="true" :model="queryParams" label-width="88px" size="small">
      <el-form-item label="菜单编码" prop="resourceCode">
        <el-input v-model="queryParams.data.resourceCode" clearable placeholder="请输入菜单编码" @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="菜单名称" prop="resourceName">
        <el-input v-model="queryParams.data.resourceName" clearable placeholder="请输入菜单名称" @keyup.enter.native="handleQuery"/>
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
          ref="tree"
        >
           <span class="custom-tree-node" slot-scope="{ node, data }">
        <span style="margin-right: 30px">{{ node.label }}  </span>
            <span v-if='node.parentId==="0"'>
                 <el-button
                   type="text"
                   size="mini"
                   @click="() => handleUpdate(data)"
                 >
              添加
          </el-button>

            </span>
        <span>
          <el-button
            type="text"
            size="mini"
            @click="() => handleUpdate(data)"
          >
              修改
          </el-button>
          <el-button
            type="text"
            size="mini"
            @click="() => handleDelete(node, data)"
          >
            删除
          </el-button>
        </span>
      </span>
        </el-tree>
      </el-tab-pane>
      <el-tab-pane label="表格显示">
        <el-table v-loading="loading" :data="baseResourceList" @selection-change="handleSelectionChange">
          <el-table-column align="center" label="全选" prop="id" type="selection" width="50"/>
          <el-table-column v-for="(item,index) in  tableHeaderList" :key="index" :label="item.showName" :prop="item.fieldName" align="center" :width="item.width+'px'"/>
          <!--          <el-table-column align="center" class-name="small-padding fixed-width" label="操作">-->
          <!--            <template slot-scope="scope">-->
          <!--              <el-button icon="el-icon-edit" size="mini" type="text" @click="handleUpdate()">修改</el-button>-->
          <!--              <el-button icon="el-icon-delete" size="mini" type="text" @click="handleDelete()">删除</el-button>-->
          <!--            </template>-->
          <!--          </el-table-column>-->
        </el-table>
        <pagination
          v-show="total>0"
          :limit.sync="queryParams.pageSize"
          :page.sync="queryParams.pageNum"
          :total="total"
          @pagination="getList"
        />
      </el-tab-pane>

    </el-tabs>


    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" append-to-body width="500px">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">

        <el-form-item label="菜单编码" prop="resourceCode">
          <el-input v-model="form.resourceCode" clearable placeholder="请输入菜单编码"/>
        </el-form-item>
        <el-form-item label="菜单名称" prop="resourceName">
          <el-input v-model="form.resourceName" clearable placeholder="请输入菜单名称"/>
        </el-form-item>
        <el-form-item label="菜单URL" prop="resourceUrl">
          <el-input v-model="form.resourceUrl" clearable placeholder="请输入菜单URL"/>
        </el-form-item>
        <el-form-item label="是否按钮" prop="isButton">
          <el-select v-model="form.isButton" placeholder="请选择">
            <el-option
              v-for="item in [{id:false,name:'否'},{id:true,name:'是'}]"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="父菜单" prop="parentId">
          <el-select v-model="form.parentId" placeholder="请选择" filterable>
            <el-option
              v-for="item in baseResourceList"
              :key="item.id"
              :label="item.resourceName"
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

import { add, deleteByIdList, getById, queryPageList, updateById } from '@/api/common'
import { handleTree } from '@/utils/ruoyi'

export default {
  name: 'tenantName',
  watch: {
    appNameFilterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  data() {

    return {
      appNameFilterText: '',
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
      baseResourceList: [],
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
        data: {}
      },
      // 表单参数
      form: {
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
      tableHeaderList: []
    }
  },
  created() {
    document['pagePath'] = '/baseResource'
    this.getList()
  },
  methods: {
    /** 查询公告列表 */
    getList() {
      this.loading = true
      queryPageList(this.queryParams).then(response => {
        response = response.data
        this.tableHeaderList = response.headerList
        this.baseResourceList = response.dataList
        this.total = parseInt(response.total)
        this.baseResourceList.unshift({
          id:0,
          resourceCode:'-',
          resourceUrl:'-',
          resourceName: '顶级',
        })
        this.baseResourceList.forEach(item => {
          item.treeName = item.resourceName + '(' + item.resourceCode + ')' + item.id + '(' + item.resourceUrl
        })
        this.baseAppResourceTree = handleTree(this.baseResourceList, 'id', 'parentId')
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
      this.reset();
 this.form.id=undefined;
    this.title = '添加资源'
      this.open = true
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
 this.form.id=undefined;
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
      if (!value) return true
      return data.treeName.indexOf(value) !== -1
    }
  }

}


</script>

