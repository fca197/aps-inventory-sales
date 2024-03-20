<template>
  <div>
    <img :src="data" :width="width" :height="height" @click="showImg"/>
    <image-zoom  :is-show=" this.zoomIsShow" :img-data-props="data" :id="id"/>
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

      zoomIsShow:{
        enabled:false
      } ,
      data: undefined
    };
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
