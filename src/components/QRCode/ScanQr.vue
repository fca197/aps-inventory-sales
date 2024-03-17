<template>
  <div class="page-scan">

    <!-- 扫码区域 -->
    <video style="width: 400px; height: 400px" ref="video" id="video" class="scan-video" autoplay></video>
    <!-- 提示语 -->
    <div v-show="tipShow" class="scan-tip">{{ tipMsg }}</div>
    <el-button style="text-align: -webkit-center;margin-bottom: 50px" type="primary" @click="openScan"> {{ scanBtnTitle }}</el-button>
  </div>
</template>

<script>
import {BrowserMultiFormatReader} from "@zxing/library";

export default {

  props: {
    checkId: {
      type: String,
      default: ""
    },
    successFun: {
      type: Function,
      default: (text) => {
        this.tipMsg = "扫码结果: " + text;
      }
    }
  },
  components: {},
  name: "scanCodePage",
  data() {
    return {
      scanBtnTitle: "开始扫描",
      loadingShow: false,
      codeReader: null,
      scanText: "",
      vin: null,
      tipMsg: "正在尝试识别....",
      tipShow: true,
    };
  },
  created() {
    this.codeReader = new BrowserMultiFormatReader();
    this.codeReader.reset();
    this.tipMsg = "请扫描资产二维码";
  },
  beforeDestroy() {
    document.getElementById("video").srcObject.getTracks()[0].stop();
  },
  watch: {},
  methods: {
    async openScan() {
      if(this.checkId===''){
        this.$message.error({
          message: '请先选择盘点版本',
          type: 'warning'
        });
        return;
      }
      this.scanBtnTitle = "重新扫描"
      this.codeReader
      .getVideoInputDevices()
      .then((videoInputDevices) => {
        this.tipShow = true;
        this.tipMsg = "正在调用摄像头...";
        // 默认获取第一个摄像头设备id
        let firstDeviceId = videoInputDevices[0].deviceId;
        // 获取第一个摄像头设备的名称
        const videoInputDeviceslablestr = JSON.stringify(
            videoInputDevices[0].label
        );
        if (videoInputDevices.length > 1) {
          // 判断是否后置摄像头
          if (videoInputDeviceslablestr.indexOf("back") > -1) {
            firstDeviceId = videoInputDevices[0].deviceId;
          } else {
            firstDeviceId = videoInputDevices[1].deviceId;
          }
        }
        this.decodeFromInputVideoFunc(firstDeviceId);
      })
      .catch((err) => {
        this.tipShow = false;
        console.error(err);
      });
    },
    async openScanTwo() {
      this.codeReader = await new BrowserMultiFormatReader();
      this.codeReader
      .getVideoInputDevices()
      .then((videoInputDevices) => {
        this.tipShow = true;
        this.tipMsg = "正在调用摄像头...";
        // 默认获取第一个摄像头设备id
        let firstDeviceId = videoInputDevices[0].deviceId;
        // 获取第一个摄像头设备的名称
        const videoInputDeviceslablestr = JSON.stringify(
            videoInputDevices[0].label
        );
        if (videoInputDevices.length > 1) {
          // 判断是否后置摄像头
          if (videoInputDeviceslablestr.indexOf("back") > -1) {
            firstDeviceId = videoInputDevices[0].deviceId;
          } else {
            firstDeviceId = videoInputDevices[1].deviceId;
          }
        }
        this.decodeFromInputVideoFunc(firstDeviceId);
      })
      .catch((err) => {
        this.tipShow = false;
        console.error(err);
      });
    },
    decodeFromInputVideoFunc(firstDeviceId) {
      this.codeReader.reset(); // 重置
      this.scanText = "";
      this.codeReader.decodeFromInputVideoDeviceContinuously(
          firstDeviceId,
          "video",
          (result, err) => {
            this.tipMsg = "正在尝试识别...";
            this.scanText = "";
            if (result) {
              //这里是扫码后的结果，具体怎么用要看项目需求
              this.tipMsg = "扫码成功"
              if (this.successFun !== undefined) {
                this.successFun(result)
              }
            }
            if (err && !err) {
              this.tipMsg = "识别失败";
              setTimeout(() => {
                this.tipShow = false;
              }, 2000);
              console.error(err);
            }
          }
      );
    },

  },
};
</script>

<style scoped>
/deep/ .van-nav-bar__title {
  font-size: 18px;
  font-weight: 800;
}

/deep/ .van-nav-bar .van-icon {
  color: #333;
  font-size: 24px;
}

.scan-video {
  height: 80vh;
  width: 100%;
}

.scan-tip {
  text-align: center;
  margin-bottom: 10vh;
  color: white;
  font-size: 2vw;
}

.page-scan {
  text-align: -webkit-center;
  overflow-y: hidden;
  margin-bottom: 0;

}
</style>
