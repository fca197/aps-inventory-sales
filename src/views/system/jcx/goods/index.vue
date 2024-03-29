<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="88px">
      <el-form-item label="商品名称" prop="goodsName">
        <el-input v-model="queryParams.data.goodsName" placeholder="请输入商品名称" clearable
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
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"/>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain size="mini" :disabled="multiple" @click="handleCreateLineCode">
          <svg-icon icon-class="line-code"/>
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="goodsNameList" @selection-change="handleSelectionChange">

      <el-table-column label="全选" type="selection" align="center" prop="id" width="50"/>
      <el-table-column v-for="(item,index) in  tableHeaderList" :key="index" align="center" :prop="item.fieldName" :width="item.width"
                       :label="item.showName">
        <template slot-scope="scope">
          <image-show width="100" height="50" :id="scope.row[item.fieldName]" v-if="item.fieldName=='goodsImg' && tableHeaderIndex"/>
          <span v-else>{{ scope.row[item.fieldName] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="盘点">
        <template slot-scope="scope">
          <span v-if="scope.row.isInventory">是</span>
          <span v-else>否</span>
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
    <el-dialog :title="title" v-if="goodsLineCodeListOpen" :visible.sync="goodsLineCodeListOpen" fullscreen append-to-body>
      <lin-code v-for="(item,index) in goodsLineCodeList" :key="index" :title="item.goodsName" :code="item.goodsBarCode"></lin-code>
    </el-dialog>
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form Guz="form" :model="form" :rules="rules" label-width="100px">
        <el-tabs tab-position="left" style="height: 450px;">
          <el-tab-pane label="基本信息">
            <el-form-item label="商图片" prop="file">
              <image-upload v-model="form.goodsImg" :limit="1" :file-size="5" :is-show-tip="false"></image-upload>
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
            <el-form-item label="库存" prop="goodsInventoryCount">
              <el-input v-model="form.goodsInventoryCount" placeholder=""/>
            </el-form-item>
            <el-form-item label="剩余预警数" prop="warningCount">
              <el-input v-model="form.warningCount" placeholder="10"/>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="价格信息">
            <el-form-item label="成本价(分):" prop="goodsMinPrice">
              <el-input v-model="form.costPrice" placeholder="请输入商品成本价"/>
            </el-form-item>
            <el-form-item label="售卖价(分):" prop="goodsMaxPrice">
              <el-input v-model="form.salesPrice" placeholder="请输入商品最高价"/>
            </el-form-item>
            <el-form-item label="单位" prop="goodsUnit">
              <el-input v-model="form.goodsUnit" placeholder="请输入商品单位 (个/瓶/箱/件...)"/>
            </el-form-item>
            <el-form-item label="毛利" prop="goodsGrossProfit">
              <el-input v-model="form.goodsGrossProfit" placeholder="10"/>
            </el-form-item>
            <el-form-item label="净利润" prop="goodsNetProfit">
              <el-input v-model="form.goodsNetProfit" placeholder="10"/>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="供应商">
            <el-form-item label="供应商" prop="supplierId">
              <el-select v-model="form.supplierId" placeholder="请选择" :filter-method="selectSupplier" filterable>
                <el-option v-for="item in supplierList" :key="item.id" :label="item.supplierName" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="盘点" prop="isInventory">
              <el-select v-model="form.isInventory" placeholder="请选择">
                <el-option label="是" :value="true"></el-option>
                <el-option label="否" :value="false"></el-option>
              </el-select>
            </el-form-item>
          </el-tab-pane>
        </el-tabs>


      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ImageShow from "@/components/ImageShow/index.vue";
import {add, deleteByIdList, getById, queryPageList, updateById} from '@/api/common'
import linCode from "@/views/system/jcx/goods/linCode.vue";
import item from "@/layout/components/Sidebar/Item.vue";
import {querySupplierPageList} from "@/api/baseSupplier";
// console.info("xxx: ",uc.urlPrefix)
export default {
  name: "goodsName",
  computed: {
    item() {
      return item
    }
  },
  components: {
    ImageShow, linCode
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
      tableHeaderIndex: 1,
      goodsNameList: [],
      goodsLineCodeList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      goodsLineCodeListOpen: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        data: {}
      },
      // 表单参数
      form: {
        supplierId: "",
        isInventory: true,
        goodsInventoryCount: 0,
        goodsGrossProfit: 0,
        goodsNetProfit: 0,
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
        isUsed: true,
      },
      initForm: {
        supplierId: ""
      },
      // 表单校验
      rules: {},
      supplierList: [],
      tableHeaderList: [{
        fieldName: "id",
        showName: "序号",
        width: 200
      }]
    };
  },
  created() {
    document["pagePath"] = "/jcx/goods";
    this.getList();
    Object.assign(this.initForm, this.form);
  },
  methods: {
    /** 查询公告列表 */
    getList() {
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
      this.form = this.initForm;
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
      this.selectSupplier('');
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
        this.selectSupplier('', this.form.supplierId);
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
          this.$forceUpdate()
        });
      } else {
        add(this.form).then(response => {
          this.$modal.msgSuccess("新增成功");
          this.open = false;
          this.tableHeaderIndex++;
          this.getList();
          this.$forceUpdate()
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
    handleCreateLineCode() {
      if (this.ids.length === 0) {
        this.$modal.msgError("请选择商品")
        return;
      }
      this.goodsLineCodeList = []
      this.goodsNameList.filter(t => this.ids.includes(t.id)).forEach(t => {
        this.goodsLineCodeList.push(t);
        this.goodsLineCodeListOpen = true
      })
    },
    selectSupplier(v, id) {
      const params = {pageNum: 1, pageSize: 10, data: {supplierName: v, id: id}};
      return querySupplierPageList(params).then(t => this.supplierList = t.data.dataList)
    }

  }
}
</script>
