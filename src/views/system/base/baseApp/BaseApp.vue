<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryForm" :inline="true" :model="queryParams" label-width="88px" size="small">
      <el-form-item label="app编码" prop="appCode">
        <el-input v-model="queryParams.data.appCode" clearable placeholder="请输入app编码" @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="app名称" prop="appName">
        <el-input v-model="queryParams.data.appName" clearable placeholder="请输入app名称" @keyup.enter.native="handleQuery"/>
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

    <el-table v-loading="loading" :data="baseAppList" @selection-change="handleSelectionChange">
      <el-table-column align="center" label="全选" prop="id" type="selection" width="50"/>
      <el-table-column v-for="(item,index) in  tableHeaderList" :key="index" :label="item.showName" :prop="item.fieldName" align="center" :width="item.width+'px'"/>
      <el-table-column align="center" class-name="small-padding fixed-width" label="操作">
        <template slot-scope="scope">
          <el-button icon="el-icon-edit" size="mini" type="text" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button icon="el-icon-delete" size="mini" type="text" @click="handleDelete(scope.row)">删除</el-button>
          <el-button icon="el-icon-menu" size="mini" type="text" @click="handleMenu(scope.row)">菜单</el-button>
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
    <el-dialog :title="title" :visible.sync="open" append-to-body width="500px">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">

        <el-form-item label="app编码" prop="appCode">
          <el-input v-model="form.appCode" clearable placeholder="请输入app编码"/>
        </el-form-item>
        <el-form-item label="app名称" prop="appName">
          <el-input v-model="form.appName" clearable placeholder="请输入app名称"/>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="title" :visible.sync="menuOpen" append-to-body width="700px">
      <el-tree
          :default-checked-keys="baseAppResourceIdList"
          v-model="baseAppResourceIdList"
          :data="baseAppResourceTree"
          node-key="id"
          default-expand-all
          :props="{
            label: 'treeName',
            children: 'children'
            } "
          show-checkbox
          ref="tree"
      />
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitAppForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>


<script>

import { add, deleteByIdList, getById, post, queryPageList, queryUrlNoPageList, queryUrlPageList, updateById } from '@/api/common'
import { handleTree } from '@/utils/ruoyi'

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
      baseAppList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      menuOpen: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        data: {}
      },
      // 表单参数
      form: {
        appCode: undefined,
        appName: undefined,
        id: undefined
      },
      // 表单校验
      rules: {},
      tableHeaderList: [],

      baseAppResourceTree: [],
      baseAppResourceIdList: [],
      baseAppId: undefined
    }
  },
  created() {
    document['pagePath'] = '/baseApp'
    this.getList()
  },
  methods: {
    /** 查询公告列表 */
    getList() {
      this.loading = true
      queryPageList(this.queryParams).then(response => {
        response = response.data
        this.tableHeaderList = response.headerList
        this.baseAppList = response.dataList
        this.total = parseInt(response.total)
        this.loading = false
      })
    },
    cancel() {
      this.menuOpen = false
      this.open = false
      this.reset();
 this.form.id=undefined;
  },
    // 表单重置
    reset() {
      let fid = this.form.id
      this.form = {
        appCode: undefined,
        appName: undefined,
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
    this.title = '添加应用'
      this.open = true
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
 this.form.id=undefined;
    let req = { idList: [row.id], pageSize: 1, pageNum: 1 }
      getById(req).then(response => {
        this.form = response.data.dataList[0]
        this.title = '修改应用'
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
    handleMenu(row) {
      this.baseAppId=row.id;
      Promise.all([queryUrlNoPageList('/baseResource'), queryUrlPageList('/baseAppResource', { queryPage: false, data: { appId: row.id } })])
      .then(vl => {
        let baseResource = vl[0]
        let ll = []
        baseResource.data.dataList.forEach(item => {
          item.treeName = item.resourceName + '(' + item.resourceCode + ')' + '(' + item.id + ')'
          ll.push(item)
        })
        this.baseAppResourceTree = handleTree(ll, 'id', 'parentId')
        this.title = row.appName + '菜单'
        this.menuOpen = true
        let rl = vl[1].data.dataList.map(item => item.resourceId)
        let rlt = []
        rl.forEach(r => {
          let length = baseResource.data.dataList.filter(item => item.parentId === r).length
          if (length === 0) {
            rlt.push(r)
          }
        })
        this.baseAppResourceIdList = rlt
      })
    },
    submitAppForm(){
      console.log(this.baseAppResourceIdList,this.baseAppId)

      let checkedKeys = this.$refs.tree.getCheckedKeys();
      // 半选中的部门节点
      let halfCheckedKeys = this.$refs.tree.getHalfCheckedKeys();
      checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
      post("/baseAppResource/insertList",{appId:this.baseAppId,appResourceIdList:checkedKeys}).then(()=>this.cancel())
    }

  }

}


</script>

