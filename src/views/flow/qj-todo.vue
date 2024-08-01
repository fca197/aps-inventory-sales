<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
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
      <el-table-column align="center" class-name="small-padding fixed-width" label="操作" fixed="right" width="140px">
        <template slot-scope="scope">
          <!--          <el-button icon="el-icon-edit" size="mini" type="text" @click="handleUpdate(scope.row)">修改</el-button>-->
          <el-button icon="el-icon-delete" size="mini" type="text" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :limit.sync="queryParams.pageSize" :page.sync="queryParams.pageNum"
                :total="total" @pagination="getList"
    />
  </div>
</template>

<script>
import { post } from '@/api/common'

export default {
  name: 'qj-todo.vue',
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
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
        data: {}
      },
      undoneList: [],
      headerList: []
    }
  }, created() {
    this.list()
  },
  methods: {
    list() {
      post('/flow/task/undone', {flowKey:"flow-qj"}, false).then(t => {
        this.undoneList = t.data.dataList
        this.headerList = t.data.headerList
        this.total = parseInt(t.data.total)
        this.loading = false
      })
    }
  }
}
</script>


<style scoped lang="scss">

</style>
