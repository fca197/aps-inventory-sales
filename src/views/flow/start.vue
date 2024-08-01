<template>
  <div class="app-container">
    <div>
      <div class="title">常用应用</div>
    </div>
    <div>
      <div class="title">所有应用</div>
      <el-row v-for="(item, index) in flowGroupList" :key="index">
        <div class="groupName"> {{ item.flowGroupName }}</div>
        <el-col :span="1" class="flowInfo" v-for="(item, index) in item.flowList" :key="index">
          <el-button type="primary" @click="startFlow(item)"> {{ item.flowName }}</el-button>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { post, queryUrlNoPageList } from '@/api/common'

export default {
  name: 'start.vue',
  data() {
    return {
      flowGroupList: []
    }
  },
  created() {
    this.getFlowGroupList()
  },
  methods: {
    getFlowGroupList() {
      queryUrlNoPageList('/flowGroup').then(t => this.flowGroupList = t.data.dataList)
    },
    startFlow(flow) {
      console.log(flow)
      this.$modal.confirm('是否发起' + flow.flowName + '？', '发起提示').then(function() {
        return post("/flow/repository/start",flow);
      }).then(() => {
      })
    }
  }
}
</script>


<style scoped lang="scss">
.app-container > div {

}

.title {
  color: #b65959;
  font-weight: 900;
  line-height: 50px;
}

.groupName {
  font-weight: 600;
  line-height: 40px;
}

.flowInfo {
  margin: 10px 20px;

}

</style>
