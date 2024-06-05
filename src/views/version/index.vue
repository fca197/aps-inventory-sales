<template>
  <div style="width: 95%">
    <el-timeline>
      <el-timeline-item v-for="item in projectTimeLineList" :key="item.time" :color="item.color"
                        :timestamp="item.time" placement="top">
        <el-card>
          <h4>{{ item.title }}</h4>
          <p>{{ item.content }}</p>
        </el-card>
      </el-timeline-item>

    </el-timeline>
  </div>
</template>

<script>
import VersionChangeData from "@/common/VersionChangeData";

export default {
  name: "index",
  data() {
    return {
      projectTimeLineList: VersionChangeData
    }
  }
}
</script>


<style scoped lang="scss">

</style>
