<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">

      </el-col>
      <right-toolbar :showSearch.sync="showSearch" export-table="dataTable" export-table-file-name="预测结果" @queryTable="getData"></right-toolbar>
    </el-row>
    <div>预测数据</div>
    <el-table id="dataTable" :data="tableData.dataList" :summary-method="getSummaries" cellpadding="0" cellspacing="0" show-summary>
      <el-table-column v-for="(item,index) in  tableData.headerList" :key="index" :label="item.showName" :prop="item.fieldName" align="center"/>
    </el-table>
  </div>
</template>

<script>
import {getForecastData} from "@/api/aps/forecast";

export default {
  name: "data",
  data() {
    return {
      showSearch: false,
      id: this.$route.query.id,
      tableData: {}
    }
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      getForecastData(this.id).then(t => {
        this.tableData = t.data;
        let headerList = t.data.headerList.slice(3);
        for (let i = 1; i < t.data.dataList.length; i++) {
          let item = t.data.dataList[i]
          headerList.forEach(header => {
            item[header.fieldName] = item[header.fieldName] * 100 + '%'
          })
        }
      })
    },
    handleAdd() {

    },
    getSummaries(param) {
      const {columns, data} = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计';
          return;
        }
        if (index === 1 || index === 2) {
          sums[index] = '';
          return;
        }
        const values = data.slice(0).map(item => Number(item[column.property]) ? Number(item[column.property]) : Number(item[column.property].replaceAll("%", "")));
        const t = values[0];
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          sums[index] = t + "/" + (sums[index] - t) + '%';
        } else {
          sums[index] = t + "/" + 'N/A';
        }
      });

      return sums;
    }
  }
}
</script>


<style lang="scss" scoped>

</style>
