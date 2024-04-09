<template>

  <div class="pDiv">
    <img v-show="!isFakeData" :alt="propertyName" :src="dataURL">
    <div v-show="isFakeData" :id="id" class="qrCodeDiv">
      <div :ref="id" class="qrCodeDivItem">
      </div>
      <div style="text-align: center"> {{ this.code }}</div>
      <div style="text-align: center"> {{ this.storeyName }}/{{ this.roomName }}/{{ this.propertyName }}</div>
    </div>
  </div>
</template>
<script>
import QRCode from "qrcodejs2"

import html2Canvas from 'html2canvas';

export default {
  data() {
    return {
      dataURL: undefined,
      isFakeData: true,
    }
  },
  props: {
    id: undefined,
    code: undefined,
    roomName: undefined,
    propertyName: undefined,
    storeyName: undefined,
    factoryName: undefined

  },
  name: "qr",

  mounted() {
    this.creatQrCode();
  },
  created() {
  },
  methods: {

    creatQrCode() {
      let _size = 100;
      new QRCode(this.$refs[this.id], {
        text: this.code, // 需要转换为二维码的内容
        width: _size,
        height: _size,
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.H
      })
      // this.exportPic(this.id, '测试');
    },
// 导出图片
    async exportPic(DivID) {
      let _this = this;

      let div = document.getElementById(DivID);
      html2Canvas(div, {
        useCORS: true
      }).then(canvas => {
        let dataURLTmp = canvas.toDataURL("image/png");
        console.log(dataURLTmp);
        this.dataURL = dataURLTmp;
        this.isFakeData = false;
      })
    }
  }
}
</script>
<style scoped>
.qrCodeDiv {
  display: inline-block;
  text-align: -webkit-center;
  padding: 10px;
}

.pDiv {
  border-right: #eee 1px solid;
  border-bottom: #eee 1px solid;
}
</style>
