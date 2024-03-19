<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="88px">
      <el-form-item label="商品名称" prop="goodsName">
        <el-input v-model="queryParams.goodsName" placeholder="请输入商品名称" clearable
                  @keyup.enter.native="handleQuery"/>
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
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete">
          删除
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="goodsNameList" @selection-change="handleSelectionChange">

      <el-table-column label="全选" type="selection" align="center" prop="id" width="50"/>
      <el-table-column v-for="(item,index) in  tableHeaderList" :key="index" align="center" :prop="item.fieldName" :width="item.width"
                       :label="item.showName">
        <template slot-scope="scope">
          <image-show  width="100" height="50" :id="scope.row[item.fieldName]" v-if="item.fieldName=='goodsImg'" />
          <span v-else>{{ scope.row[item.fieldName] }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"></el-button>
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"></el-button>
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
      <el-form Guz="form" :model="form" :rules="rules" label-width="100px">

        <el-form-item label="商图片" prop="file">
          <image-upload  v-model="form.goodsImg" :limit="1" :file-size="1" :file-type="['jpg','png']"></image-upload>
        </el-form-item>
        <el-form-item label="商品名称" prop="file">
          <el-input v-model="form.goodsName" placeholder="请输入商品名称" aria-required="true"/>
        </el-form-item>
        <el-form-item label="条形码" prop="goodsCode">
          <el-input v-model="form.goodsBarCode" placeholder="请输入商品编码"/>
        </el-form-item>
        <el-form-item label="二维码" prop="goodsQrCode">
          <el-input v-model="form.goodsQrCode" placeholder="请输入二维码"/>
        </el-form-item>
        <el-form-item label="成本价(分):" prop="goodsMinPrice">
          <el-input v-model="form.costPrice" placeholder="请输入商品成本价"/>
        </el-form-item>
        <el-form-item label="售卖价(分):" prop="goodsMaxPrice">
          <el-input v-model="form.salesPrice" placeholder="请输入商品最高价"/>
        </el-form-item>
        <el-form-item label="单位" prop="goodsUnit">
          <el-input v-model="form.goodsUnit" placeholder="请输入商品单位 (个/瓶/箱/件...)"/>
        </el-form-item>
        <el-form-item label="剩余预警数" prop="warningCount">
          <el-input v-model="form.warningCount" placeholder="10"/>
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
import ImageShow  from "@/components/ImageShow/index.vue";
import {add, deleteByIdList, getById, queryPageList, updateById} from '@/api/common'
// console.info("xxx: ",uc.urlPrefix)
export default {
  name: "goodsName",
  components: {
    ImageShow
  },
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

      goodsNameList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        goodsName: undefined,
        createBy: undefined,
        status: undefined
      },
      // 表单参数
      form: {
        goodsBarCode: "",
        goodsImg: "",
        goodsQrCode: "",
        remark: "",
        goodsName: "",
        goodsCode: "",
        pwd: "",
        id: undefined,
        costPrice: 99.99,
        salesPrice: 99.99,
        goodsUnit: "",
        warningCount: 10,
        isUsed: true
      },
      // 表单校验
      rules: {},
      tableHeaderList: [{
        fieldName: "id",
        showName: "编号",
        width: 200
      }]
    };
  },
  created() {
    document["pagePath"] = "/goods";
    this.getList();
  },
  methods: {
    /** 查询公告列表 */
    getList() {
      // this.loading = true;
      return queryPageList(this.queryParams).then(response => {
        response = response.data
        this.tableHeaderList = response.headerList
        this.goodsNameList = response.dataList;
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
        goodsCode: "",
        id: undefined,
        goodsName: undefined,
        isUsed: true,
        costPrice: 99.99,
        salesPrice: 99.99,
        goodsUnit: "",
        warningCount: 10
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
      this.title = "添加商品";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      let req = {idList: [row.id], pageSize: 1, pageNum: 1};
      getById(req).then(response => {
        this.form = response.data.dataList[0]
        this.open = true;
        this.title = "修改商品";
      });

    },
    /** 提交按钮 */
    submitForm: function () {

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
}
</script>
