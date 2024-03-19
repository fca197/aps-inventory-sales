<template>
  <div class="imageZoomDiv" v-show="isShow">
    <img :src="data"/>
  </div>
</template>

<script>

import {getImageBase64} from "@/api/fileUpload";

export default {
  name: "ImageShow",
  props: {
    isShow: {},
    id: {},
    data: {}
  },
  data() {
    return {}
  },
  created() {
    this.getFile()
  },
  methods: {
    getFile() {
      getImageBase64(this.id).then(t => {
        this.data = t
      })
    }
  }
};
</script>

<style scoped>
.imageZoomDiv {
  position: absolute;
  width: 100%;
  height: 100%
}

.imageZoomDiv image {
  display: table-cell;
  vertical-align: middle;
}
</style>
