<template>
  <div v-loading="loadIngData">
    <el-form ref="form" :model="submitFrom" label-width="100px">
      <task-flow-item-detail :setting="taskFlowItemDetailSetting"></task-flow-item-detail>
      <el-form-item  v-show="setting.showMessage" label="提交意见">
        <el-input type="textarea" v-model="taskMessage"></el-input>
      </el-form-item>

    </el-form>
    <div style="text-align: right">
      <el-button  v-show="setting.showCancel" @click="setting.cancel">取 消</el-button>
      <el-button v-show="setting.showCompleteBtn" type="primary" @click="submitFormFun">保存草稿</el-button>
      <el-button v-show="setting.showCompleteBtn" type="primary" @click="completeFormFun">通过</el-button>
      <el-button v-show="setting.showRejectBtn" type="danger" @click="rejectFormFun">驳回</el-button>
    </div>
  </div>
</template>

<script>
import { post, queryUrlPageList } from '@/api/common'
import TaskFlowItemDetail from '@/views/flow/flowForm/TaskFlowItemDetail.vue'

export default {
  name: 'FlowDetail.vue',
  props: {
    setting: {
      cancel: undefined,
      processInstanceId: undefined,
      canEdit: true
    }

  },
  components: {
    TaskFlowItemDetail
  },
  watch: {},
  data() {
    return {
      taskFlowItemDetailSetting: {},
      currentFormCode: undefined,
      flowFormItemDtoList: [],
      loadIngData: true,
      showCancel: true,
      showMessage: true,
      taskMessage: '通过',
      submitFrom: {},
      submitFromMap: {}
    }
  },
  created() {
    this.loadData()
  },
  mounted() {

  },
  beforeCreate() {

  },
  methods: {
    loadData() {
      let _t = this
      let tmv = {}
      queryUrlPageList('/flowFormUserValue', { queryPage: false, data: { processInstanceId: this.setting.processInstanceId } }).then(t => {
        // Object.assign(_t.flowForm.flowFormItemDtoList ,)

        let tm = {}

        t.data.dataList.reverse().forEach(cur => {
          var formItemFiled = cur.formItemFiled

          if (cur.formItemValueType === 'checkbox') {
            _t.submitFrom[formItemFiled] = cur.userValue ? cur.userValue.split(',') : []
          } else {
            _t.submitFrom[formItemFiled] = cur.userValue ? cur.userValue : cur.formItemDefaultValue
          }
          _t.flowFormItemDtoList.push(cur)
          tm [cur.formItemFiled] = cur
          tmv [cur.formItemFiled] = _t.submitFrom[formItemFiled]
        })

        this.submitFromMap = tm
        _t.taskFlowItemDetailSetting = {
          canEdit: _t.setting.canEdit,
          submitFrom: _t.submitFrom,
          flowFormItemDtoList: _t.flowFormItemDtoList
        }

        console.info(_t.taskFlowItemDetailSetting)
        this.$forceUpdate()
      }).then(t => {

        for (let key in tmv) {

          this.$set(_t.submitFrom, key, tmv[key])

        }
        console.log('t', t, tmv, _t.submitFrom, tmv)
        // _t.flowFormItemDtoList.concat(t)

        _t.loadIngData = false
      })
    },
    submitFormFun() {
      let _t = this
      let arr = []
      console.log('arr', this.submitFrom, arr, JSON.stringify(arr))

      for (let key in this.submitFrom) {
        let tt = this.submitFromMap[key]

        if ('checkbox' === tt.formItemValueType) {
          tt.userValue = this.submitFrom[key].sort().join(',')
        } else {
          tt.userValue = this.submitFrom[key]
          tt.processInstanceId = this.setting.processInstanceId
        }
        arr.push(tt)
        console.log('tt', key, tt.userValue)
      }
      console.log('arr', this.submitFrom, arr, arr)
      return post('/flowFormUserValue/insertBatch', arr).then(t => {
        this.setting.cancel()
        if (_t.setting.afterFun) {
          _t.setting.afterFun()
        }
      })
    }
    ,
    rejectFormFun() {
      let message = this.taskMessage ? this.taskMessage : '驳回'
      post('/flow/task/reject', { taskId: this.setting.taskId, message: message }).then(t => {
        this.setting.cancel()
      })

    }
    ,
    completeFormFun() {
      let _t = this.setting.taskId
      let message = this.taskMessage ? this.taskMessage : '通过'

      this.submitFormFun().then(t => {
        post('/flow/task/complete', {
          taskId: _t, message: message
        }).then(t => {

          this.setting.cancel()
        })
      })
    }

  }
}
</script>


<style scoped lang="scss">

</style>
