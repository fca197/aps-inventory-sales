<template>
  <div class="app-container">
    <div>计算结果</div>
    <el-table :data="tableData.dataList" cellpadding="0" cellspacing="0"  show-summary>
      <el-table-column v-for="(item,index) in  tableData.headerList" :key="index" align="center"  :width="item.width" :prop="item.fieldName" :label="item.showName">
        <template slot-scope="scope">
          <span v-if="scope.row[item.fieldName]">{{scope.row[item.fieldName]}}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import {computeResult, getForecastData} from "@/api/aps/forecast";

export default {
  name: "data",
  data() {
    return {
      id: this.$route.query.id,
      tableData: {}
    }
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      computeResult({id:this.id}).then(t => {
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
