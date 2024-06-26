<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryForm" :inline="true" :model="queryParams" label-width="88px" size="small">

      <el-form-item label="" prop="">
        <el-switch v-model="queryParams.isActualMakeTime" active-text="实际时间" inactive-text="预计时间" active-color="#13ce66" inactive-color="#ff4949"/>
      </el-form-item>
      <el-form-item label="时间范围" prop="">
        <el-date-picker
            v-model="queryParams.dateArr"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            size="small"
            style="width: 300px"
        />
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" size="mini" type="primary" @click="getList">搜索</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <!--        <el-button icon="el-icon-plus" plain size="mini" type="primary" @click="handleAdd"></el-button>-->
      </el-col>
      <el-col :span="1.5">
        <!--        <el-button :disabled="multiple" icon="el-icon-delete" plain size="mini" type="danger" @click="handleDelete"></el-button>-->
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="tableData">
      <el-table-column label="订单编号" align="center" prop="orderNo" width="130" fixed/>
      <el-table-column label="用户名" align="center" prop="orderUser.userName" width="130" fixed/>
      <el-table-column label="总价" align="center" prop="orderTotalPrice" width="130"/>
      <el-table-column label="交付时间" align="center" prop="deliveryDate" width="130"/>
      <el-table-column label="订单备注" align="center" prop="orderRemark" width="130"/>
      <el-table-column v-for="(item,index) in  tableHeaderList" :key="index" :label="item.showName" :prop="item.fieldName" align="center" width="180px">
        <template slot-scope="scope">
          <span v-if='scope.row[item.fieldName+"_isDelay"]===true'>
            <el-tooltip placement="top">
            <div slot="content">节点时间:

              <!--    private LocalDate expectMakeBeginTime;-->
              <!--    private LocalDate expectMakeEndTime;-->
              <!--    /***-->
              <!--     *  实际制造时间-->
              <!--     */-->
              <!--    private LocalDate actualMakeBeginTime;-->
              <!--    private LocalDate actualMakeEndTime;-->
              <br/>预计开始时间: {{ scope.row[item.fieldName + '_expectMakeBeginTime'] }}
              <br/>实际开始时间: {{ scope.row[item.fieldName + '_actualMakeBeginTime'] }}
            </div>
            <span class="statusSpan statusDelay" > {{ scope.row[item.fieldName] }}</span>
          </el-tooltip>
          </span>
          <span  class="statusSpan" v-else-if='scope.row[item.fieldName+"_isDelay"]===false'>
            <span> {{ scope.row[item.fieldName] }}</span>
          </span> <span class="statusSpan"  v-else-if="scope.row[item.fieldName]">
             {{ scope.row[item.fieldName] }}
          </span>
        </template>
      </el-table-column>
    </el-table>

    <pagination
        v-show="total>0"
        :limit.sync="queryParams.pageSize"
        :page.sync="queryParams.pageNum"
        :total="total"
        @pagination="getList"
    />

  </div>
</template>

<script>
import { post, queryUrlPageList } from '@/api/common'

export default {
  name: 'timeLine',
  data: () => {
    return {
      showSearch: false,
      queryParams: {
        isActualMakeTime: false,
        pageNum: 1,
        pageSize: 10,
        dateArr: []
      },
      rules: {},
      loading: true,
      tableHeaderList: [],
      brandNameList: [],
      total: 0,
      title: '',
      tableData: [],
      multiple: true,
      single: true,
      ids: [],
      open: false,
      apsStatusList: {}
    }
  },
  created() {

    queryUrlPageList('/apsStatus', { queryPage: false }).then(t => {
      var dataList = t.data.dataList
      dataList.forEach(r => {
        r.backColor = '#' + r.id.substring(r.id.length - 6)
        this.apsStatusList[r.id] = r
      })
    }).then(t3 => {
      const beginDate = new Date()
      beginDate.setDate(beginDate.getDate() - 10)
      this.queryParams.dateArr[0] = this.formatDates(beginDate, false).substring(0, 10)
      const today = new Date()
      today.setMonth(today.getMonth() + 1) // 设置为下个月
      this.queryParams.dateArr[1] = this.formatDates(today, false).substring(0, 10)
      this.getList()
    })

  },
  methods: {
    getList() {
      this.queryParams.beginDate = this.queryParams.dateArr[0]
      this.queryParams.endDate = this.queryParams.dateArr[1]
      post('/apsOrder/timeLine', this.queryParams, false).then(t => {
        this.loading = false
        this.tableHeaderList = t.data.headerList
        this.tableData = t.data.records
        this.tableData.forEach(r => {
          r.statusInfoList.forEach(rt => {
            //
            r[rt.beginDate] = r[rt.beginDate] === undefined ? rt.statusName : r[rt.beginDate] + '/' + rt.statusName
            r[rt.beginDate + '_isDelay'] = rt.isDelay
            r[rt.beginDate + '_statusId'] = rt.statusId
            r[rt.beginDate + '_actualMakeBeginTime'] = rt.actualMakeBeginTime
            r[rt.beginDate + '_expectMakeBeginTime'] = rt.expectMakeBeginTime
          })
        })
        this.total = parseInt(t.data.total)
        console.log(this.tableData)
      })
    },
    handleQuery() {

    },
    resetQuery() {

    }
  }
}
</script>


<style scoped lang="scss">
.statusDelay {
  color: red !important;
  border: 1px solid red !important;
  padding: 2px 8px;
}
.statusSpan{
  border: 1px solid #ccc;
  padding: 2px 8px;
  color: green;
}
</style>
