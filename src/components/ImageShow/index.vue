<template>
  <div>
    <img class="errorImgDiv" :src="data" v-if="data&&data.length>0" :width="width" :height="height" @click="showImg"/>
    <div  style="border: #ccc 1px  solid" class="errorImgDiv" v-else></div>
    <image-zoom :is-show=" this.zoomIsShow" :img-data-props="data" :id="id"/>
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
    this.$el.style.setProperty("--main-height", this.height+"px")
    this.$el.style.setProperty("--main-width", this.width+"px")
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
