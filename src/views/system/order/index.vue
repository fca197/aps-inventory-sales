<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="88px">
      <el-form-item label="品牌" prop="brandCode">
        <el-select  filterable v-model="queryParams.brandCode" >
          <el-option v-for="(item) in brandList" :value="item.brandCode" :key="item.brandCode" :label="item.brandName"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-for="(item,index) in  queryTableHeaderList" :prop="queryTableHeaderList[index].columnName" :key="index" :label="item.showName">
        <el-input v-model="queryParams[item.columnName]" :prop="queryParams+'.'+item.columnName" :placeholder="'请输入'+item.showName"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
      </el-col>
      <el-col :span="1.5" v-show="false">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete">删除</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="infoList" @selection-change="handleSelectionChange">
      <el-table-column label="全选" type="selection"  align="center" prop="id" width="45"/>

      <el-table-column v-for="(item,index) in  tableHeaderList"  :key="index" align="center" :prop="item.columnName" :label="item.showName">
      </el-table-column>
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

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="品牌" prop="brandCode">
          <el-select  filterable v-model="form.brandCode" >
            <el-option v-for="(item) in brandList" :key="item.brandCode" :value="item.brandCode" :label="item.brandName"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="门店编码" prop="storeCode">
          <el-input v-model="form.storeCode" placeholder="请输入编码"  maxlength="20" />
        </el-form-item>
        <el-form-item label="门店名称" prop="storeName">
          <el-input v-model="form.storeName" placeholder="请输入门店名称"  maxlength="20"/>
        </el-form-item>
        <el-form-item label="门店星级" prop="storeStars">
          <el-select  filterable v-model="form.storeStar">
            <el-option v-for="(i) in 5" :value="i" :key="i"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开业日期" prop="storeOpenDate">
          <el-date-picker v-model="form.storeOpenDate"  rows="4" value-format="yyyy-MM-dd"   value="new Date()"/>
      </el-form-item>
        <el-form-item label="门店地址" prop="storeAddress">
          <el-input v-model="form.storeAddress" placeholder="请输入门店地址"  maxlength="200" type="textarea" :autosize="{minRows:2,maxRows:8}"/>
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
import {brandList} from "@/api/brand";

// console.info("xxx: ",uc.urlPrefix)
export default {
  name: "brandName",
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

      infoList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        brandName: undefined,
        createBy: undefined,
        status: undefined,
        storeCode: undefined,
        storeName: undefined
      },
      // 表单参数
      form: {
        storeAddress: undefined,
        remark: "",
        brandName: "",
        pwd: "",
        storeStar: 5,
        id: undefined,
        confirmPwd: undefined,
        storeOpenDate:undefined
      },
      // 表单校验
      rules: {
        brandName: [
          {required: true, message: "品牌名称", trigger: "blur"}
        ],
        brandCode: [
          {required: true, message: "品牌编码不能为空", trigger: "blur"},
          {min: 1, max: 20, message: "长度在 1 到 20 个字符", trigger: "blur"}
        ]
      },
      queryTableHeaderList: []
      ,
      tableHeaderList: [{
        "children": [],
        "id": "id",
        "name": "id自增",
        "weight": null
      }],
      brandList: [],
      brandSet: []
    };
  },
  created() {
    document["pagePath"] = "/order/item";
    // process.env.pagePath = "/brand"
    //     this.getList();
    this.getBrandList()
  },
  methods: {
    getBrandList() {
      brandList({}).then(res => {
        this.brandList = res.data.dataList
        this.brandList.forEach((t)=>{
          this.brandSet[t.brandCode]=t.brandName;
        })
    console.log("brandSet",this.brandSet)
      });
    },
    /** 查询公告列表 */
    getList() {
      // this.loading = true;
      queryPageList(this.queryParams).then(response => {
        response = response.data
        this.tableHeaderList = response.dynamicsFieldList
        this.infoList = response.rows;
        this.total = parseInt(response.total);
        this.loading = false;
        this.setTableHeaderList()
        this.setQueryTableHeaderList()
        this.setInfo();
      });
    },
    setInfo(){
      this.infoList.forEach(t=>{
        t.brandCode=this.brandSet[t.brandCode]
      })
    },
    setTableHeaderList() {
      const removeColumnName = ["storeAddress", "updateTime", "createTime", "createByName", "updateByName"];

      this.tableHeaderList = this.tableHeaderList.filter(t => !removeColumnName.includes(t.columnName))
     this.tableHeaderList.forEach(t=>{
        t.brandCode=this.brandSet[t.brandCode]
      })
    },
    setQueryTableHeaderList() {
      this.queryTableHeaderList = this.tableHeaderList;
      // var  removeColumnName=["id","updateTime","createTime","createByName","updateByName","brandCode"]
      var showColumnName = ["id", "storeCode", "storeName"]
      // console.log("removeColumnName: "+ removeColumnName.)
      this.queryTableHeaderList = this.queryTableHeaderList.filter(t => showColumnName.includes(t.columnName));
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
        brandCode: "",
        id: undefined,
        storeStar: 5,
        brandName: undefined,
        storeOpenDate:undefined
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
      this.single = selection.length != 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.form.brandCode=this.brandList[0].brandCode;
      this.title = "添加品牌";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();

      let req = {idList: [row.id], pageSize: 1, pageNum: 1};
      getById(req).then(response => {
        this.form = response.data.dataList[0]
        this.open = true;
        this.title = "修改品牌";
      });

    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
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
      this.$modal.confirm('是否确认删编号为 <span style="color:red">' + idList + '</span> 的数据项？', "删除提示").then(function () {
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
