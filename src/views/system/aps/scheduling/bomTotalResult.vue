<template>
  <div>
    <el-row>
      <right-toolbar :refresh-show="false" :search="false" export-table="bomTotalTable" export-table-file-name="零件排产使用"></right-toolbar>
      <el-table id="bomTotalTable" v-loading="loading" :data="bomTotalList" height="650"
                :row-class-name="tableRowClassName">
        <el-table-column v-for="(item,index) in tableHeaderList" :width="item.width" align="center"
                         :key="index" :prop="item.fieldName" :label="item.showName">
          <template slot-scope="scope">
          <span v-if="scope.row[item.fieldName]" :class="item.fieldName">
            {{ scope.row[item.fieldName] }}
            </span>
            <span v-else>-</span>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row>
      <el-button style="margin:10px 0 0 10px; " type="primary" size="mini"  @click="createBuyPlan">创建购买计划</el-button>
    </el-row>
  </div>
</template>

<script>
import {post} from "@/api/common";

export default {
  name: "bomResult.vue",
  data() {
    return {
      loading: true,
      bomTotalList: [],
      tableHeaderList: [],
      schedulingVersionId: "",
      pageNum: 1,
      pageSize: 10
    }
  },
  props: {
    id: {
      type: String,
      default: ""
    }
  },
  created() {
    this.schedulingVersionId = this.$route.query.id || this.id;
    console.info("id ", this.schedulingVersionId)

    post("/apsSchedulingGoodsBomTotal/queryBomTotal",
        {queryPage: true, schedulingVersionId: this.schedulingVersionId, pageNum: this.pageNum, pageSize: this.pageSize}
        , false
    ).then(
        t => {
          console.info("bomResult", t);
          this.bomTotalList = t.data.dataList;
          this.tableHeaderList = t.data.headerList;
          this.loading = false
        }
    );

  }, methods: {
    tableRowClassName({row, rowIndex}) {
      if (row.enough === 0) {
        return 'warning-row';
      }
      return '';
    },
    createBuyPlan(){
      console.info("this.schedulingVersionId", this.schedulingVersionId)
      post("/apsSchedulingGoodsBomTotal/createBomBuyPlan",{schedulingVersionId:this.schedulingVersionId},true)
    }
  }
}
</script>


<style>
.el-table .warning-row {
//background-color: #f56c6c;
}

.el-table .warning-row span.bomContrast {
  color: red;
}
</style>
