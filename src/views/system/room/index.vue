<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryForm" :inline="true" :model="queryParams" label-width="88px" size="small">

      <el-form-item label="工厂">
        <el-select v-model="queryParams.data.factoryId" clearable placeholder="请选择工厂"
                   @change="handleQueryChangeFactory">
          <el-option
              v-for="item in factoryList"
              :key="item.id"
              :label="item.factoryName"
              :value="item.id"/>
        </el-select>
      </el-form-item>

      <el-form-item label="楼层">
        <el-select v-model="queryParams.data.storeyId" clearable placeholder="请选择楼层"
                   @change="handleQuery">
          <el-option
              v-for="item in queryParamsStoreyList"
              :key="item.id"
              :label="item.storeyName"
              :value="item.id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="房间名称" prop="roomName">
        <el-input v-model="queryParams.data.roomName" clearable placeholder="请输入房间名称"
                  @keyup.enter.native="handleQuery"/>
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
        <el-button plain size="mini" type="primary" @click="handleAddBatchShow">
          <svg-icon icon-class="batch-add"></svg-icon>
        </el-button>
      </el-col>
      <el-col :span="1.5" hidden="hidden">
        <el-button :disabled="single" icon="el-icon-edit" plain size="mini" type="success" @click="handleUpdate">
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button :disabled="multiple" icon="el-icon-delete" plain size="mini" type="danger" @click="handleDelete">
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="roomNameList" @selection-change="handleSelectionChange">

      <el-table-column align="center" label="全选" prop="id" type="selection" width="50"/>
      <el-table-column v-for="(item,index) in  tableHeaderList" :key="index" :label="item.showName" :prop="item.columnName"
                       align="center"/>
      <el-table-column align="center" class-name="small-padding fixed-width" label="操作" fixed="right" width="140px">
        <template slot-scope="scope">
          <el-button icon="el-icon-edit" size="mini" type="text" @click="handleUpdate(scope.row)"></el-button>
          <el-button icon="el-icon-delete" size="mini" type="text" @click="handleDelete(scope.row)"></el-button>
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

    <el-dialog :title="title" :visible.sync="batchAddOpen" append-to-body width="500px">
      <el-form ref="batchAddForm" :model="batchAddForm" label-width="100px">
        <el-form-item label="工厂" prop="factoryId">
          <el-select v-model="batchAddForm.factoryId" filterable placeholder="请选择工厂" @change="factoryIdChange">
            <el-option v-for="item in factoryList" :key="item.id" :label="item.factoryName" :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="楼层" prop="storey">
          <el-select v-model="batchAddForm.storeyId" filterable placeholder="请选择楼层">
            <el-option v-for="item in storeyList.filter(t=>t.factoryId===batchAddForm.factoryId)" :key="item.id" :label="item.storeyName" :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="房间名称后缀" prop="isPrefix">
          <el-radio-group v-model="batchAddForm.isPrefix">
            <el-radio label="1"> 前缀</el-radio>
            <el-radio label="0"> 后缀</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="房间名称前缀" prop="roomPrefix">
          <el-input v-model="batchAddForm.roomPrefix" placeholder="请输入房间名称前缀">
          </el-input>
        </el-form-item>
        <el-form-item label="房间名称" prop="roomCount">
          <el-select v-model="batchAddForm.roomCount" filterable placeholder="请输入房间名称">
            <el-option v-for="item in 100" :key="item" :label="item" :value="item"/>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitBatchForm">确 定</el-button>
        <el-button @click="handleAddBatchClose">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="title" :visible.sync="open" append-to-body width="500px">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="工厂" prop="factoryId">
          <el-select v-model="form.factoryId" filterable placeholder="请选择工厂" @change="factoryIdChange">
            <el-option v-for="item in factoryList" :key="item.id" :label="item.factoryName" :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="楼层" prop="storey">
          <el-select v-model="form.storeyId" filterable placeholder="请选择楼层">
            <el-option v-for="item in storeyList.filter(t=>t.factoryId===form.factoryId)" :key="item.id" :label="item.storeyName" :value="item.id"/>
          </el-select>
        </el-form-item>

        <el-form-item label="房间编码" prop="roomCode">
          <el-input v-model="form.roomCode" placeholder="请输入房间编码"/>
        </el-form-item>
        <el-form-item label="房间名称" prop="roomName">
          <el-input v-model="form.roomName" placeholder="请输入登陆名"/>
        </el-form-item>
        <el-form-item label="排序" prop="roomSort">
          <el-select v-model="form.roomSort" filterable placeholder="请输入排序">
            <el-option v-for="item in 100" :key="item" :label="item" :value="item"/>
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
import {getFactoryList} from '@/api/factory'
import {getStoreyList} from '@/api/storey'
import request from "@/utils/request";

import {add, deleteByIdList, getById, queryPageList, updateById} from '@/api/common'

export default {
  name: "roomName",
  data() {

    return {
      storeyList: [],
      queryParamsStoreyList: [],
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

      roomNameList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      batchAddOpen: false,
      batchAddForm: {
        isPrefix: "1",
        roomCount: 10,
        roomPrefix: ""
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        data: {roomName: undefined, factoryId: undefined},
        createBy: undefined,
        status: undefined,

      },
      // 表单参数
      form: {
        roomSort: 0,
        storeyId: undefined,
        remark: "",
        roomName: "",
        pwd: "",
        id: undefined,
        confirmPwd: undefined
      },
      // 表单校验
      rules: {
        factoryId: [
          {required: true, message: "工厂", trigger: "blur"}
        ],
        storeyId: [
          {required: true, message: "楼层", trigger: "blur"}
        ],
        roomName: [
          {required: true, message: "房间名称", trigger: "blur"}
        ],
        roomCode: [
          {required: true, message: "房间编码不能为空", trigger: "blur"},
          {min: 1, max: 20, message: "长度在 1 到 20 个字符", trigger: "blur"}
        ]
      },
      tableHeaderList: [{
        columnName: "id",
        showName: "序号"
      }, {
        columnName: "factoryName",
        showName: "工厂名称"
      }, {
        columnName: "storeyName",
        showName: "楼层名称"
      }, {
        columnName: "roomCode",
        showName: "房间编码"
      }, {
        columnName: "roomName",
        showName: "房间名称"
      }, {
        columnName: "roomSort",
        showName: "排序"
      }],
      storeyMap: {},
      factoryMap: {},
    }
  },
  created() {
    document["pagePath"] = "/room";
    this.getFactoryListTmp().then(() => {
      this.getList();
    });
  },
  methods: {
    handleQueryChangeFactory() {
      this.queryParamsStoreyList = this.storeyList.filter(t => t.factoryId === this.queryParams.data.factoryId)
      this.handleQuery();
    },
    getFactoryListTmp() {
      return getFactoryList({queryPage:false}).then(data => {
        this.factoryList = data.data.dataList || [];
        this.factoryList.forEach(t => this.factoryMap[t.id] = t.factoryName);
        getStoreyList({queryPage:false}).then(tt => {
          this.storeyList = tt.data.dataList || [];
          this.storeyList.forEach(t => this.storeyMap[t.id] = t.storeyName)

        })
      });
    },
    /** 查询公告列表 */
    getList() {
      // this.loading = true;
      queryPageList(this.queryParams).then(response => {
        response = response.data
        // this.tableHeaderList = response.dynamicsFieldList
        this.roomNameList = response.dataList || [];
        this.total = parseInt(response.total);
        this.loading = false;
        this.roomNameList.forEach(t => {
          t.factoryName = this.factoryMap[t.factoryId]
          t.storeyName = this.storeyMap[t.storeyId]
        })
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();  this.form.id=undefined;
    },
    // 表单重置
    reset() {
      this.form = {
        remark: "",
        roomCode: "",
        id: undefined,
        roomName: undefined
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
      this.reset();  this.form.id=undefined;
      this.open = true;
      this.title = "添加房间";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();  this.form.id=undefined;

      let req = {idList: [row.id], pageSize: 1, pageNum: 1};
      getById(req).then(response => {
        this.form = response.data.dataList[0]
        this.open = true;
        this.title = "修改房间";
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
    },
    factoryIdChange() {
      // this.form.storeyId = this.storeyList.filter(t => t.factoryId === this.form.factoryId)[0].id
    },
    handleAddBatchShow() {
      this.title = "批量添加房间"
      this.batchAddOpen = true
    },
    handleAddBatchClose() {
      this.batchAddOpen = false
    },
    submitBatchForm() {
      request({
        url: "/room/saveBatch",
        data: this.batchAddForm,
        method: "post"
      }).then(res => {
        this.$modal.msgSuccess("批量添加成功")
        this.batchAddOpen = false
        this.getList();
      })
    },

  }
};
</script>
