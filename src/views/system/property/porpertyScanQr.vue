<template>

  <div style="text-align: -webkit-center" class="page-scan-div ">
    <table width="100%" style="margin: 20px 0px">
      <tbody>
      <tr>
        <td width="40%" style="text-align: right"> 盘点版本</td>
        <td width="50%">
          <el-select v-model="form.checkId" placeholder="请选择" clearable>
            <el-option
                v-for="item in reportList"
                :key="item.id"
                :label="  item.reportName +'/'+item.factoryName"
                :value="item.id"
            />
          </el-select>
        </td>
        <td></td>
      </tr>
      </tbody>
    </table>
    <scan-qr :success-fun="successFun"></scan-qr>
  </div>

</template>

<script>
import ScanQr from "@/components/QRCode/ScanQr.vue";
import {getReportList} from "@/api/check";
import {insertCheckList} from "@/api/property";

export default {
  name: "propertyScanQr",
  components: {
    "ScanQr": ScanQr
  },
  data() {
    return {
      reportList: [],
      form: {
        checkId: undefined,
        propertyCode: undefined
      },
      scanQr: null,
    };
  },
  created() {
    this.getReportList()
  }
  , methods: {
    getReportList() {
      return getReportList({data: {isOver: false}}).then(t => this.reportList = t.data.dataList)
    },
    async successFun(text) {
      if (this.form.checkId === undefined || this.form.checkId === '') {
        this.$message.error("请先选择盘点版本");
        return;
      }
      this.form.propertyCode = text.text;
      return insertCheckList(this.form);
    }

  }
}
</script>

<style scoped>
.page-scan-div {
  text-align: -webkit-center;
  overflow-y: hidden;
  background-color: #8492a6;
  height: 100%;
  margin: 0;
  padding: 0;
  width: 100%;
  position: absolute;
}
</style>
