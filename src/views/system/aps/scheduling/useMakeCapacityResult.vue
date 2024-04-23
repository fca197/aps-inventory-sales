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

    <el-col :span="24" v-loading="loading">
      <el-col :span="3" style="max-height: 400px; overflow: auto">
        <el-checkbox v-model="queryParams.currentDate" v-for="(d ,index) in dayList" :key="index" :value="d.currentDay" :label="d.currentDay" @change="useConstraintsResult">
          <label>{{ d.currentDay }} </label>
          <el-badge is-dot class="item" v-if="!d.hasEnough"> {{ d.currentCount }}</el-badge>
        </el-checkbox>
      </el-col>
      <el-col :span="21">
        <el-col style="border-bottom: #f6c1c1 1px solid;margin-bottom: 20px" :span="24" v-for="(d,i) in  queryParams.currentDate" :key="i">
          <el-col :span="24">当前日期: <label>{{ d }}</label>
            <el-badge is-dot class="item" v-if="dayList.filter(iten=>iten.currentDay===d)[0].hasEnough===false"></el-badge>
          </el-col>
          <el-row type="flex" style="flex-wrap: wrap;width:100%">
            <el-col :span="6" style="margin: 2px 0 ;height: 25px" v-for="(li,index) in  apsSchedulingVersionLimitMap[d]" :key="index">
              {{ li.showName }}: {{ li.currentCount }}/{{ li.min }}-{{ li.max }}
              <el-badge is-dot class="item" v-if="li.currentCount < li.min" :value="li.min-li.currentCount"></el-badge>
            </el-col>
          </el-row>
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
      apsSchedulingVersionLimitMap: {},
      // 非单个
      queryParams: {
        id: this.id,
        currentDate: [],
        pageNum: 1,
        pageSize: 10
      },
      maxLoop: 100,
      interval: undefined
    }
  },
  created() {
    this.interval = setInterval(() => {
      this.loadVersion()
    }, 1000);
  },
  mounted() {
    this.useConstraintsResult();
  },
  methods: {

    loadVersion() {
      this.maxLoop--;
      if (this.maxLoop <= 0) {
        clearInterval(this.interval);
      }
      return getById({idList: [this.id]}).then(v => {
        // console.info("v: ", v);
        var version = v.data.dataList[0];
        if (version.versionStep < 40) {
          return new Promise(() => {
          })
        }
        clearInterval(this.interval);
        this.dayList = JSON.parse(version.capacityDateList);
        // this.queryParams.currentDate = [this.dayList[0]];
        queryUrlPageList("/apsSchedulingVersionDay", {queryPage: false, data: {versionId: this.id}}).then(t => {
          this.dayList = t.data.dataList.reverse();
        })

      }).then(() => {
        queryUrlPageList("/apsSchedulingVersionLimit", {queryPage: false, data: {versionId: this.id}}).then(t => {
          this.loading = false;
          let d = t.data.dataList
          d.map(v => {
            var tt = this.apsSchedulingVersionLimitMap[v.currentDay];
            if (tt === undefined) {
              tt = [v]
            } else {
              tt.push(v)
            }
            tt = tt.sort((a, b) => {
              return a.limitType - b.limitType
            })
            this.apsSchedulingVersionLimitMap[v.currentDay] = tt;
          })
        })
      });
    },

    useConstraintsResult() {
      this.queryParams.currentDate = this.queryParams.currentDate.sort();
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
