<template>
  <div>
    <el-table :data="tableData.dataList" cellpadding="0" cellspacing="0">
      <el-table-column v-for="(item,index) in  tableData.headerList" :key="index" :label="item.showName" :prop="item.fieldName" align="center"/>
    </el-table>
    <div class="right">
      共计 <span class="count">{{ tableData.dataList ? tableData.dataList.length : 0 }}</span> 条
    </div>
  </div>
</template>

<script>
export default {
  name: "index",
  props: {
    tableData: {
      headerList: [],
      dataList: []
    }
    , showPage: {
      type: Boolean,
      default: true
    }
  },
}
</script>


<style lang="scss" scoped>

</style>
