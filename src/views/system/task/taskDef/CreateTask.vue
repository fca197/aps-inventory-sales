<template>
  <div style="z-index: 8000">
    <el-form ref="taskForm" :model="taskInfo" label-width="100px" :rules="rules">
      <el-form-item label="上个环节">
        <el-select v-model="taskInfo.sourceTaskId">
          <el-option v-for="t in taskDefList" :value="t.id" :label="t.taskName"></el-option>
        </el-select>
        <el-input v-model="taskInfo.sourceTaskCondition" placeholder="进入条件"></el-input>
      </el-form-item>
      <el-form-item label="任务名称" prop="taskName">
        <el-input v-model="taskInfo.taskName"></el-input>
      </el-form-item>
      <el-form-item label="任务类型" prop="type">
        <el-select v-model="taskInfo.type">
          <!--          <el-option label="开始" value="begin"></el-option>-->
          <el-option label="javaBean" value="javaBean"></el-option>
          <el-option label="http" value="http"></el-option>
          <el-option label="结束" value="end"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="taskInfo.type==='javaBean'">
        <el-form-item label="JavaBean名称" prop="taskBeanName">
          <el-input v-model="taskInfo.taskBeanName"></el-input>
          <el-select v-model="taskInfo.taskType">
            <el-option label="springBean" value="springBean"></el-option>
            <el-option label="javaClass" value="javaClass"></el-option>
          </el-select>
        </el-form-item>
      </el-form-item>
      <el-form-item v-if="taskInfo.type==='http'">
        <el-form-item label="请求地址" prop="url">
          <el-input v-model="taskInfo.url"></el-input>
        </el-form-item>
        <el-form-item label="请求方式" prop="reqMethod">
          <el-select v-model="taskInfo.reqMethod">
            <el-option label="POST" value="POST"></el-option>
            <el-option label="GET" value="GET"></el-option>
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
      <el-form-item label="异常终止" prop="exceptionAbend">
        <el-select v-model="taskInfo.exceptionAbend">
          <el-option label="所有任务" value="ALL"></el-option>
          <el-option label="当前任务" value="TASK"></el-option>
          <el-option label="忽略异常" value="IGNORE"></el-option>
        </el-select>

      </el-form-item>

      <el-form-item label="前置监听器" prop="prefixListenerName">
        <el-select v-model="taskInfo.prefixListenerName" v-for="pl in prefixListenerNameList" :value="pl.beanName" :key="pl.showName"></el-select>
      </el-form-item>
      <el-form-item label="后置监听器" prop="prefixListenerName">
        <el-select v-model="taskInfo.suffixListenerName" v-for="pl in suffixListenerNameList" :value="pl.beanName" :key="pl.showName"></el-select>
      </el-form-item>
      <el-form-item label="前置参数映射" prop="inputMapping">
        <div v-for="(k,v) in taskInfo.inputMappingList">
          <el-input v-model="k.source"></el-input>
          <el-input v-model="k.target"></el-input>
        </div>
      </el-form-item>
      <el-form-item label="后置参数映射" prop="outputMapping">
        <div v-for="(k,v) in taskInfo.outputMappingList">
          <el-input v-model="k.source"></el-input>
          <el-input v-model="k.target"></el-input>
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
export default {
  name: 'CreateTask',
  props: { taskDefList: {}, editTask: { type: Boolean }, editTaskClose: {} },
  watch: {},
  data() {
    return {
      prefixListenerNameList: [{
        showName: '默认',
        beanName: 'beanName'
      }],
      suffixListenerNameList: [{
        showName: '默认',
        beanName: 'beanName'
      }],
      taskInfo: {
        id: 'tk-' + parseInt(Math.random() * 10000000 + ''),
        x: 10,
        y: 10,
        taskName: undefined,
        type: undefined,
        taskType: undefined,
        taskBeanName: undefined,
        url: undefined,
        retryInterval: 3000,
        retryCount: 0,
        executeCount: 1,
        timeOut: 3000,
        exceptionAbend: 'ALL',
        reqMethod: undefined,
        prefixListenerName: undefined,
        suffixListenerName: undefined,
        inputMappingList: undefined,
        outputMappingList: undefined,
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
    this.taskInfo = {
      id: 'tk-' + parseInt(Math.random() * 10000000 + ''),
      x: 10,
      y: 10,
      taskName: undefined,
      type: undefined,
      taskType: undefined,
      taskBeanName: undefined,
      url: undefined,
      retryInterval: 3000,
      retryCount: 0,
      executeCount: 1,
      timeOut: 3000,
      exceptionAbend: 'ALL',
      reqMethod: undefined,
      prefixListenerName: undefined,
      suffixListenerName: undefined,
      inputMappingList: undefined,
      outputMappingList: undefined,
      sourceTaskId: '',
      sourceTaskCondition: ''
    }
  },
  methods: {
    addTask() {
      this.$refs.taskForm.validate(valid => {
        if (valid) {
          let tt = this.taskDefList.filter(ttt=>ttt.id===this.taskInfo.sourceTaskId)[0];
          this.taskInfo.x = tt.x + 150
          this.taskInfo.y = tt.y + 150
          this.taskDefList.push({ ...this.taskInfo })
          this.cancelAdd()
        }
      })

    },
    cancelAdd() {
      this.editTaskClose()
      // this.$emit('editTaskClose')
      // console.log("editTask close cancelAdd")
      // this.editTask = false
    }
  }
}
</script>


<style scoped lang="scss">

</style>
