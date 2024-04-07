<template>
  <div class="app-container">

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">

      </el-col>
      <right-toolbar export-table-file-name="预测计算结果数据" export-table="dataTable" :showSearch.sync="showSearch" @queryTable="getData"></right-toolbar>
    </el-row>
    <div>(预)周数据</div>
    <el-table :data="tableData.dataList" cellpadding="0" id="dataTable" cellspacing="0"  show-summary>
      <el-table-column v-for="(item,index) in  tableData.headerList" :key="index" align="center"  :width="(item.width-50)+'px'" :prop="item.fieldName" :label="item.showName">
        <template slot-scope="scope">
          <span v-if="scope.row[item.fieldName]">{{scope.row[item.fieldName]}}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { queryDataById} from "@/api/aps/forecastMakeWeek";

export default {
  name: "data",
  data() {
    return {
      showSearch:false,
      id: this.$route.query.id,
      tableData: {}
    }
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      queryDataById({id:this.id}).then(t => {
        this.tableData = t.data;
        this.tableData.headerList [0].width = 600;
        this.tableData.headerList.slice(1).forEach(h=>h.width = 180)
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


<style scoped lang="scss">

</style>
