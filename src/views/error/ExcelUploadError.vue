<template>

  <el-table :data="excelErrorMsgList">
    <el-table-column prop="errMsg" label="错误信息"></el-table-column>
    <el-table-column prop="columnName" label="列名"></el-table-column>
    <el-table-column prop="rowIndex" label="行号"></el-table-column>
  </el-table>

</template>

<script>
export default {
  name: 'ExcelUploadError',
  props: {
    excelErrorMsgList: {
      type: Array
    }
  }
}
</script>


<style scoped lang="scss">

</style>
