<template>


  <el-dialog
      :visible.sync="isShow.enabled"
      append-to-body
      fullscreen
  >
    <div class="imageZoomDiv">
      <img :src="imgDataProps"/>
    </div>

  </el-dialog>
</template>

<script>

export default {
  name: "ImageZoom",
  props: {
    isShow: {
      enabled: undefined
    },
    id: {},
    imgDataProps: {}
  },
  data() {
    return {
      imgData: undefined
    }
  },
  created() {
    // this.getFile()
  },
  methods: {
    closeOthersTags() {
      this.isShow.enabled = false;
    }
  }
};
</script>

<style scoped>
.imageZoomDiv {
  width: 100%;
  background: #aaa;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;

}

.imageZoomDiv > img {

  max-width: 40%;
  max-height: 60%;
  position: absolute;
  background: #55a9ff;
  top: 25%;
  left: 25%;
  right: 25%;
  bottom: 25%;
  margin: auto;

}

</style>
