<template>
  <div class="app-container" v-loading="loadIngData">
    <el-form ref="form" :model="submitFrom" label-width="130px">
      <el-form-item v-for="(item ,index) in flowForm.flowFormItemDtoList " :label="item.formItemName" :key="index+item.formItemName">
        <el-input :disabled="setting.isFirstTask===false" v-if="item.formItemValueType==='str' " v-model="submitFrom[item.formItemFiled]" :placeholder="item.formItemDefaultValue"
        ></el-input>
        <el-input :disabled="setting.isFirstTask===false" v-if="item.formItemValueType==='number' " type="number" v-model="submitFrom[item.formItemFiled]"
                  :placeholder="item.formItemDefaultValue"
        ></el-input>
        <el-date-picker style="width: 100%" :disabled="setting.isFirstTask===false"
                        v-if="item.formItemValueType==='date' " v-model="submitFrom[item.formItemFiled]" type="date" value-format="yyyy-MM-dd" placeholder="选择日期"
        ></el-date-picker>
        <!--        time-->
        <el-time-picker style="width: 100%" :disabled="setting.isFirstTask===false" v-if="item.formItemValueType==='time' " value-format="HH:mm:ss"
                        v-model="submitFrom[item.formItemFiled]"
                        type="time"
                        placeholder="选择时间"
        ></el-time-picker>
        <!--        select-->
        <el-select style="width: 100%" :disabled="setting.isFirstTask===false" v-if="item.formItemValueType==='select' " v-model="submitFrom[item.formItemFiled]"
                   placeholder="请选择"
        >
          <el-option v-for="(option,index) in JSON.parse(item.formItemValue)" :key="'select'+index+option.id" :label="option.label" :value="''+option.id"> {{ option.label }}
          </el-option>
        </el-select>
        <el-checkbox-group :disabled="setting.isFirstTask===false" style="width: 100%" v-if="item.formItemValueType==='checkbox' " v-model="submitFrom[item.formItemFiled]">
          <el-checkbox v-for="(option) in JSON.parse(item.formItemValue)" :key="'checkbox'+option.id" :label="option.id" :value="''+option.id">{{ option.label }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="提交意见">
        <el-input type="textarea" v-model="taskMessage"></el-input>
      </el-form-item>

    </el-form>
    <div style="text-align: right">
      <el-button @click="setting.cancel">取 消</el-button>
      <el-button v-if="setting.isFirstTask" type="primary" @click="submitFormFun">保存草稿</el-button>
      <el-button type="primary" @click="completeFormFun">通过</el-button>
      <el-button v-if="setting.isFirstTask===false" type="danger" @click="rejectFormFun">驳回</el-button>
    </div>
  </div>
</template>

<script>
import { post, queryUrlPageList } from '@/api/common'

export default {
  name: 'FlowDetail.vue',
  props: {
    setting: {
      isFirstTask: {
        type: Boolean,
        required: false,
        default: false
      },

      processInstanceId: {},
      formKey: {},

      cancel: {
        type: Function,
        default: () => {
        }
      }
    },
    formId: {
      default: undefined,
      required: false
    },
    flowCode: {
      required: false
    }
  },
  watch: {},
  data() {
    return {
      currentFormCode: undefined,

      flowForm: {
        flowFormItemDtoList: []
      },
      loadIngData: true,
      taskMessage: '通过',
      submitFrom: {},
      submitFromMap: {}
    }
  },
  mounted() {
    // this.loadData()
  },
  created() {
    // console.log('this.setting', this.setting)
    this.loadData()
  },
  methods: {
    loadData() {
      this.flowForm.flowFormItemDtoList = []
      this.currentFormCode = this.flowCode ? this.flowCode : this.$route.query.flowCode
      queryUrlPageList('/flowForm', { queryPage: false, data: { formCode: this.currentFormCode, id: this.formId } }).then(t => {
        this.flowForm = t.data.dataList[0]
        let tt = {}
        let tm = {}
        this.flowForm.flowFormItemDtoList.forEach(cur => {
          tt [cur.formItemFiled] = cur.formItemDefaultValue
          // tt [cur.formItemFiled + 'ValueType'] = cur.formItemValueType
          if (cur.formItemValueType === 'select' || cur.formItemValueType === 'checkbox') {
            tt [cur.formItemFiled] = []
          }
          tm [cur.formItemFiled] = cur
        })
        this.submitFrom = tt
        this.submitFromMap = tm
      }).then(t => {
        if (this.setting.processInstanceId) {
          let _t = this
          queryUrlPageList('/flowFormUserValue', { queryPage: false, data: { processInstanceId: this.setting.processInstanceId } }).then(t => {
            console.log('t', t)
            t.data.dataList.forEach(cur => {
              if (cur.formItemValueType === 'checkbox') {
                _t.submitFrom [cur.formItemFiled] = cur.userValue.split(',')
              } else {
                _t.submitFrom [cur.formItemFiled] = cur.userValue
              }
            })
            _t.loadIngData = false
          })
          post('/flow/task/undone/processInstanceId', { processInstanceId: this.setting.processInstanceId }, false).then(t => {
            _t.setting.taskId = t.data.taskId
          })
        } else {
          this.loadIngData = false
        }
      })
    },
    submitFormFun() {
      let arr = []
      for (let key in this.submitFrom) {
        let tt = this.submitFromMap[key]
        if ('checkbox' === tt.formItemValueType) {
          tt.userValue = this.submitFrom[key].sort().join(',')
        } else {
          tt.userValue = this.submitFrom[key]
        }
        tt.processInstanceId = this.setting.processInstanceId
        tt.id = undefined
        arr.push(tt)
      }

      console.log('arr', this.submitFrom, arr, JSON.stringify(arr))
      return post('/flowFormUserValue/insertBatch', arr).then(t => {
        this.setting.cancel()
      })

    },
    rejectFormFun() {
      let message = this.taskMessage ? this.taskMessage : '驳回'
      post('/flow/task/reject', { taskId: this.setting.taskId, message: message }).then(t => {
        this.setting.cancel()
      })

    }, completeFormFun() {
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
