<template>
  <div class="amap-wrapper">
    <el-amap ref="map" :center="center"
             :events="events" :plugin="plugin" :zoom="zoom" class="amap-demo"
             style="height: 800px;width: 100%">
      <el-amap-marker v-for="(u,i) in markers" :key="i" :events="markerEvents" :extData="u" :label="u.showName"
                      :position="u.position"/>
    </el-amap>
  </div>
</template>
<script>
import {selectList} from "@/api/store";

export default {
  name: 'index',
  data() {
    return {
      center: [121.5273285, 31.21515044],
      zoom: 9,
      position: [121.5273285, 31.21515044],
      markerEvents: {},
      events: {},
      markers: [],
      //使用其他组件
      plugin: [],
    };
  },
  created() {
    this.loadStoreList({})
  },
  methods: {
    loadStoreList(data) {
      selectList(data).then(res => {
        let dataList = res.data.dataList;
        this.markers = dataList.map(marker => {
          return {
            position: [parseFloat(marker.lat), parseFloat(marker.lon)],
            showName: {content: marker.storeName, offset: [20, 0]}
          }
        });
        // console.log(this.markers);
      })

    }
  }
}
</script>
