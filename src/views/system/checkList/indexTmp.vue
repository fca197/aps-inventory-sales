<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="88px">
      <el-form-item label="工厂">
        <el-select v-model="queryParams.data.factoryId" placeholder="请选择工厂" clearable
                   @change="handleQueryChangeFactory">
          <el-option
              v-for="item in factoryList"
              :key="item.id"
              :label="item.factoryName"
              :value="item.id"/>
        </el-select>
      </el-form-item>

      <el-form-item label="楼层">
        <el-select v-model="queryParams.data.storeyId" placeholder="请选择楼层" clearable
                   @change="handleQueryChangeStorey">
          <el-option
              v-for="item in storeyList"
              :key="item.id"
              :label="item.storeyName"
              :value="item.id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="房间">
        <el-select v-model="queryParams.data.roomId" placeholder="请选择房间" clearable
                   @change="handleQuery">
          <el-option
              v-for="item in roomList"
              :key="item.id"
              :label="item.roomName"
              :value="item.id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="资产名称" prop="propertyName">
        <el-input v-model="queryParams.data.propertyName" placeholder="请输入资产名称" clearable
                  @keyup.enter.native="handleQuery"/>
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
        <el-button type="primary" plain size="mini" @click="handleAddBatch">
          <svg-icon icon-class="batch-add"></svg-icon>
        </el-button>
      </el-col>
      <el-col :span="1.5" hidden="hidden">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate">
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete">
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain size="mini" :disabled="multiple" title="生成二维码" @click="handleCreateQr">
          <svg-icon icon-class="qrcode"></svg-icon>
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="propertyNameList" @selection-change="handleSelectionChange">

      <el-table-column label="全选" type="selection" align="center" prop="id" width="50"/>
      <el-table-column v-for="(item,index) in  tableHeaderList"  :key="index" align="center" :prop="item.fieldName"
                       :label="item.showName"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
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
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
    </el-dialog>
  </div>
</template>

<script>
import {getFactoryList} from '@/api/factory'
import {getStoreyList} from '@/api/storey'
import {getRoomList} from '@/api/room'
import {add, deleteByIdList, getById, queryPageList, updateById} from '@/api/common'
// console.info("xxx: ",uc.urlPrefix)
export default {
  name: "checkName",
  data() {

    return {
      storeyList: [],
      roomList: [],
      factoryList: [],
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
      propertyNameList: [],
      qrCodePropertyList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      openAddBatch: false,
      qrCodeOpen: false,
      formBatch: {propertyCount: 10},
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        propertyName: undefined,
        createBy: undefined,
        status: undefined,
        data: {
          factoryId: undefined,
          storeyId: undefined
        }
      },
      // 表单参数
      form: {
        remark: "",
        propertyName: "",
        pwd: "",
        id: undefined,
        confirmPwd: undefined
      },
      // 表单校验
      rules: {
        factoryId: [
          {required: true, message: "工厂", trigger: "blur"}
        ],
        propertyName: [
          {required: true, message: "资产名称", trigger: "blur"}
        ]
      },
      tableHeaderList: []
    };
  },
  created() {
    document["pagePath"] = "/checkList";
    this.getFactoryList()
    .then(() => this.getList())
  },
  methods: {
    handleQueryChangeStorey() {
      this.getRoomListTmp(this.queryParams.data.storeyId);
    },
    getRoomListTmp(storeyId) {
      return getRoomList({pageSize: 3000, pageNum: 1, data: {storeyId: storeyId}}).then(t => {
        this.roomList = t.data.dataList || []
        this.queryParams.data.roomId = undefined
        this.form.roomId = this.roomList[0].id
      })
    },
    getStoreyListTmp(factoryId) {
      this.storeyList = []
      this.roomList = []
      return getStoreyList({pageSize: 3000, pageNum: 1, data: {factoryId: factoryId}}).then(t => {
        this.storeyList = t.data.dataList || []
        this.queryParams.data.storeyId = undefined
        this.queryParams.data.roomId = undefined
        this.form.storeyId = this.storeyList[0].id
        this.getRoomListTmp(this.form.storeyId)
      })
    },
    handleQueryChangeFactory() {
      this.getStoreyListTmp(this.queryParams.data.factoryId);
      this.handleQuery();
    },
    getFactoryList() {
      return getFactoryList({pageSize: 3000, pageNum: 1}).then(data => {
        this.factoryList = data.data.dataList;
      });
    },
    /** 查询公告列表 */
    getList() {
      // this.loading = true;
      return queryPageList(this.queryParams).then(response => {
        response = response.data
        this.tableHeaderList = response.headerList
        this.propertyNameList = response.dataList;
        this.total = parseInt(response.total);
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        remark: "",
        propertyCode: "",
        id: undefined,
        propertyName: undefined
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
      this.title = "添加资产";
    },
    handleAddBatch() {
      this.title = "批量添加资产";
      this.openAddBatch = true;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();

      let req = {idList: [row.id], pageSize: 1, pageNum: 1};
      getById(req).then(response => {
        this.form = response.data.dataList[0]
        this.open = true;
        this.title = "修改资产";
      });

    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id !== undefined) {
            updateById(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            add(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const idList = row.id ? [row.id] : this.ids
      this.$modal.confirm('是否确认删序号为 <span style="color:red">' + idList + '</span> 的数据项？', "删除提示").then(function () {
        let req = {
          idList: idList
        }
        return deleteByIdList(req);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      });
      document.getElementsByClassName("el-message-box")[0].style.width = "520px"
    }
  }
};
</script>
