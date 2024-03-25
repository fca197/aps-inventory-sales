<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="88px">

      <el-form-item  label="工厂" >
        <el-select v-model="queryParams.data.factoryId" placeholder="请选择工厂" clearable
                     @change="handleQuery">
          <el-option
            v-for="item in factoryList"
            :key="item.id"
            :label="item.factoryName"
            :value="item.id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="楼层名称" prop="storeyName">


        <el-input v-model="queryParams.data.storeyName" placeholder="请输入楼层名称" clearable
                  @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" title="添加" @click="handleAdd"></el-button>
      </el-col>
      <el-col :span="1.5" title="批量添加">
        <el-button type="primary" plain size="mini" @click="handleBatchAdd">
          <svg-icon icon-class="batch-add"></svg-icon>
        </el-button>
      </el-col>
      <el-col :span="1.5" hidden="hidden">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" title="修改" @click="handleUpdate"></el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" title="删除" :disabled="multiple" @click="handleDelete">

        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="storeyNameList" @selection-change="handleSelectionChange">

      <el-table-column label="全选" type="selection" align="center" prop="id" width="50"/>
      <el-table-column v-for="(item,index) in  tableHeaderList"  :key="index" align="center" :prop="item.columnName"
                       :label="item.showName"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"></el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"></el-button>
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
    <el-dialog :title="title" :visible.sync="openBatchAdd" width="500px" append-to-body>
      <el-form ref="openBatchAddForm" :model="openBatchAddForm" :rules="rules" label-width="100px">
        <el-form-item label="工厂" prop="factoryId">
          <el-select filterable v-model="openBatchAddForm.factoryId" placeholder="请选择工厂">
            <el-option v-for="item in factoryList" :key="item.id" :label="item.factoryName" :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="编码格式" prop="isPrefix">
          <el-radio-group v-model="openBatchAddForm.isPrefix">
            <el-radio label="1"> 前缀</el-radio>
            <el-radio label="0"> 后缀</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="楼层编码" prop="storeyCode">
          <el-input v-model="openBatchAddForm.storeyCode" placeholder="请输入楼层编码"/>
        </el-form-item>
        <el-form-item label="楼层数量" prop="storeyCount">
          <el-select filterable v-model="openBatchAddForm.storeyCount" placeholder="请输入数量">
            <el-option v-for="item in 100" :key="item" :label="item" :value="item"/>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitBatchForm">确 定</el-button>
        <el-button @click="cancelBatchAdd">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="工厂" prop="factoryId">
          <el-select filterable v-model="form.factoryId" placeholder="请选择工厂">
            <el-option v-for="item in factoryList" :key="item.id" :label="item.factoryName" :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="楼层编码" prop="storeyCode">
          <el-input v-model="form.storeyCode" placeholder="请输入楼层编码"/>
        </el-form-item>
        <el-form-item label="楼层名称" prop="storeyName">
          <el-input v-model="form.storeyName" placeholder="请输入登陆名"/>
        </el-form-item>
        <el-form-item label="楼层排序" prop="storeySort">
          <el-select filterable v-model="form.storeySort" placeholder="请选择">
            <el-option
                v-for="item in storeySortList"
                :key="item"
                :label="item"
                :value="item">
            </el-option>
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

import {add, deleteByIdList, getById, queryPageList, updateById} from '@/api/common'
import {getFactoryList} from "@/api/factory";
import request from "@/utils/request";
// console.info("xxx: ",uc.urlPrefix)
export default {
  name: "storeyName",
  data() {

    return {
      storeySortList: Array.from({length: 40}, (value, index) => index + 1),
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

      storeyNameList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      openBatchAdd: false,
      openBatchAddForm: {
        isPrefix: "1",
        storeyCount: 10,
        factoryId: undefined,
        storeyCode: undefined,
        storeyName: undefined,
        storeySort: undefined
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        data: {
          storeyName: undefined,
          createBy: undefined,
          status: undefined
        }
      },
      // 表单参数
      form: {
        remark: "",
        storeyName: "",
        pwd: "",
        id: undefined,
        confirmPwd: undefined,
        factoryId: 0
      },
      // 表单校验
      rules: {

        storeyName: [
          {required: true, message: "楼层名称", trigger: "blur"}
        ],
        storeyCode: [
          {required: true, message: "楼层编码不能为空", trigger: "blur"},
          {min: 1, max: 20, message: "长度在 1 到 20 个字符", trigger: "blur"}
        ]
      },
      tableHeaderList: [{
        columnName: "id",
        showName: "序号"
      }, {
        columnName: "factoryName",
        showName: "工厂"
      }, {
        columnName: "storeyCode",
        showName: "楼层编码"
      }, {
        columnName: "storeyName",
        showName: "楼层名称"
      }, {
        columnName: "storeySort",
        showName: "排序"
      }]
    };
  },
  created() {
    document["pagePath"] = "/storey";

    this.getFactoryList().then(t => {
      this.getList()
    })
  },
  methods: {
    getFactoryList() {
            return getFactoryList({pageSize: 3000, pageNum: 1}).then(data => {
        this.factoryList = data.data.dataList;
      });
    },
    /** 查询公告列表 */
    getList() {
      // this.loading = true;
      queryPageList(this.queryParams).then(response => {
        response = response.data
        // this.tableHeaderList = response.dynamicsFieldList
        this.storeyNameList = response.dataList;
        this.total = parseInt(response.total);
        this.loading = false;
        let fm = {}
        this.factoryList.forEach(t => fm[t.id] = t.factoryName);
        this.storeyNameList.forEach(t => t.factoryName = fm[t.factoryId])
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
        storeyCode: "",
        id: undefined,
        storeyName: undefined,
        factoryId: undefined

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
      this.title = "添加楼层";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();

      let req = {idList: [row.id], pageSize: 1, pageNum: 1};
      getById(req).then(response => {
        this.form = response.data.dataList[0]
        this.open = true;
        this.title = "修改楼层";
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
    handleBatchAdd() {
      this.title = "批量添加楼层";
      this.openBatchAdd = true;
    },
    submitBatchForm(){
      request({
        url: '/storey/addBatch',
        method: 'post',
        data: this.openBatchAddForm
      }).then(res => {
        if(res.code === 200){
          this.$modal.msgSuccess("批量添加成功");
          this.openBatchAdd = false;
        }else {
          this.$modal.msgError("批量添加成功");
          this.openBatchAdd = false;
        }
        this.getList();
      })
    },
    cancelBatchAdd() {
      this.openBatchAdd = false;
    },
  }
};
</script>
