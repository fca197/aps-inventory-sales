<template>
  <div class="app-container">


    <el-row :gutter="10" class="mb8">

      <right-toolbar :showSearch.sync="showSearch" @queryTable="list"></right-toolbar>
    </el-row>
    <el-table v-loading="loading" :data="doneList">
      <el-table-column align="center" label="全选" prop="id" type="selection" width="50"/>
      <el-table-column align="center" label="节点名称" prop="name"/>
      <el-table-column align="center" label="过期时间" prop="dueDate"/>

      <el-table-column align="center" class-name="small-padding fixed-width" label="操作" fixed="right">
        <template slot-scope="scope">
          <el-button icon="el-icon-setting" size="mini" type="text" @click="handleInfo(scope.row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :limit.sync="queryParams.pageSize" :page.sync="queryParams.pageNum" :total="total" @pagination="list"/>

    <el-dialog :title="title" :visible.sync="open" append-to-body width="900px">
      <div :key="processInstanceId">
        <flow-detail :flowForm="form" :setting="{
        processInstanceId: processInstanceId,
        flowKey: queryParams.flowKey,
        open: open,
        taskId:taskId,
        isFirstTask:isFirstTask,
        showCompleteBtn: false,
        showRejectBtn: false,
        flowFormId: flowFormId,
        showCancel: false,
        showMessage: false,
        canEdit:false,
        cancel:cancel}"
        ></flow-detail>

        <!-- 审批记录 -->

        <el-table :data="historyList">
          <el-table-column align="center" label="任务名称" prop="name"/>
          <el-table-column align="center" label="审批意见" prop="message"/>
        </el-table>
      </div>

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
      doneList: [],
      headerList: [],
      id: undefined,
      processInstanceId: undefined,
      flowFormId: undefined,
      taskId: undefined,
      historyList: undefined,
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
      post(this.$route.meta.taskUrl, this.queryParams, false).then(t => {
        this.doneList = t.data.dataList

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

      post('/flow/task/historyList', { processInstanceId: row.processInstanceId }, false).then(t => {
        this.historyList = t.data
      })
      this.open = true

    },
    cancel() {
      this.open = false
      this.list()
    }
  }
}
</script>


<style scoped lang="scss">

</style>
