<template>
  <div>
    <right-toolbar :refresh-show="false" :search="false" export-table="bomTotalTable" export-table-file-name="零件排产使用"></right-toolbar>
    <el-table id="bomTotalTable" v-loading="loading" :data="bomTotalList" height="650">
      <el-table-column v-for="(item,index) in tableHeaderList"
                       :key="index" :prop="item.fieldName.replaceAll('-','/')" :label="item.showName">
<!--        <template slot-scope="scope">-->
<!--          <span v-if="scope.row[item.fieldName]">-->
<!--            <span v-if="scope.row[item.fieldName]==='缺少'">-->
<!--                 {{ scope.row[item.fieldName] }} |  <span class="red"> {{ scope.row['bomUseCount'] - scope.row['bomInventory'] }} </span>-->
<!--             </span>-->
<!--              <span v-else>-->
<!--                 {{ scope.row[item.fieldName] }}-->
<!--              </span>-->
<!--            </span>-->
<!--          <span v-else>-</span>-->
<!--        </template>-->
      </el-table-column>
    </el-table>
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
    this.schedulingVersionId = this.$route.query.id ||this.id;
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

  }
}
</script>


<style scoped lang="scss">
.red {
  color: red;
}
</style>
