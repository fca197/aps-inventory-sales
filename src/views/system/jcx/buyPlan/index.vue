<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="88px">
      <el-form-item label="计划名称" prop="jcxBuyPlan">
        <el-input v-model="queryParams.data.planName" placeholder="请输入文件名称" clearable
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

    <el-table v-loading="loading" :data="jcxBuyPlanList" @selection-change="handleSelectionChange">

      <el-table-column label="全选" type="selection" align="center" prop="id" width="50"/>
      <el-table-column v-for="(item,index) in  tableHeaderList" :key="index" align="center" :prop="item.fieldName"
                       :width="item.width+'px'"
                       :label="item.showName">
        <template slot-scope="scope">
          <div v-if="Number(scope.row[item.fieldName])">{{ scope.row[item.fieldName] }}</div>
          <div v-else-if="scope.row[item.fieldName].length>=30">
            <el-popover
                placement="top-start"
                width="200"
                trigger="hover"
                :content="''+scope.row[item.fieldName]">
              <div slot="reference">{{ scope.row[item.fieldName].substring(0, 30) + '...' }}</div>
            </el-popover>
          </div>
          <div v-else>{{ scope.row[item.fieldName] }}</div>
        </template>

      </el-table-column>
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
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <update-buy-plan :buy-plan-info="buyPlanFormData"/>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="upById">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {urlPrefix} from '@/api/brand'
import UpdateBuyPlan from "@/views/system/jcx/buyPlan/UpdateBuyPlan.vue";
import {add, deleteByIdList, getById, queryPageList, updateById} from '@/api/common'
// console.info("xxx: ",uc.urlPrefix)
export default {
  components: {
    UpdateBuyPlan
  },
  name: "jcxBuyPlan",
  data() {
    return {
      buyPlanFormData: {},
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

      jcxBuyPlanList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        data: {
          planName: undefined
        }
      },
      // 表单参数
      form: {
        remark: "",
        jcxBuyPlan: "",
        brandCode: "",
        pwd: "",
        id: undefined,
        isUsed: true
      },
      // 表单校验
      rules: {

        jcxBuyPlan: [
          {required: true, message: "文件名称", trigger: "blur"}
        ],
        brandCode: [
          {required: true, message: "文件编码不能为空", trigger: "blur"},
          {min: 1, max: 20, message: "长度在 1 到 20 个字符", trigger: "blur"}
        ]
      },
      tableHeaderList: [{
        columnName: "id",
        showName: "序号"
      }, {
        columnName: "brandCode",
        showName: "文件编码"
      }, {
        columnName: "jcxBuyPlan",
        showName: "文件名称"
      }]
    };
  },
  created() {
    document["pagePath"] = "/jcxBuyPlan";
    this.getList();
  },
  methods: {
    /** 查询公告列表 */
    getList() {
      // this.loading = true;
      queryPageList(this.queryParams).then(response => {
        response = response.data
        this.tableHeaderList = response.headerList
        this.tableHeaderList.splice(2, 0, {fieldName: "goodsName", showName: "商品名称", width: 150})
        this.jcxBuyPlanList = response.dataList;
        this.jcxBuyPlanList.forEach(t => {
          // t.costPriceTotal = t.costPriceTotal/100.0 ;
          // t.goodsGrossProfitTotal = t.goodsGrossProfitTotal / 100.0;
          // t.goodsNetProfitTotal = t.goodsNetProfitTotal / 100.0;
          // t.salesPriceTotal = t.salesPriceTotal / 100.0;
          t.goodsName = t.jcxBuyPlanItemDtoList.map(t => t.goodsName).join(",")
        })
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
        brandCode: "",
        id: undefined,
        jcxBuyPlan: undefined,
        isUsed: true
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
      this.title = "添加采购计划";
      let d = this.formatDates(new Date()).replaceAll("-", "").replaceAll(" ", "").replaceAll(":", "");
      this.buyPlanFormData = {
        planName: '新建采购-' + d,
        jcxBuyPlanItemDtoList: []
      }
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      // this.reset();
      let req = {idList: [row.id], pageSize: 1, pageNum: 1};
      getById(req).then(response => {
        // console.info("response: ", response)
        this.buyPlanFormData = response.data.dataList[0]
        this.open = true;
        this.title = "修改采购计划";
      });

    },
    upById() {
      let d = {...this.buyPlanFormData}
      d.jcxBuyPlanItemDtoList = d.jcxBuyPlanItemDtoList.filter(t => t.isTmp !== '1')
      if (this.buyPlanFormData.id === undefined) {
        return add(d).then(response => {
          this.$modal.msgSuccess("新增成功");
          this.open = false;
          this.getList();
        });
      } else {
        return updateById(d).then(response => {
          this.$modal.msgSuccess("修改成功");
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
    }
  }
};
</script>
