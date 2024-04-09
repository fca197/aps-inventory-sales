<template>
  <div>
    <img v-if="data&&data.length>0" :height="height" :src="data" :width="width" class="errorImgDiv" @click="showImg"/>
    <div v-else class="errorImgDiv" style="border: #ccc 1px  solid"></div>
    <image-zoom :id="id" :img-data-props="data" :is-show=" this.zoomIsShow"/>
  </div>
</template>

<script>
import ImageZoom from "@/components/ImageZoom/index.vue";
import {getImageBase64} from "@/api/fileUpload";

export default {
  name: "ImageShow",
  components: {
    ImageZoom
  },
  props: {
    id: {},
    width: {
      default: 200
    },
    height: {
      default: 100
    }

  },
  data() {
    return {

      zoomIsShow: {
        enabled: false
      },
      data: undefined
    };
  },
  mounted() {
    this.$el.style.setProperty("--main-height", this.height + "px")
    this.$el.style.setProperty("--main-width", this.width + "px")
  },
  created() {
    this.getFileBase64();
  },
  methods: {
    getFileBase64() {
      if (this.id) {
        getImageBase64(this.id).then(response => {
          this.data = response;
        });
      }
    },
    showImg() {
      this.zoomIsShow.enabled = true
    }
  }
};
</script>

<style ref="style">
:root {
  --main-height: 100px;
  --main-width: 100px;
}

.errorImgDiv {
  height: var(--main-height);
  width: var(--main-width);
  border-radius: 1px
}
</style>
