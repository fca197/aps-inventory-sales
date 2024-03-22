<template>
  <div class="line-code-div" :id="'lineCode_parent_'+this.code">
    <img :id="'lineCode_'+this.code" :alt="this.title" src=""/>
    <br/>
    <div> {{ title }}</div>
  </div>
</template>
<script>
import JsBarcode from "jsbarcode";

export default {
  name: "LinCode",
  props: {
    code: {},
    title: {}
  },
  created() {

  },
  mounted() {
    // console.info(this.code, this.title)
    this.createLinCode();
    // console.info("3", this.code, this.title)
  },
  methods: {
    createLinCode() {
      if (this.code) {
        let linCodeImg = document.getElementById("lineCode_" + this.code);
        JsBarcode(linCodeImg, this.code, {
          format: "CODE128", //条形码的格式
          width: 2, //线宽
          height: 50, //条码高度
          lineColor: "#000", //线条颜色
          displayValue: false, //是否显示文字
          margin: 2 //设置条形码周围的空白区域
        })
      }
    }
  }
}
</script>


<style scoped lang="scss">
.line-code-div {
  width: 250px;
  display: inline-block;
  border-right: #eee 1px solid;
  border-bottom : #eee 1px solid;
  margin: 0 10px 15px 0;
  text-align: center;
}
.line-code-div:after {
  content: "";
  margin: 0  20px;
}
.line-code-div > img {
  padding: 10px 20px 10px;
}

.line-code-div > div {
  text-align: center;
}
</style>
