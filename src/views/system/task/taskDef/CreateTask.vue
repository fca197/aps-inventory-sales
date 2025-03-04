<template>
  <div>
    <el-form v-model="taskInfo">
      <el-form-item label="任务名称" prop="taskName">
        <el-input v-model="taskInfo.taskName"></el-input>
      </el-form-item>
      <el-form-item label="任务类型" prop="type">
        <el-select v-model="taskInfo.type">
          <el-option label="开始" value="begin"></el-option>
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
          <el-option label="所有任务" value="all"></el-option>
          <el-option label="当前任务" value="task"></el-option>
          <el-option label="忽略异常" value="ignore"></el-option>
        </el-select>

      </el-form-item>

      <el-form-item label="前置监听器" prop="prefixListenerName">
        <el-select v-for="pl in prefixListenerNameList" :value="pl.beanName" :key="pl.showName"></el-select>
      </el-form-item>
      <el-form-item label="后置监听器" prop="prefixListenerName">
        <el-select v-for="pl in suffixListenerNameList" :value="pl.beanName" :key="pl.showName"></el-select>
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
      <el-form-item label="下个环节">

        <div v-for="(k,v) in taskInfo.targetList">
          <el-input v-model="k.condition" placeholder="进入条件"></el-input>
          <el-select v-model="v.targetId">
            <el-option v-for="t in taskList" :value="t.id" :label="t.taskName"></el-option>
          </el-select>

        </div>

      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'CreateTask',
  props: {
    taskList: [
      {
        id: '2',
        type: 'begin,end,javaBean,http',
        taskName: '任务名称'
      }
    ],
    taskInfo: {
      type: Object

    }

  }, data() {
    return {
      prefixListenerNameList: [{
        showName: '默认',
        beanName: 'beanName'
      }],
      suffixListenerNameList: [{
        showName: '默认',
        beanName: 'beanName'
      }]
    }
  }
}
</script>


<style scoped lang="scss">

</style>
