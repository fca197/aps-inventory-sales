<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryForm" :inline="true" :model="queryParams" label-width="88px" size="small">
      <el-form-item label="工厂" prop="factoryList">
        <el-select v-model="queryParams.data.factoryId" clearable placeholder="请选择工厂">
          <el-option v-for="item in factoryList" :key="item.id" :label="item.factoryName" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="班次名称" prop="brandName">
        <el-input v-model="queryParams.data.shiftName" clearable placeholder="请输入班次名称" @keyup.enter.native="handleQuery"/>
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
      <el-table-column align="center" class-name="small-padding fixed-width" label="操作" fixed="right" width="140px">
        <template slot-scope="scope">
          <el-button icon="el-icon-edit" size="mini" type="text" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button icon="el-icon-delete" size="mini" type="text" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :limit.sync="queryParams.pageSize" :page.sync="queryParams.pageNum" :total="total" @pagination="getList"/>

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" append-to-body width="800px">
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="工厂" prop="factoryId">
          <el-select v-model="form.factoryId" placeholder="请选择工厂">
            <el-option v-for="item in factoryList" :key="item.id" :label="item.factoryName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="班次编码" prop="shiftCode">
          <el-input v-model="form.shiftCode" placeholder="请输入班次编码"/>
        </el-form-item>
        <el-form-item label="班次名称" prop="shiftName">
          <el-input v-model="form.shiftName" placeholder="请输入班次名称"/>
        </el-form-item>
        <el-form-item label="班次">
          <el-col v-for=" (item ,index) in form.shiftItemList" :key="index" :span="24">
            <el-col :span="18">
              <el-time-picker
                  v-model="item.beginTime" end-placeholder="下班时间" format="HH:mm"
                  start-placeholder="上班时间" value-format="HH:mm"/>
              -
              <el-time-picker
                  v-model="item.endTime" end-placeholder="下班时间" format="HH:mm"
                  start-placeholder="上班时间" value-format="HH:mm"/>
            </el-col>
            <el-col :span="5">
              <el-button icon="el-icon-plus" size="mini" type="primary" @click="addItem"></el-button>
              <el-button v-if="index!==0" icon="el-icon-delete" size="mini" type="danger" @click="deleteItem(index)"></el-button>
            </el-col>
          </el-col>
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

import {add, deleteByIdList, getById, queryPageList, updateById} from '@/api/common'
import {getFactoryList} from "@/api/factory";

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
      goodsList: [],
      workStationList: [],
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
        shiftItemList: [{
          timeRange: []
        }],
        goodsId: undefined,
        factoryId: undefined,
        goodsRemark: "",
        remark: "",
        brandName: "",
        pwd: "",
        id: undefined,
        confirmPwd: undefined
      },
      shiftItemList: [],
      // 表单校验
      rules: {},
      tableHeaderList: []
    };
  },
  created() {
    document["pagePath"] = "/shift";
    // process.env.pagePath = "/tenant"
    this.getList();
    getFactoryList({queryPage:false}).then(data => {
      this.factoryList = data.data.dataList;
      // console.info("factoryList: ", this.factoryList);
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
    // 表单重置
    reset() {
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
      this.title = "添加班次";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      let req = {idList: [row.id], pageSize: 1, pageNum: 1};
      getById(req).then(response => {
        this.title = "修改班次";
        this.form.id = response.data.dataList[0].id
        this.form.factoryId = response.data.dataList[0].factoryId
        this.form.shiftName = response.data.dataList[0].shiftName
        this.form.shiftCode = response.data.dataList[0].shiftCode
        this.form.shiftItemList = response.data.dataList[0].shiftItemDtoList
        this.open = true;
      });

    },
    /** 提交按钮 */
    submitForm: function () {
      let shiftItemDtoList = [];
      this.form.shiftItemList.forEach(t => {
        shiftItemDtoList.push(t);
      })
      this.form.shiftItemDtoList = shiftItemDtoList;
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
    addItem() {
      return new Promise(()=>this.form.shiftItemList.push({beginTime: "", endTime: ""})).then(() => {
      }).then(() => {
        this.$forceUpdate();
      })
    },
    deleteItem(index) {
      this.form.shiftItemList.splice(index, 1)
    },
  }
};
</script>
