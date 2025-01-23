<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryForm" :inline="true" :model="queryParams" label-width="88px" size="small">
      <el-form-item label="工厂" prop="factoryList">
        <el-select v-model="queryParams.data.factoryId" clearable placeholder="请选择工厂">
          <el-option v-for="item in factoryList" :key="item.id" :label="item.factoryName" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="工艺路径名称" prop="brandName">
        <el-input v-model="queryParams.data.processPathName" clearable placeholder="请输入工艺路径名称" @keyup.enter.native="handleQuery"/>
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

    <el-table v-loading="loading" :data="brandNameList" @selection-change="handleSelectionChange">

      <el-table-column align="center" label="全选" prop="id" type="selection" width="50"/>

      <el-table-column v-for="(item,index) in  tableHeaderList" :key="index" :label="item.showName" :prop="item.fieldName" :width="item.width" align="center"/>
      <el-table-column align="center" class-name="small-padding fixed-width" label="操作" fixed="right" >
        <template slot-scope="scope">
          <el-button icon="el-icon-edit" size="mini" type="text" @click="handleUpdate(scope.row)">修改</el-button>
<!--          <el-button icon="el-icon-delete" size="mini" type="text" @click="handleDelete(scope.row)">删除</el-button>-->
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
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="工厂" prop="factoryId">
          <el-select v-model="form.factoryId" placeholder="请选择工厂" @change="getRoomList">
            <el-option v-for="item in factoryList" :key="item.id" :label="item.factoryName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工艺路径编码" prop="processPathCode">
          <el-input v-model="form.processPathCode" placeholder="请输入工艺路径编码"/>
        </el-form-item>
        <el-form-item label="工艺路径名称" prop="processPathName">
          <el-input v-model="form.processPathName" placeholder="请输入工艺路径名称"/>
        </el-form-item>
        <el-form-item label="工艺路径车间" prop="roomList">
          <div v-for="(item,index) in form.pathRoomList" :span="12">
            <el-select v-model="item.roomId" clearable placeholder="请选择车间">
              <el-option v-for="item in roomList" :key="item.id" :label="item.roomName" :value="item.id"></el-option>
            </el-select>
            <el-button icon="el-icon-plus" size="mini" type="primary" @click="addRoom"></el-button>
            <el-button icon="el-icon-delete" size="mini" type="danger" @click="deleteRoom(index)"></el-button>

          </div>
        </el-form-item>
        <el-form-item label="工艺路径备注" prop="processPathRemark">
          <el-input v-model="form.processPathRemark" placeholder="请输入工艺路径备注"/>
        </el-form-item>
        <el-form-item label="默认" prop="isDefault">
          <el-radio-group v-model="form.isDefault">
            <el-radio :label="true" checked>是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
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

import { add, deleteByIdList, deleteList, getById, insetOrUpdate, queryPageList, updateById } from '@/api/common'
import {getFactoryList} from "@/api/factory";
import {getRoomList} from "@/api/aps/room";
// console.info("xxx: ",uc.urlPrefix)
export default {
  name: "tenantName",
  data() {

    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 工段
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: false,
      // 总条数
      total: 0,
      roomList: [],
      brandNameList: [],
      factoryList: [],
      // 弹出层标题
      title: "",
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
        isDefault: false,
        processPathRemark: "",
        pathRoomList: [],
        processPathName: "",
        remark: "",
        brandName: "",
        pwd: "",
        id: undefined,
        confirmPwd: undefined
      },
      // 表单校验
      rules: {
        isDefault:[{ required: true, message: '必选', trigger: 'blur' }],
        factoryId:[{ required: true, message: '不能为空', trigger: 'blur' }],
        processPathCode:[{ required: true, message: '不能为空', trigger: 'blur' }, { min: 4, max: 20, message: '长度在 4 到 20 个字符', trigger: 'blur' }],
        processPathName:[{ required: true, message: '不能为空', trigger: 'blur' }, { min: 4, max: 20, message: '长度在 4 到 20 个字符', trigger: 'blur' }],

      },
      tableHeaderList: [],
    };
  },
  created() {
    document["pagePath"] = "/apsProcessPath";
    // process.env.pagePath = "/tenant"
    this.getList();
    getFactoryList({queryPage:false}).then(data => {
      this.factoryList = data.data.dataList;
    });

  },
  methods: {
    /** 查询公告列表 */
    getList() {
      this.loading = true;
      queryPageList(this.queryParams).then(response => {
        response = response.data
        this.tableHeaderList = response.headerList
        this.brandNameList = response.dataList;
        this.total = parseInt(response.total);
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    getRoomList(factoryId) {

      getRoomList({queryPage:false, data: {factoryId: factoryId}}).then(data => {
        this.roomList = data.data.dataList;
        // this.form.pathRoomList = [{}];
      });
    },
    // 表单重置
    reset() {
      this.form = {
        isDefault: false,
        pathRoomList: [{}],
        remark: "",
        tenantCode: "",
        id: undefined,
        tenantName: undefined
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
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
      this.open = true;
      this.title = "添加工艺路线";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      let req = {idList: [row.id], pageSize: 1, pageNum: 1};
      getById(req).then(response => {
        this.form = response.data.dataList[0]
        this.open = true;
        this.title = "修改工艺路线";
        this.getRoomList(this.form.factoryId)
      });

    },
    /** 提交按钮 */
    submitForm: function () {
    insetOrUpdate(this)
    },
    /** 删除按钮操作 */
    handleDelete(row) {
     deleteList(row,this.ids,this.getList)
    }, addRoom() {
      this.form.pathRoomList.push({})
    },
    deleteRoom(index) {
      this.form.pathRoomList.splice(index, 1)
    }
  }
};
</script>
