<template>
  <div>
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="false" label-width="88px">
      <el-form-item label="商品" prop="goodsId">
        <el-select v-model="queryParams.goodsId" placeholder="请选择商品" clearable>
          <el-option v-for="item in goodsList" :key="item.id" :label="item.goodsName" :value="item.id"></el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-col :span="24"  v-loading="loading" >
      <el-col :span="3" style="max-height: 400px; overflow: auto">
        <el-checkbox v-model="queryParams.currentDate" v-for="(d ,index) in dayList" :key="index" :value="d" :label="d" @change="useConstraintsResult"></el-checkbox>
      </el-col>
      <el-col :span="21">
        <el-col :span="24">
          <el-col :span="6" v-for="(li,i) in apsSchedulingVersionLimit.filter(t=> queryParams.currentDate.includes(t.currentDay)).reverse()" :key="i">
            <el-col :span="7">{{ li.currentDay }}</el-col>
            <el-col :span="17">{{ li.showName }}: {{ li.currentCount }}/{{ li.min }}-{{ li.max }}</el-col>
          </el-col>
        </el-col>
        <el-col :span="24">
          <el-table v-loading="loading" :data="brandNameList" width="100%">
            <!--          <el-table-column label="全选" type="selection" align="center" prop="id" width="50"/>-->
            <el-table-column v-for="(item,index) in  tableHeaderList" :key="index" align="center" :width="item.width" :prop="item.fieldName" :label="item.showName"/>
            <el-table-column label="" type="text" align="center"/>
          </el-table>
        </el-col>
      </el-col>
      <el-col :span="24">
        <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="useConstraintsResult"/>
      </el-col>
    </el-col>


  </div>
</template>

<script>
import request from "@/utils/request";
import {getById, queryUrlPageList} from "@/api/common";

export default {
  name: "useMakeCapacityResult",

  props: {
    id: {
      type: String,
      default: '-1'
    }
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      total: 0,
      // 选中数组
      ids: [],
      brandNameList: [],
      goodsList: [],
      dayList: [],
      tableHeaderList: [],
      apsSchedulingVersionLimit: [],
      // 非单个
      queryParams: {
        id: this.id,
        currentDate: [],
        pageNum: 1,
        pageSize: 10
      },
      interval:undefined
    }
  },
  created() {
     this. interval = setInterval(()=>{
       this.loadVersion()
     },1000);
  },
  mounted() {
    this.useConstraintsResult();
  },
  methods: {

    loadVersion() {
      return getById({idList: [this.id]}).then(v => {
        // console.info("v: ", v);
        var version = v.data.dataList[0];
        if (version.versionStep!==40){
          return new Promise(()=>{})
        }
        clearInterval(this.interval);
        this.dayList = JSON.parse(version.capacityDateList);
        this.queryParams.currentDate = [this.dayList[0]];

      }).then(()=>{
        queryUrlPageList("/apsSchedulingVersionLimit", {queryPage: false, data: {versionId: this.id}}).then(t => {
          this.loading = false;
          this.apsSchedulingVersionLimit = t.data.dataList;
        })
      });
    },

    useConstraintsResult() {

      request({
        url: "/apsSchedulingVersion/useMakeCapacityResult",
        method: "post",
        data: this.queryParams
      }).then(t => {
        this.brandNameList = t.data.dataList;
        this.tableHeaderList = t.data.headerList;
        this.total = parseInt(t.data.total);
        this.loading = false;
      })

    },
    handleQuery() {
      this.useConstraintsResult();
    },
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
  }

}
</script>


<style scoped lang="scss">

</style>
