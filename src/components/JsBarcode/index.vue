<template>
  <div>
    <svg ref="barcode"></svg>
  </div>
</template>

<script>
import JsBarcode from 'jsbarcode';

export default {
  props: {
    value: {
      type: String,
      required: true
    },
    format: {
      type: String,
      default: 'CODE128'
    },
    width: {
      type: Number,
      default: 2
    },
    height: {
      type: Number,
      default: 100
    },
    // 其他你需要的props
  },
  mounted() {
    this.generateBarcode();
  },
  watch: {
    value() {
      this.generateBarcode();
    }
  },
  methods: {
    generateBarcode() {
      JsBarcode(this.$refs.barcode, this.value, {
        format: this.format,
        width: this.width,
        height: this.height,
        // 其他你需要的配置
      });
    }
  }
};
</script>
