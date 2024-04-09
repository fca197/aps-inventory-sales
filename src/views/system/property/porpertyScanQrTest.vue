<template>
  <div>
    <el-select v-model="form.checkId" clearable placeholder="请选择">
      <el-option
          v-for="item in reportList"
          :key="item.id"
          :label="  item.reportName +'/'+item.factoryName"
          :value="item.id"
      />
    </el-select>
    <el-input v-model="form.propertyCode" placeholder="请输入"/>
    <el-button type="primary" @click="scanQrTest">扫码测试</el-button>
  </div>
</template>

<script>
import ScanQr from "@/components/QRCode/ScanQr.vue";
import {insertCheckList} from "@/api/property";
import {getReportList} from "@/api/check";

export default {
  name: "propertyScanQr",
  components: {
    "ScanQr": ScanQr
  },
  data() {
    return {
      reportList: [],
      scanQr: null,
      form: {
        checkId: undefined,
        propertyCode: undefined
      }
    };
  },
  created() {
    this.getReportList()
  }
  , methods: {
    getReportList() {
      getReportList({data: {isOver: false}}).then(t => this.reportList = t.data.dataList)
    },
    scanQrTest() {
      let dList = ['3s88LeYibHm']
      dList.forEach(t => this.successFun(t))
    },
    async successFun() {
      insertCheckList(this.form);
    }
  }
}
</script>
