<template>
  <div   v-loading="setting.loadIngData">
    <el-form-item v-for="(item ,index) in setting.flowFormItemDtoList " :label="item.formItemName" :key="index+item.formItemName">
        <el-input :disabled="setting.canEdit===false" @input="value=>{updateInput(item.formItemFiled, value)}"   v-model="setting.submitFrom[item.formItemFiled]"  v-if="item.formItemValueType==='str' "    :placeholder="item.formItemDefaultValue"
        ></el-input>

      <el-input :disabled="setting.canEdit===false" @input="value=>{updateInput(item.formItemFiled, value)}"    v-if="item.formItemValueType==='number' " type="number" v-model="setting.submitFrom[item.formItemFiled]"
                :placeholder="item.formItemDefaultValue"
      ></el-input>
      <el-date-picker style="width: 100%" :disabled="setting.canEdit===false" @input="value=>{updateInput(item.formItemFiled, value)}"
                      v-if="item.formItemValueType==='date' " v-model="setting.submitFrom[item.formItemFiled]" type="date" value-format="yyyy-MM-dd" placeholder="选择日期"
      ></el-date-picker>
      <!--        time-->
      <el-time-picker style="width: 100%" :disabled="setting.canEdit===false" v-if="item.formItemValueType==='time' " value-format="HH:mm:ss"
                      v-model="setting.submitFrom[item.formItemFiled]"
                      type="time"  @input="value=>{updateInput(item.formItemFiled, value)}"
                      placeholder="选择时间"
      ></el-time-picker>
      <!--        select-->
      <el-select style="width: 100%" :disabled="setting.canEdit===false" v-if="item.formItemValueType==='select' " v-model="setting.submitFrom[item.formItemFiled]"
                 placeholder="请选择"  @input="value=>{updateInput(item.formItemFiled, value)}"
      >
        <el-option v-for="(option,index) in JSON.parse(item.formItemValue)" :key="'select'+index+option.id" :label="option.label" :value="''+option.id"> {{ option.label }}
        </el-option>
      </el-select>
      <el-checkbox-group :disabled="setting.canEdit===false"  @input="value=>{updateInput(item.formItemFiled, value)}" style="width: 100%" v-if="item.formItemValueType==='checkbox' " v-model="setting.submitFrom[item.formItemFiled]">
        <el-checkbox v-for="(option) in JSON.parse(item.formItemValue)" :key="'checkbox'+option.id" :label="option.id" :value="''+option.id">{{ option.label }}</el-checkbox>
      </el-checkbox-group>
    </el-form-item>

  </div>
</template>

<script>

export default {
  name: 'taskFlowItemDetail.vue',
  props: {
    setting: {
      canEdit: true,
      submitFrom: {},
      flowFormItemDtoList: []
    }

  },
  watch: {

  },
  data() {
    return {}
  },
  created() {
    this.loadData()
  },
  mounted() {

  },
  beforeCreate() {

  },
  methods: {
    loadData() {
    },
    updateInput(v1,v3){
      // console.log('v1',v1,v2,v3)
      this.$set(this.setting.submitFrom,v1,v3)
      this.$forceUpdate()
      // this.setting.submitFrom[v1]=v3
    }

  }
}
</script>


<style scoped lang="scss">

</style>
