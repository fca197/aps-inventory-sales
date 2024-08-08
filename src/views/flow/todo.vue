<template>
  <div class="app-container">


    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button icon="el-icon-plus" plain size="mini" type="primary" @click="handleAddTask">发起</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="list"></right-toolbar>
    </el-row>
    <el-table v-loading="loading" :data="undoneList">
      <el-table-column align="center" label="全选" prop="id" type="selection" width="50"/>
      <el-table-column v-for="(item,index) in  headerList" :key="index" :label="item.showName" :prop="item.fieldName" align="center" :width="item.width+'px'">
        <template slot-scope="scope">
          <span v-if="scope.row[item.fieldName]">{{ scope.row[item.fieldName] }}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column align="center" class-name="small-padding fixed-width" label="操作" fixed="right">
        <template slot-scope="scope">
          <!--          <el-button icon="el-icon-edit" size="mini" type="text" @click="handleUpdate(scope.row)">修改</el-button>-->
          <el-button icon="el-icon-setting" size="mini" type="text" @click="handleInfo(scope.row)">处理</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :limit.sync="queryParams.pageSize" :page.sync="queryParams.pageNum" :total="total" @pagination="list"/>

    <el-dialog :title="title" :visible.sync="open" append-to-body width="900px">
      <flow-detail :key="processInstanceId" :flowForm="form" :setting="{
        processInstanceId: processInstanceId,
        flowKey: queryParams.flowKey,
        open: open,
        taskId:taskId,
        businessKey:businessKey,
        isFirstTask:isFirstTask,
        showCompleteBtn: true,

        afterFun:list,
        cancel:cancel}"
      ></flow-detail>
    </el-dialog>

  </div>
</template>

<script>
import { post } from '@/api/common'
import flowDetail from '@/views/flow/flowForm/TaskFlowDetail.vue'

export default {
  name: 'qj-todo.vue',
  components: {
    flowDetail
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      isFirstTask: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      apsRollingForecastFactoryCapacityList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        flowKey: 'flow-qj'
      },
      form: {
        flowFormItemDtoList: []
      },
      undoneList: [],
      headerList: [],
      id: undefined,
      processInstanceId: undefined,
      flowFormId: undefined,
      taskId: undefined,
      businessKey: undefined,
      flow: {}
    }
  }, created() {
    this.queryParams.flowKey = this.$route.meta.flowKey
    this.flow = this.$route.meta.flow
    console.log(this.$route.params, this.$route.query, this.queryParams.flowKey, this.flow)
    this.list()
  },
  methods: {
    list() {
      post('/flow/task/undone', this.queryParams, false).then(t => {
        this.undoneList = t.data.dataList
        this.headerList = t.data.headerList
        this.total = parseInt(t.data.total)
        this.loading = false
      })
    },
    handleInfo(row) {

      this.flowFormId = row.flowFormId
      this.processInstanceId = row.processInstanceId
      this.taskId = row.taskId
      this.id = row.id
      this.title = row.name
      this.open = true

    },
    cancel() {
      this.open = false
      this.list()
    },
    handleAddTask() {
      let _t = this
      this.$modal.confirm('是否发起' + this.flow.flowName + '？', '发起提示').then(function() {
        return post('/flow/repository/start', _t.flow, false).then(t => {
          // console.log(t,t.data, t.data.flowFormId, _t.flowFormId)
          _t.flowFormId = t.data.flowFormId
          _t.flowKey = t.data.flowKey
          _t.businessKey = t.data.businessKey
          _t.processInstanceId = t.data.processInstanceId
          _t.taskId = t.data.taskId
          _t.open = true
        })
      }).then((it) => {
        this.open = true
        this.isFirstTask = true
      })

    }
  }
}
</script>


<style scoped lang="scss">

</style>
