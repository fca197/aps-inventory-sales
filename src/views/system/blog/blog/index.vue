<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryForm" :inline="true" :model="queryParams" label-width="88px" size="small">

      <el-form-item label="博客名称" prop="brandName">
        <el-input v-model="queryParams.data.postsName" clearable placeholder="博客名称" @keyup.enter.native="handleQuery"/>
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

      <el-col :span="3">
        <item-select :item-list="groupDataList" :click-fun="getList" :obj="queryParams.data"></item-select>
      </el-col>
      <el-col :span="21">

        <el-table v-loading="loading" :data="tableList" @selection-change="handleSelectionChange">

          <el-table-column align="center" label="全选" prop="id" type="selection" width="50"/>


          <el-table-column v-for="(item,index) in  tableHeaderList" :key="index" :label="item.showName" :prop="item.fieldName" align="center" width="180px"/>

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
      </el-col>

    </el-row>
    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" append-to-body width="1500px">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">

        <el-form-item label="博客组" prop="statusCode">
          <el-select v-model="form.postsGroupId" placeholder="请选择博客组" style="width: 100%">
            <el-option v-for="item in groupDataList" :key="item.id" :label="item.name" :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="博客编码" prop="blogPostsName">
          <el-input v-model="form.postsCode" placeholder="请输入编码"/>
        </el-form-item>
        <el-form-item label="博客名称" prop="blogPostsName">
          <el-input v-model="form.postsName" placeholder="请输入名称"/>
        </el-form-item>
        <el-form-item label="博客标签" prop="postsTags">
          <el-input v-model="form.postsTags" placeholder="请输入标签"/>
        </el-form-item>
        <el-form-item label="阅读量" prop="postsTags">
          <el-input v-model="form.readNumber" placeholder="请输入阅读量"/>
        </el-form-item>
        <el-form-item label="是否置顶" prop="isTop">
          <el-radio-group v-model="form.isTop">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="博客内容" prop="isRecommend">

          <editor :init="editInit" v-model="form.postsContent" :height="400">
          </editor>
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

import { add, deleteByIdList, getById, queryPageList, queryUrlPageList, updateById } from '@/api/common'
// console.info("xxx: ",uc.urlPrefix)
import ItemSelect from '@/views/components/ItemSelect/index.vue'

export default {
  name: 'tenantName',
  components: {
    ItemSelect
  },
  data() {

    return {

      editInit: {

        language: 'zh_CN',
        height: 500,
        width: 1200,
        plugins: [],
        toolbar: [],
        branding: true,
        menubar: true,
        //此处为图片上传处理函数，这个直接用了base64的图片形式上传图片，
        //如需ajax上传可参考https://www.tiny.cloud/docs/configure/file-image-upload/#images_upload_handler
        images_upload_handler: (blobInfo, success, failure) => {
          const img = 'data:image/jpeg;base64,' + blobInfo.base64()
          success(img)
        },
        resize: true
      },
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

      tableHeaderList: [],
      tableList: [],
      factoryList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        data: {
          postsGroupId: undefined
        }
      },
      // 表单参数
      form: {
        isTop: 0,
        readNumber: 0,
        id: undefined
      },
      // 表单校验
      rules: {},
      groupDataList: []
    }
  },
  created() {
    document['pagePath'] = '/blogPosts'
    // process.env.pagePath = "/tenant"

    queryUrlPageList('/blogGroup', { queryPage: false })
    .then(t => {
      this.groupDataList = []
      this.groupDataList.push({ id: undefined, groupName: '全部' })
      this.groupDataList = this.groupDataList.concat(t.data.dataList)
      this.groupDataList.forEach(t3 => {
        t3.name = t3.groupName
      })
    })

    this.getList()

  },
  methods: {
    /** 查询公告列表 */
    getList() {
      this.loading = true
      queryPageList(this.queryParams).then(response => {
        response = response.data
        this.tableHeaderList = response.headerList
        this.tableList = response.dataList
        this.total = parseInt(response.total)
        this.loading = false
      })
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        isTop: 0,
        readNumber: 0,
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
      this.open = true
      this.title = '添加博客'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      let req = { idList: [row.id], pageSize: 1, pageNum: 1 }
      getById(req).then(response => {
        this.form = response.data.dataList[0]
        this.open = true
        this.title = '修改博客'
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
    }
  }
}
</script>

