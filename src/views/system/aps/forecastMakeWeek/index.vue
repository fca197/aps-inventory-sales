<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryForm" :inline="true" :model="queryParams" label-width="150px" size="small">

      <el-form-item label="(预)周生产版本名称" prop="brandName">
        <el-input v-model="queryParams.data.forecastMakeMonthName" clearable placeholder="请输入(预)周生产名称" @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" size="mini" type="primary" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button icon="el-icon-plus" plain size="mini" type="primary" @click="handleAdd"></el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button :disabled="ids.length===0" icon="el-icon-delete" plain size="mini" type="danger" @click="handleDelete"></el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table :data="forecastMakeMonthList" @selection-change="handleSelectionChange">
      <el-table-column align="center" label="全选" prop="id" type="selection" width="50"/>
      <el-table-column v-for="(item,index) in  tableHeaderList" :key="index" :label="item.showName" :prop="item.fieldName" align="center"  />
      <el-table-column align="center" class-name="small-padding fixed-width" label="操作" fixed="right" width="140px">
        <template slot-scope="scope">
          <el-button icon="el-icon-s-data" size="mini" type="text" @click="handleData(scope.row)"></el-button>
          <el-button v-if="scope.row.isDeploy===false" icon="el-icon-delete" size="mini" type="text" @click="handleDelete(scope.row)"></el-button>
          <el-button v-if="scope.row.isDeploy===false" size="mini" type="text" @click="forecastDeploy(scope.row)">
            <svg-icon icon-class="broadcast"></svg-icon>
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :limit.sync="queryParams.pageSize" :page.sync="queryParams.pageNum"
                :total="total" @pagination="getList"/>
    <el-dialog :title="title" :visible.sync="open" width="800px" @close="cancel">
      <el-form ref="form" :model="form" label-width="150px">
        <el-form-item label="预测主版本" prop="goodsId">
          <el-select v-model="form.forecastMainId" placeholder="请选择预测主版本">
            <el-option v-for="item in forecastMainList" :key="item.id" :label="item.forecastName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="(预)周生产版本编码" prop="forecastMakeMonthNo">
          <el-input v-model="form.forecastMakeMonthNo" clearable placeholder="请输入(预)周生产编码"/>
        </el-form-item>
        <el-form-item label="(预)周生产版本名称" prop="forecastMakeMonthName">
          <el-input v-model="form.forecastMakeMonthName" clearable placeholder="请输入(预)周生产名称"/>
        </el-form-item>
        <el-form-item label="(预)周生产开始时间" prop="forecastMakeMonthBeginDate">
          <el-date-picker v-model="form.forecastMakeMonthBeginDate" clearable format="yyyy-MM" placeholder="请选择(预)周生产开始时间" type="month" value-format="yyyy-MM"/>
        </el-form-item>
        <el-form-item label="(预)周生产结束时间" prop="forecastMakeMonthEndDate">
          <el-date-picker v-model="form.forecastMakeMonthEndDate" clearable format="yyyy-MM" placeholder="请选择(预)周生产结束时间" type="month" value-format="yyyy-MM"/>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确认</el-button>
        <el-button @click="cancel">取消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import {add, deleteByIdList, queryPageList} from "@/api/common";
import {downloadForm} from "@/utils/request";
import {getAllForecastMain} from "@/api/aps/forecastMain";
import {deploy} from "@/api/aps/forecastMakeWeek";

export default {
  name: "forecastIndex",
  data() {
    return {

      title: "",
      goodsList: [],
      ids: [],
      forecastMainList: [],
      forecastMakeMonthList: [],
      tableHeaderList: [],
      form: {
        forecastMainId: undefined,
        fileId: "",
        forecastNo: "",
        forecastBeginDate: "",
        forecastEndDate: ""
      },
      queryParams: {
        data: {
          goodsId: null,
          forecastCode: "",
          forecastName: ""
        },
        pageNum: 1,
        pageSize: 10,
      },
      open: false,
      uploadOpen: false,
      single: false,
      multiple: false,
      showSearch: true,
      total: 0,
    }
  },
  created() {
    document["pagePath"] = "/apsGoodsForecastMake";
    getAllForecastMain({queryPage:false}).then(t => {
      this.forecastMainList = t.data.dataList
    })
    this.getList();
  },
  methods: {
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    resetQuery() {
    },
    handleQuery() {
      this.getList()
    },
    getList() {
      queryPageList(this.queryParams).then(t => {
        this.forecastMakeMonthList = t.data.dataList
        this.tableHeaderList = t.data.headerList
        this.total = parseInt(t.data.total)
      })
    },
    handleAdd() {
      this.title = "新增(预)周生产版本"
      this.open = true;
      this.form.forecastNo = "YCW-" + this.formatDates(new Date(), true);
    },
    handleDelete(row) {
      let idList = this.ids;
      if (row && row.id) {
        idList[0] = row.id;
      }
      deleteByIdList({idList: idList}).then(t => {
        this.$modal.msgSuccess("删除成功")
        this.getList();
      })

    }, cancel() {
      this.open = false;
    }, submitForm() {

      add(this.form).then(t => {
        this.$modal.msgSuccess("新增成功")
        this.getList();
        this.cancel();
      })

    }, handleUpdate(data) {
      this.form = data;
      this.title = "修改(预)周生产版本";
      this.open = true;
    },
    downloadTemplate(row) {
      downloadForm("/apsGoodsForecast/downloadTemplate/" + row.id, {}, row.forecastName + ".xlsx");
    },
     handleData(row) {
      this.$tab.openPage("(预)周生产数据", "/aps/goods/forecast/make/week/result", {
            id: row.id
          }
      )
    },
    fileUploadSuccess(data) {
      this.$modal.msgSuccess("上传成功")
      this.uploadOpen = false;
    },

    forecastDeploy(row) {
      deploy(row).then(() => this.getList());
    }
  }
}
</script>


<style lang="scss" scoped>

</style>
