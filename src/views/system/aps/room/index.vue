<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryForm" :inline="true" :model="queryParams" label-width="88px" size="small">
      <el-form-item label="工厂" prop="factoryList">
        <el-select v-model="queryParams.data.factoryId" clearable placeholder="请选择工厂">
          <el-option v-for="item in factoryList" :key="item.id" :label="item.factoryName" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="车间名称" prop="brandName">
        <el-input v-model="queryParams.data.roomName" clearable placeholder="请输入车间名称" @keyup.enter.native="handleQuery"/>
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

      <el-table-column v-for="(item,index) in  tableHeaderList" :key="index" :label="item.showName" :prop="item.fieldName" align="center" width="180px"/>
      <el-table-column align="center" class-name="small-padding fixed-width" label="操作" fixed="right" >
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
    <el-dialog :title="title" :visible.sync="open" append-to-body width="1000px">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">

        <el-form-item label="工厂" prop="factoryId">
          <el-select v-model="form.factoryId" clearable placeholder="请选择工厂">
            <el-option v-for="item in factoryList" :key="item.id" :label="item.factoryName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="车间名称" prop="roomName">
          <el-input v-model="form.roomName" placeholder="请输入车间名称" @blur="loadSzm"/>
        </el-form-item>
        <el-form-item label="车间编号" prop="roomRemark">
          <el-input v-model="form.roomCode" placeholder="请输入车间编号"/>
        </el-form-item>

        <el-form-item label="车间配置" prop="roomRemark">
          <el-col :span="5">工段
          </el-col>
          <el-col :span="5">工位
          </el-col>
          <el-col :span="5">状态
          </el-col>
          <el-col :span="5">耗时(秒)
          </el-col>
          <div v-for="(item,index) in form.configList">

            <el-col :span="5">
              <el-select v-model="item.sectionId" clearable placeholder="请选择工段" filterable>
                <el-option v-for="item in sectionList" :key="item.id" :label="item.sectionName" :value="item.id"></el-option>
              </el-select>
            </el-col>
            <el-col :span="5">
              <el-select v-model="item.stationId" clearable placeholder="请选择工位" filterable>
                <el-option v-for="item in stationList" :key="item.id" :label="item.stationName" :value="item.id"></el-option>
              </el-select>
            </el-col>
            <el-col :span="5">
              <el-select v-model="item.statusId" clearable placeholder="请选择状态" filterable>
                <el-option v-for="item in statusList" :key="item.id" :label="item.statusName" :value="item.id"></el-option>
              </el-select>
            </el-col>
            <el-col :span="5">
              <el-input v-model="item.executeTime" placeholder="请输入"/>
            </el-col>
            <el-col :span="4">
              <el-button icon="el-icon-plus" size="mini" type="primary" @click="addConfig"></el-button>
              <el-button icon="el-icon-delete" size="mini" type="danger" @click="deleteConfig(form.configList, index)"></el-button>
            </el-col>

          </div>
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
import {getFactoryList} from "@/api/factory";
import {getSectionList} from "@/api/aps/section";
import {getStationList} from "@/api/aps/station";
import {getStatusList} from "@/api/aps/status";
// console.info("xxx: ",uc.urlPrefix)
export default {
  name: "tenantName",
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
        roomRemark: "",
        remark: "",
        brandName: "",
        pwd: "",
        id: undefined,
        configList: [{}]
      },
      // 表单校验
      rules: {
        factoryId:[{ required: true, message: '不能为空', trigger: 'blur' }],
        roomCode:[{ required: true, message: '不能为空', trigger: 'blur' }, { min: 4, max: 20, message: '长度在 4 到 20 个字符', trigger: 'blur' }],
        roomName:[{ required: true, message: '不能为空', trigger: 'blur' }, { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }]

      },
      tableHeaderList: [],
      stationList: [],
      sectionList: [],
      statusList: [],
      tmpConfig: {
        sectionId: undefined,
        stationId: undefined,
        statusId: undefined,
        executeTime: 0
      }
    };
  },
  created() {
    document["pagePath"] = "/apsRoom";
    // process.env.pagePath = "/tenant"
    this.getList();
    getFactoryList({queryPage:false}).then(data => {
      this.factoryList = data.data.dataList;
    });
    getSectionList({queryPage:false}).then(data => {
      this.sectionList = data.data.dataList;
    });
    getStationList({queryPage:false}).then(data => {
      this.stationList = data.data.dataList;
    });
    getStatusList({queryPage:false}).then(data => {
      this.statusList = data.data.dataList;
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
      this.reset();  this.form.id=undefined;
    },
    // 表单重置
    reset() {
      let d = this.tmpConfig;
      this.form = {
        remark: "",
        tenantCode: "",
        id: undefined,
        configList: [d]
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
      this.title = "添加车间";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();  this.form.id=undefined;
      let req = {idList: [row.id], pageSize: 1, pageNum: 1};
      getById(req).then(response => {
        this.form = response.data.dataList[0]
        if (this.form.configList === undefined || this.form.configList.length === 0) {
          this.form.configList = []
          this.form.configList.push({...this.tmpConfig})
        }
        this.open = true;
        this.title = "修改车间";
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
    addConfig() {
      let d = {...this.tmpConfig};
      this.form.configList.push(d)
    }, deleteConfig(list, index) {
      list.splice(index, 1)
    },
    loadSzm(){
      pinyin4jSzm(this.form.roomName,(r)=>{
        this.form.roomCode=r.szmUpper;
        this.$forceUpdate();
      })
    }
  }
};
</script>
