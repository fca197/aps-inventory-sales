<template>

  <el-row class="header-div ">
    <el-col :span="12" class="header-title">{{ label }}</el-col>
    <el-col :span="12" class="header-value">{{ value }}</el-col>
  </el-row>
</template>

<script>
export default {
  name: 'kv',
  props: {
    label: {},
    value: {}
  }
}
</script>


<style scoped lang="scss">

</style>
