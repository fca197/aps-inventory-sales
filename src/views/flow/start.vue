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
    <el-dialog :visible.sync="open" title="填写信息" width="80%" :close-on-click-modal="false" :close-on-press-escape="false">
      <flowDetail :form-id="flowFormId" :setting="{
        processInstanceId: processInstanceId,
        flowKey: flowKey,
        open: open,
        showCompleteBtn: true,
        showRejectBtn: false,
        flowFormId: flowFormId,
        cancel: () => {this.open = false}}"
      ></flowDetail>
    </el-dialog>
  </div>
</template>

<script>
import { post, queryUrlNoPageList } from '@/api/common'
import flowDetail from '@/views/flow/flowForm/FlowDetail.vue'

export default {
  name: 'start.vue',
  components: {
    flowDetail
  },
  data() {
    return {
      open: false,
      flowGroupList: [],
      flowFormId: 0,
      processInstanceId: undefined,
      flowKey: undefined
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
      let _t = this
      this.$modal.confirm('是否发起' + flow.flowName + '？', '发起提示').then(function() {
        return post('/flow/repository/start', flow, false).then(t => {
          // console.log(t,t.data, t.data.flowFormId, _t.flowFormId)
          _t.flowFormId = t.data.flowFormId
          _t.flowKey = t.data.flowKey
          _t.processInstanceId = t.data.processInstanceId
          _t.open = true
        })
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
