<template>
  <div style="z-index: 8000">
    <el-form ref="taskForm" :model="taskInfo" label-width="110px" :rules="rules" inline>
      <el-form-item label="上个环节" style="width: 100%">
        <el-select v-model="taskInfo.sourceTaskId">
          <el-option v-for="t in taskDefList" :value="t.id" :label="t.taskName"></el-option>
        </el-select>
        <el-input v-model="taskInfo.sourceTaskCondition" placeholder="进入条件"></el-input>
      </el-form-item>
      <el-form-item label="任务名称" prop="taskName">
        <el-input v-model="taskInfo.taskName"></el-input>
      </el-form-item>
      <el-form-item label="任务类型" prop="taskType">
        <el-select v-model="taskInfo.taskType">
          <el-option-group v-for="kv in taskRunnerExecNameList" :key="kv.label+'taskRunnerExecNameList'" :value="kv.value" :label="kv.label">
            <el-option v-for="kv in kv.childrenList" :key="kv.label+'taskRunnerExecNameList'" :value="kv.value" :label="kv.label">
            </el-option>
          </el-option-group>
        </el-select>

      </el-form-item>
      <el-form-item v-if="taskInfo.taskType==='JAVA_BEAN'">
        <el-form-item label="JavaBean名称" prop="taskBeanName">
          <el-select v-model="taskInfo.taskBeanName">

            <el-option-group v-for="kv in javaTaskBeanExecNameList" :key="kv.label+'javaTaskBeanExecList'" :value="kv.value" :label="kv.label">
              <el-option v-for="kv in kv.childrenList" :key="kv.label+'javaTaskBeanExecList'" :value="kv.value" :label="kv.label">
              </el-option>
            </el-option-group>
          </el-select>


        </el-form-item>
        <el-form-item label="任务类型" prop="taskJavaType">
          <el-select v-model="taskInfo.taskJavaType">
            <el-option label="springBean" value="springBean"></el-option>
            <el-option label="javaClass" value="javaClass"></el-option>
          </el-select>
        </el-form-item>
      </el-form-item>
      <el-form-item v-if="taskInfo.taskType==='HTTP'">
        <el-form-item label="请求地址" prop="reqUrl">
          <el-input v-model="taskInfo.reqUrl"></el-input>
        </el-form-item>
        <el-form-item label="请求方式" prop="reqMethod">
          <el-select v-model="taskInfo.reqMethod">
            <el-option label="POST" value="POST"></el-option>
            <el-option label="GET" value="GET"></el-option>
          </el-select>
        </el-form-item>
      </el-form-item>
      <el-form-item label="检查类型" prop="checkType">
        <el-select v-model="taskInfo.checkType" clearable>
          <el-option-group v-for="kv in taskCheckRunnerExecNameList" :key="kv.label+'javaTaskBeanExecList'" :value="kv.value" :label="kv.label">
            <el-option v-for="kv in kv.childrenList" :key="kv.label+'javaTaskBeanExecList'" :value="kv.value" :label="kv.label">
            </el-option>
          </el-option-group>
        </el-select>
      </el-form-item>


      <el-form-item v-if="taskInfo.checkType==='HTTP'">
        <el-form-item label="请求地址" prop="checkUrl">
          <el-input v-model="taskInfo.checkUrl"></el-input>
        </el-form-item>
        <el-form-item label="请求方式" prop="checkReqMethod">
          <el-select v-model="taskInfo.checkReqMethod">
            <el-option label="POST" value="POST"></el-option>
            <el-option label="GET" value="GET"></el-option>
          </el-select>
        </el-form-item>
      </el-form-item>


      <el-form-item v-if="taskInfo.checkType==='JAVA'">
        <el-form-item label="JavaBean名称" prop="checkTaskBeanName">
          <el-select v-model="taskInfo.checkTaskBeanName">
            <el-option-group v-for="kv in javaTaskCheckBeanExecNameList" :key="kv.label+'javaTaskBeanExecList'" :value="kv.value" :label="kv.label">
              <el-option v-for="kv in kv.childrenList" :key="kv.label+'javaTaskBeanExecList'" :value="kv.value" :label="kv.label">
              </el-option>
            </el-option-group>
          </el-select>
        </el-form-item>
        <el-form-item label="任务类型" prop="checkTaskJavaType">
          <el-select v-model="taskInfo.checkTaskJavaType">
            <el-option label="springBean" value="springBean"></el-option>
            <el-option label="javaClass" value="javaClass"></el-option>
          </el-select>
        </el-form-item>
      </el-form-item>


      <el-form-item label="执行次数" prop="executeCount">
        <el-input-number v-model="taskInfo.executeCount" value="1"></el-input-number>
      </el-form-item>
      <el-form-item label="重试次数" prop="retryCount">
        <el-input-number v-model="taskInfo.retryCount" value="0"></el-input-number>
      </el-form-item>
      <el-form-item label="重试间隔" prop="retryInterval">
        <el-input-number v-model="taskInfo.retryInterval" value="1000"></el-input-number>
      </el-form-item>
      <el-form-item label="超时时间" prop="timeOut">
        <el-input-number v-model="taskInfo.timeOut" value="1000"></el-input-number>
      </el-form-item>
      <el-form-item label="异常终止" prop="exceptionStop">
        <el-select v-model="taskInfo.exceptionStop">
          <el-option label="所有任务" value="ALL"></el-option>
          <el-option label="当前任务" value="TASK"></el-option>
          <el-option label="忽略异常" value="IGNORE"></el-option>
        </el-select>

      </el-form-item>
      <div></div>
      <el-form-item label="前置监听器" prop="prefixListenerName">

        <el-select v-model="taskInfo.prefixListenerName" clearable>
          <el-option-group v-for="pl in listenerNameList" :value="pl.label" :key="pl.value">
            <el-option
              v-for="item in pl.childrenList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-option-group>
        </el-select>
      </el-form-item>
      <el-form-item label="后置监听器" prop="prefixListenerName">
        <el-select v-model="taskInfo.suffixListenerName" clearable>
          <el-option-group v-for="pl in listenerNameList" :value="pl.label" :key="pl.value">
            <el-option
              v-for="item in pl.childrenList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-option-group>
        </el-select>
      </el-form-item>
      <el-form-item label="前置参数映射" prop="inputMapping" style="width: 100%">
        <el-button type="primary" size="mini" @click="taskInfo.inputMappingList.push({source:undefined,target:undefined})">添加</el-button>
        <div v-for="(k,v) in taskInfo.inputMappingList">
          {{ v + 1 }} :
          <el-input v-model="k.source" style="width: 120px"></el-input>
          -->>
          <el-input v-model="k.target" style="width: 120px"></el-input>
          <el-select v-model="k.mappingType">
            <el-option label="to" value="to"/>
            <el-option label="java" value="java"/>
          </el-select>
          <el-input v-model="k.javaExpression" style="width: 120px"></el-input>
          <el-button size="mini" type="danger" @click="taskInfo.inputMappingList.splice(v, 1)">删除</el-button>
        </div>

      </el-form-item>
      <el-form-item label="后置参数映射" prop="outputMapping" style="width: 100%">
        <el-button type="primary" size="mini" @click="taskInfo.outputMappingList.push({source:undefined,target:undefined})">添加</el-button>

        <div v-for="(k,v) in taskInfo.outputMappingList">
          {{ v + 1 }} :
          <el-input v-model="k.source" style="width: 120px"></el-input>
          -->>
          <el-input v-model="k.target" style="width: 120px"></el-input>
          <el-select v-model="k.mappingType">
            <el-option label="to" value="to"/>
            <el-option label="java" value="java"/>
          </el-select>
          <el-input v-model="k.javaExpression" style="width: 120px"></el-input>
          <el-button size="mini" type="danger" @click="taskInfo.outputMappingList.splice(v, 1)">删除</el-button>
        </div>
      </el-form-item>

    </el-form>
    <div style="text-align: right">
      <el-button type="primary" @click="addTask">确定</el-button>
      <el-button type="warning" @click="cancelAdd">取消</el-button>
    </div>
  </div>
</template>

<script>
import { post } from '@/api/common'

export default {
  name: 'CreateTask',
  props: { taskDefList: {}, isAdd: { type: Boolean }, editTaskClose: {}, indexToReplace: { type: Number }, editTaskDef: { type: Object } },
  watch: {},
  data() {
    return {
      listenerNameList: [],
      taskRunnerExecNameList: [],
      javaTaskBeanExecNameList: [],
      javaTaskBeanExecList: [],
      taskCheckRunnerExecNameList: [],
      javaTaskCheckBeanExecNameList: [],
      checkTaskBeanNameList: [],

      taskInfo: {
        id: 'tk-' + parseInt(Math.random() * 10000000 + ''),
        x: 10,
        y: 10,
        taskName: undefined,
        taskType: undefined,
        taskJavaType: 'springBean',
        taskBeanName: undefined,
        reqUrl: undefined,
        checkUrl: undefined,
        checkReqMethod: undefined,
        retryInterval: 3000,
        retryCount: 0,
        executeCount: 1,
        timeOut: 3000,
        exceptionStop: 'ALL',
        checkType: '',
        checkTaskJavaType: 'springBean',
        checkTaskBeanName: '',
        reqMethod: undefined,
        prefixListenerName: undefined,
        suffixListenerName: undefined,
        inputMappingList: [{
          source: '',
          target: '',
          mappingType: 'to',
          javaExpression: ''
        }],
        outputMappingList: [{
          source: '',
          target: '',
          mappingType: 'to',
          javaExpression: ''
        }],
        sourceTaskId: '',
        sourceTaskCondition: ''
      },
      rules: {
        taskName: [{ required: true, message: '不能为空', trigger: 'blur' }, { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }],
        type: [{ required: true, message: '不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.loadListener()
    if (this.isAdd) {
      this.taskInfo = {
        id: 'tk-' + parseInt((1 + Math.random()) * 10000000 + ''),
        x: 10,
        y: 10,
        taskName: undefined,
        type: undefined,
        taskType: undefined,
        taskBeanName: undefined,
        reqUrl: undefined,
        retryInterval: 3000,
        retryCount: 0, checkType: '',
        executeCount: 1,
        timeOut: 3000,
        exceptionStop: 'ALL',
        reqMethod: undefined,
        prefixListenerName: undefined,
        suffixListenerName: undefined,
        inputMappingList: [{
          source: '',
          target: '',
          mappingType: 'to',
          javaExpression: ''
        }],
        outputMappingList: [{
          source: '',
          target: '',
          mappingType: 'to',
          javaExpression: ''
        }],
        sourceTaskId: '',
        sourceTaskCondition: ''
      }
    } else {
      this.taskInfo = this.editTaskDef
    }
  },
  methods: {
    addTask() {
      this.$refs.taskForm.validate(valid => {
        if (valid) {
          if (this.isAdd) {
            let tt = this.taskDefList.filter(ttt => ttt.id === this.taskInfo.sourceTaskId)[0]
            this.taskInfo.x = tt.x + 150
            this.taskInfo.y = tt.y + 150
            this.taskDefList.push({ ...this.taskInfo })
          } else {

            this.taskDefList.splice(this.indexToReplace, 1, this.taskInfo)
          }
          this.cancelAdd()
        }
      })

    },
    cancelAdd() {
      this.editTaskClose()
      // this.$emit('editTaskClose')
      // console.log("editTask close cancelAdd")
      // this.editTask = false
    },
    loadListener() {
      post('/taskDef/listener/list', {}, false).then(r => {
        this.listenerNameList = r.data.list
        // console.log(this.listenerNameList)
      })
      post('/taskDef/taskRunnerExec/list', {}, false).then(r => {
        this.taskRunnerExecNameList = r.data.list
        console.log('taskRunnerExecNameList', this.listenerNameList)

      })
      post('/taskDef/javaTaskBeanExec/list', {}, false).then(r => {
        this.javaTaskBeanExecList = r.data.list
      })
      post('/taskDef/taskCheckRunnerExec/list', {}, false).then(r => {
        this.taskCheckRunnerExecNameList = r.data.list
      })
      post('/taskDef/javaTaskCheckBeanExec/list', {}, false).then(r => {
        this.javaTaskCheckBeanExecNameList = r.data.list
      })
      post('/taskDef/javaTaskBeanExec/list', {}, false).then(r => {
        this.javaTaskBeanExecNameList = r.data.list
      })
    }
  }
}
</script>


<style scoped lang="scss">

</style>
