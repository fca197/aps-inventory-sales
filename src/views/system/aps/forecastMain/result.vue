<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryForm" :inline="true" :model="queryParams" label-width="100px" size="small">

      <el-form-item label="预测时间" prop="dataRange">
        <el-date-picker v-model="queryParams.dateRange"
                        :value="new Date()"
                        clearable
                        end-placeholder="结束日期"
                        range-separator="至"
                        start-placeholder="开始日期"
                        type="monthrange"
                        value-format="yyyy-MM"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" size="mini" type="primary" @click="getData">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">

      </el-col>
      <right-toolbar :showSearch.sync="showSearch" export-table="dataTable" export-table-file-name="主版本预测结果" @queryTable="getData"></right-toolbar>
    </el-row>
    <div class="header-value">主版本预测结果</div>
    <el-table id="dataTable" :data="tableData.dataList" cellpadding="0" cellspacing="0" show-summary>
      <el-table-column v-for="(item,index) in  tableData.headerList" :key="index" :label="item.showName" :prop="item.fieldName" :width="item.width" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row[item.fieldName]">{{ scope.row[item.fieldName] }}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import {getForecastData} from "@/api/aps/forecastMain";

export default {
  name: "data",
  data() {
    return {
      showSearch: false,
      queryParams: {
        id: this.$route.query.id,
        dateRange: []
      },
      tableData: {}
    }
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      getForecastData(this.queryParams).then(t => {
        // console.log(t)
        this.tableData = t.data;
        this.tableData.headerList [0].width = 600;
        this.tableData.headerList.slice(1).forEach(h => h.width = 180)
      })
    },
    handleAdd() {

    }, resetQuery() {

    }
  }
}
</script>


<style lang="scss" scoped>

</style>
