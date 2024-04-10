<template>
  <div id="app">
    <router-view/>
    <theme-picker/>
  </div>
</template>

<script>
import ThemePicker from "@/components/ThemePicker";
import watermark from 'watermark-dom'
import Cookies from "js-cookie";

export default {
  name: "App",
  components: {ThemePicker},
  metaInfo() {
    return {
      title: this.$store.state.settings.dynamicTitle && this.$store.state.settings.title,
      titleTemplate: title => {
        return title ? `${title} - ${process.env.VUE_APP_TITLE}` : process.env.VUE_APP_TITLE
      }
    }
  },mounted() {
    let username =  Cookies.get("username");
    if(username){
      let now = new Date();
      let year = now.getFullYear();
      let month = now.getMonth()+1;
      let day = now.getDate();
      month = month<10?'0'+month:month;
      day = day<10?'0'+day:day;
      let date = year+'-'+month+'-'+day;
      watermark.load({ watermark_txt: username+','+date ,
        // 水印起始位置x轴坐标
        watermark_x: 100,
        // 水印起始位置Y轴坐标
        watermark_y: 0,
        // 水印行数
        watermark_rows: 5,
        // 水印列数
        watermark_cols: 10,
        // 水印x轴间隔
        watermark_x_space: 0,
        // 水印y轴间隔
        watermark_y_space: 0,
        // 水印字体颜色
        watermark_color: '#ddd',
        // 水印透明度
        watermark_alpha: 0.4,
        // 水印字体大小
        watermark_fontsize: '13px',
        // 水印字体
        watermark_font: '微软雅黑',
        // 水印宽度
        watermark_width: 200,
        // 水印长度
        watermark_height: 100,
        // 水印倾斜度数
        watermark_angle: 20
      })
    }
  }
};
</script>
<style scoped>

#app .theme-picker {
  display: none;
}

</style>
