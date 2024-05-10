<template>
  <div class="app-container">

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">

      </el-col>
      <right-toolbar :search="false" :showSearch.sync="showSearch" export-table="dataTable" export-table-file-name="预测计算结果数据" @queryTable="getData"
                     @search="getData"></right-toolbar>
    </el-row>
    <div>(预测)生产数据看板-规划配置</div>
    <el-table id="dataTable" :data="tableData.dataList" cellpadding="0" cellspacing="0" show-summary>
      <el-table-column v-for="(item,index) in  tableData.headerList" :key="index" :label="item.showName" :prop="item.fieldName" :width="(item.width-50)+'px'" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row[item.fieldName]!==0">{{ scope.row[item.fieldName] }}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import {queryProjectDataById} from "@/api/aps/forecastMakeWeek";

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
      queryProjectDataById({id: this.id}).then(t => {
        this.tableData = t.data;
        this.tableData.headerList [0].width = 600;
        this.tableData.headerList.slice(1).forEach(h => h.width = 180)
        // let headerList = t.data.headerList.slice(3);
        // for (let i = 1; i < t.data.dataList.length; i++) {
        //   let item = t.data.dataList[i]
        // headerList.forEach(header => {
        //   // item[header.fieldName] = item[header.fieldName] * 100 + '%'
        // })
        // }
      })
    },
    handleAdd() {

    }
  }
}
</script>


<style lang="scss" scoped>

</style>
