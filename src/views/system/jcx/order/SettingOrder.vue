<template>
  <div>
    <table>
      <tr>
        <td>序号</td>
        <td>{{ orderId }}/{{ settingOpenId }}</td>
      </tr>
      <tr>
        <td>订单号</td>
        <td>{{ oderNo }}</td>
      </tr>
    </table>
    {{ settingOpenInfo.id }}/{{ settingOpenInfo.orderNo }}
    <el-button @click="cancel">取消</el-button>
  </div>
</template>

<script>
import {getById} from "@/api/common";

export default {
  name: "SettingOrder",
  props: {
    settingOpenId: {},
    settingOpenInfo: {},
    settingOpen: {}

  },
  data() {
    return {
      oderNo: '',
      orderId: ''
    }
  },
  watch: {
    settingOpenId: {
      deep: true,
      handler(newVal, oldVal) {
        console.log("watch settingOpenId ", newVal, " oldVal", oldVal)
        var id = newVal !== undefined ? newVal : oldVal
        this.loadOrderInfo(id)
      }
    },
    settingOpenInfo: {
      deep: true,
      handler(newVal, oldVal) {
        console.log("watch settingOpenInfo ", newVal, " oldVal", oldVal)
        // var id = newVal !== undefined ? newVal : oldVal
        // this.loadOrderInfo(id)
      }
    }
  },
  created() {

  },
  beforeUpdate(){
    console.log("beforeUpdate settingOpenInfo ", this.settingOpenInfo)
  },
  computed() {
    console.log("computed settingOpenInfo ", this.settingOpenInfo)
    this.loadOrderInfo(this.settingOpenInfo.id)
  },
  mounted() {
    console.log("mounted settingOpenInfo ", this.settingOpenInfo)
    this.loadOrderInfo(this.settingOpenInfo.id)
  },
  methods: {
    loadOrderInfo(id) {
      console.log("id ", id)
      if (id === undefined) {
        return;
      }
      return getById({idList: [id]}).then(t => {
        var data = t.data.dataList[0];
        if (data) {
          this.oderNo = data.orderNo
          this.orderId = data.id
        }
      })
    },
    cancel() {
      this.$emit('close', false)
    },
  }
}
</script>


<style scoped lang="scss">

</style>
