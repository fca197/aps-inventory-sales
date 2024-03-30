<template>
  <div class="app-container">
    <div>预测数据</div>
    <el-table :data="tableData.dataList" cellpadding="0" cellspacing="0">
      <el-table-column v-for="(item,index) in  tableData.headerList" :key="index" align="center" :prop="item.fieldName" :label="item.showName"/>
    </el-table>
  </div>
</template>

<script>
import {getForecastData} from "@/api/aps/forecast";

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

    }
  }
}
</script>


<style scoped lang="scss">

</style>
