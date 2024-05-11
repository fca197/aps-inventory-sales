<template>
  <div class="app-container">

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">

      </el-col>
      <right-toolbar :search="false" :showSearch.sync="showSearch" export-table="dataTable" export-table-file-name="(预测)生产数据看板-销售配置" @queryTable="getData"
                     @search="getData"></right-toolbar>
    </el-row>
    <div>(预测)生产数据看板-销售配置</div>
    <el-table id="dataTable" :data="tableData.dataList" cellpadding="0" cellspacing="0" show-summary>
      <el-table-column v-for="(item,index) in  tableData.headerList" :key="index" :label="item.showName" :prop="item.fieldName" :width="(item.width-50)+'px'" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row[item.fieldName]!=0">{{ scope.row[item.fieldName] }}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top: 20px" >
      <el-button type="primary" @click="toProject">查看规划配置</el-button>
      <el-button type="primary" @click="toBom">查看零件</el-button>
    </div>
  </div>
</template>

<script>
import {queryDataById} from "@/api/aps/forecastMakeWeek";

export default {
  name: "data",
  data() {
    return {
      showSearch: false,
      id: this.$route.query.id,
      tableData: {}
    }
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      queryDataById({id: this.id}).then(t => {
        this.tableData = t.data;
        this.tableData.headerList [0].width = 600;
        this.tableData.headerList.slice(1).forEach(h => h.width = 180)
      })
    },
    toProject(){
      // this.$tab.openPage("(预)周生产管理数据-规划配置","/aps/goods/forecast/make/week/projectResult?",{id:this.id});
         this.$tab.openPage("(预)周生产数据-规划配置", "/aps/goods/forecast/make/week/projectResult", {
            id: this.id
          }
      )
    },
    toBom(){
      // this.$tab.openPage("(预)周生产管理数据-规划配置","/aps/goods/forecast/make/week/projectResult?",{id:this.id});
         this.$tab.openPage("(预)周生产数据-零件", "/aps/goods/forecast/make/week/bomResult", {
            id: this.id
          }
      )
    },
    handleAdd() {

    }
  }
}
</script>


<style lang="scss" scoped>

</style>
