<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="100px">

      <el-form-item label="预测时间" prop="dataRange">
        <el-date-picker clearable
                        v-model="queryParams.dateRange"
                        type="monthrange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="yyyy-MM"
                        :value="new Date()"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="getData">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getData"></right-toolbar>
    </el-row>

    <div>主版本预测结果</div>
    <el-table :data="tableData.dataList" cellpadding="0" cellspacing="0">
      <el-table-column v-for="(item,index) in  tableData.headerList" :key="index" align="center" :width="item.width" :prop="item.fieldName" :label="item.showName">
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


<style scoped lang="scss">

</style>
