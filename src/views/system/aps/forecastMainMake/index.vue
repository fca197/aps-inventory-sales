<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryForm" :inline="true" :model="queryParams" label-width="100px" size="small">
      <el-form-item label="预测产品" prop="goodsId">
        <el-select v-model="queryParams.data.goodsId" placeholder="请选择预测产品" @change="getList">
          <el-option v-for="item in goodsList" :key="item.id" :label="item.goodsName" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="预测主版本名称" prop="brandName">
        <el-input v-model="queryParams.data.forecastName" clearable placeholder="请输入主预测名称" @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" size="mini" type="primary" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>


    <el-table :data="forecastList" @selection-change="handleSelectionChange">
      <el-table-column align="center" label="全选" prop="id" type="selection" width="50"/>
      <el-table-column v-for="(item,index) in  tableHeaderList" :key="index" :label="item.showName" :prop="item.fieldName" align="center" width="180px"/>
      <el-table-column align="center" class-name="small-padding fixed-width" label="操作">
        <template slot-scope="scope">
          <el-button icon="el-icon-s-data" size="mini" type="text" @click="handleData(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :limit.sync="queryParams.pageSize" :page.sync="queryParams.pageNum" :total="total" @pagination="getList"/>

  </div>
</template>

<script>
import {getGoodsList} from "@/api/aps/goods";
import {deleteByIdList, queryPageList} from "@/api/common";

export default {
  name: "forecastIndex",
  data() {
    return {

      title: "",
      goodsList: [],
      ids: [],
      forecastList: [],
      tableHeaderList: [],
      form: {
        fileId: "",
        forecastNo: "",
        forecastBeginDate: "",
        forecastEndDate: ""
      },
      queryParams: {
        data: {
          goodsId: null,
          forecastCode: "",
          forecastName: ""
        },
        pageNum: 1,
        pageSize: 10,
      },
      open: false,
      uploadOpen: false,
      single: false,
      multiple: false,
      showSearch: true,
      total: 0,
    }
  },
  created() {
    document["pagePath"] = "/apsGoodsForecastMainMake";
    getGoodsList({pageNum: 1, pageSize: 999}).then(t => {
      this.goodsList = t.data.dataList
      this.getList();
    })
  },
  methods: {
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    resetQuery() {
    },
    handleQuery() {
      this.getList()
    },
    getList() {
      queryPageList(this.queryParams).then(t => {
        this.forecastList = t.data.dataList
        this.tableHeaderList = t.data.headerList
        this.total = parseInt(t.data.total)
      })
    },
    handleAdd() {
      this.title = "新增预测版本"
      this.open = true;
      this.form.forecastNo = "YC-" + this.formatDates(new Date(), true);
    },
    handleDelete(row) {
      let idList = this.ids;
      if (row && row.id) {
        idList[0] = row.id;
      }
      deleteByIdList({idList: idList}).then(t => {
        this.$modal.msgSuccess("删除成功")
        this.getList();
      })

    }, cancel() {
      this.open = false;
    },
    handleData(row) {
      this.$tab.openPage("(预)生产数据", "/apsGoodsForecastMainMakeWeek/queryDataDataById", {id: row.id})
    }
  }
}
</script>


<style lang="scss" scoped>

</style>
