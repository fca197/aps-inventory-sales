<template>
  <div>
    <el-select v-model="form.checkId" placeholder="请选择" clearable>
      <el-option
          v-for="item in reportList"
          :key="item.id"
          :label="  item.reportName +'/'+item.factoryName"
          :value="item.id"
      />
    </el-select>
    <el-input v-model="form.propertyCode" placeholder="请输入" />
    <el-button type="primary" @click="scanQrTest">扫码测试</el-button>
  </div>
</template>

<script>
import ScanQr from "@/components/QRCode/ScanQr.vue";
import {insertCheckList} from "@/api/property";
import {getReportList} from "@/api/check";
import {showMsg} from "@/api/common";

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
      getReportList({data:{isOver:false}}).then(t => this.reportList = t.data.dataList)
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
