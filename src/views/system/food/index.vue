<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryForm" :inline="true" :model="queryParams" label-width="88px" size="small">

      <el-form-item v-for="(item,index) in  queryTableHeaderList" :key="index"
                    :label="item.showName" :prop="queryTableHeaderList[index].columnName">
        <el-input v-model="queryParams[item.columnName]" :placeholder="'请输入'+item.showName"
                  :prop="queryParams+'.'+item.columnName"/>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" size="mini" type="primary" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button icon="el-icon-plus" plain size="mini" type="primary" @click="handleAdd">新增</el-button>
      </el-col>
      <el-col v-show="false" :span="1.5">
        <el-button :disabled="single" icon="el-icon-edit" plain size="mini" type="success" @click="handleUpdate">修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button :disabled="multiple" icon="el-icon-delete" plain size="mini" type="danger" @click="handleDelete">
          删除
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="infoList" @selection-change="handleSelectionChange">
      <el-table-column align="center" label="全选" prop="id" type="selection" width="45"/>

      <el-table-column v-for="(item,index) in  tableHeaderList" :key="index" :label="item.showName" :prop="item.columnName"
                       align="center">
      </el-table-column>
      <el-table-column align="center" class-name="" label="操作"
                       width="200">
        <template slot-scope="scope">
          <el-button icon="el-icon-edit" size="mini" type="text" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button icon="el-icon-info" size="mini" type="text" @click="showInfo(scope.row)">规格</el-button>
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


    <el-dialog :title="title" :visible.sync="open" append-to-body width="800px">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="食品序号" prop="foodCode">
          <el-input v-model="form.foodCode" maxlength="20" placeholder="请输入食品序号"/>
        </el-form-item>
        <el-form-item label="食品名称" prop="storeName">
          <el-input v-model="form.foodName" maxlength="20" placeholder="请输入食品名称"/>
        </el-form-item>
        <el-button @click="addSpecList">添加规格</el-button>
        <div v-for="(s,i) in form.specList" style="margin: 20px 0 0">
          <el-form-item :label="'规格编码-'+(i+1)">
            <el-input v-model="s.foodSpecCode" maxlength="20" placeholder="请输入"/>
          </el-form-item>
          <el-form-item :label="'规格名称-'+(i+1)">
            <el-input v-model="s.foodSpecName" maxlength="20" placeholder="请输入"/>
          </el-form-item>
          <div style="text-align: end">
            <el-button type="danger" @click="deleteSpecList(i)">删除规格</el-button>
          </div>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :visible.sync="infoOpen" type="primary" @click="submitForm">确 定</el-button>
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
      infoOpen: false,
      // 查询参数
      queryParams: {
        specList: [],
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
        specList: [],
        foodName: "",
        foodCode: ""
      },
      // 表单校验
      rules: {
        foodCode: [
          {required: true, message: "文件名称", trigger: "blur"},
          {min: 1, max: 20, message: "长度在 1 到 20 个字符", trigger: "blur"}
        ],
        foodName: [
          {required: true, message: "不能为空", trigger: "blur"},
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
    document["pagePath"] = "/food";
    // process.env.pagePath = "/brand"
    //     this.getList();
    // this.getBrandList()
  },
  methods: {
    deleteSpecList(index) {
      let ta = this.form.specList.splice(index, 1);
      // this.form.specList.push(ta);
    },
    addSpecList() {
      const time = new Date().getTime();
      let specInfo = {id: time, foodSpecCode: "code" + time, foodSpecName: "name" + time};
      console.log(this.form);
      this.form.specList.push(specInfo);
    },
    getBrandList() {
      brandList({}).then(res => {
        this.brandList = res.data.dataList
        this.brandList.forEach((t) => {
          this.brandSet[t.brandCode] = t.brandName;
        })
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
    setInfo() {
      this.infoList.forEach(t => {
        t.brandCode = this.brandSet[t.brandCode]
      })
    },
    setTableHeaderList() {
      const removeColumnName = ["foodImage"]// ["storeAddress", "updateTime", "createTime", "createByName", "updateByName"];

      this.tableHeaderList = this.tableHeaderList.filter(t => !removeColumnName.includes(t.columnName))
      this.tableHeaderList.forEach(t => {
        t.brandCode = this.brandSet[t.brandCode]
      })
    },
    setQueryTableHeaderList() {
      this.queryTableHeaderList = this.tableHeaderList;
      // var  removeColumnName=["id","updateTime","createTime","createByName","updateByName","brandCode"]
      var showColumnName = ["id", "foodCode", "foodName"]
      // console.log("removeColumnName: "+ removeColumnName.)
      this.queryTableHeaderList = this.queryTableHeaderList.filter(t => showColumnName.includes(t.columnName));
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
        brandCode: "",
        id: undefined,
        storeStar: 5,
        brandName: undefined,
        storeOpenDate: undefined,
        specList: []
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    showInfo(row) {
      getById({idList: [row.id]}).then(res => {
        this.infoOpen = true
        this.open = true
      })
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
      this.reset();  this.form.id=undefined;
      this.open = true;
      this.form.brandCode = this.brandList[0].brandCode;
      this.title = "添加";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();  this.form.id=undefined;

      let req = {idList: [row.id], pageSize: 1, pageNum: 1};
      getById(req).then(response => {
        this.form = response.data.dataList[0];

        // this.form.specList=[]
        this.open = true;
        this.title = "修改";
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

}
;
</script>
