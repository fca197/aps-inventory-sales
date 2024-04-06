<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="150px">
      <el-form-item label="(预)周生产产品" prop="goodsId">
        <el-select v-model="queryParams.data.goodsId" placeholder="请选择(预)周生产产品" @change="getList">
          <el-option v-for="item in goodsList" :key="item.id" :label="item.goodsName" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="(预)周生产版本名称" prop="brandName">
        <el-input v-model="queryParams.data.forecastMakeMonthName" placeholder="请输入(预)周生产名称" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"></el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="ids.length===0" @click="handleDelete"></el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table :data="forecastMakeMonthList" @selection-change="handleSelectionChange">
      <el-table-column label="全选" type="selection" align="center" prop="id" width="50"/>
      <el-table-column v-for="(item,index) in  tableHeaderList" :key="index" align="center" width="180px" :prop="item.fieldName" :label="item.showName"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
<!--          TO_UPLOAD(10, "待上传"), //-->
<!--          TO_COMPUTED(30, "待计算"), //-->
<!--          COMPUTED_RESULT(50, "计算结束"),-->

          <el-button size="mini" type="text" icon="el-icon-s-data" @click="handleData(scope.row)"></el-button>
<!--          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"></el-button>-->
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"></el-button>
<!--          <el-button size="mini" type="text"  icon="el-icon-download" @click="downloadTemplate(scope.row)"></el-button>-->
<!--          <el-button size="mini" type="text" icon="el-icon-upload" @click="uploadTemplate(scope.row)"></el-button>-->
          <el-button size="mini" type="text"  v-if="scope.row.forecastMakeMonthStatus==50" @click="forecastDeploy(scope.row)">
            <svg-icon icon-class="broadcast"></svg-icon>
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum"
                :limit.sync="queryParams.pageSize" @pagination="getList"/>
    <el-dialog :visible.sync="open" :title="title" width="800px" @close="cancel">
      <el-form :model="form" ref="form" label-width="150px">
        <el-form-item label="(预)周生产产品" prop="goodsId">
          <el-select v-model="form.goodsId" placeholder="请选择(预)周生产产品" clearable>
            <el-option v-for="item in goodsList" :key="item.id" :label="item.goodsName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="(预)周生产版本编码" prop="forecastMakeMonthNo">
          <el-input v-model="form.forecastMakeMonthNo" placeholder="请输入(预)周生产编码" clearable/>
        </el-form-item>
        <el-form-item label="(预)周生产版本名称" prop="forecastMakeMonthName">
          <el-input v-model="form.forecastMakeMonthName" placeholder="请输入(预)周生产名称" clearable/>
        </el-form-item>
        <el-form-item label="(预)周生产开始时间" prop="forecastMakeMonthBeginDate">
          <el-date-picker v-model="form.forecastMakeMonthBeginDate" type="month" format="yyyy-MM" value-format="yyyy-MM" placeholder="请选择(预)周生产开始时间" clearable/>
        </el-form-item>
        <el-form-item label="(预)周生产结束时间" prop="forecastMakeMonthEndDate">
          <el-date-picker v-model="form.forecastMakeMonthEndDate" type="month" format="yyyy-MM" value-format="yyyy-MM" placeholder="请选择(预)周生产结束时间" clearable/>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确认</el-button>
        <el-button @click="cancel">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="uploadOpen" :title="title" width="500px" @close="cancel">
      <el-form :model="form" ref="form" label-width="100px">
        <el-form-item label="(预)周生产版本文件" prop="forecastMakeMonthName">
          <file-upload ref="fileUpload" :fileUploadSuccess="fileUploadSuccess" :file-type="['xlsx']" :upload-url="'/apsGoodsForecast/uploadTemplate/'+this.form.id" :value="form.fileId"/>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {getGoodsList} from "@/api/aps/goods";
import {add, deleteByIdList, queryPageList, updateById} from "@/api/common";
import {downloadForm} from "@/utils/request";
export default {
  name: "forecastIndex",
  data() {
    return {

      title: "",
      goodsList: [],
      ids: [],
      forecastMakeMonthList: [],
      tableHeaderList: [],
      form: {
        fileId:"",
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
    document["pagePath"] = "/apsGoodsForecastMakeMonth";
    getGoodsList({pageNum: 1, pageSize: 999}).then(t => {
      this.goodsList = t.data.dataList
      this.getList();
    })
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
      if (this.form.id) {
        updateById(this.form).then(t => {
          this.$modal.msgSuccess("修改成功")
          // this.getList();
          // this.cancel();
        })
      } else {
        add(this.form).then(t => {
          this.$modal.msgSuccess("新增成功")
          // this.getList();
          // this.cancel();
        })
      }
    }, handleUpdate(data) {
      this.form = data;
      this.title = "修改(预)周生产版本";
      this.open = true;
    },
    downloadTemplate(row) {
      downloadForm("/apsGoodsForecast/downloadTemplate/" + row.id, {}, row.forecastName + ".xlsx");
    },
    uploadTemplate(row) {
      this.form.id = row.id;
      this.title = "上传(预)周生产版本";
      this.uploadOpen = true;
    }, handleData(row) {
      this.$tab.openPage("(预)周生产数据", "/psGoodsForecast/getDataById", {
            id: row.id
          }
      )
    },
    fileUploadSuccess(data) {
      this.$modal.msgSuccess("上传成功")
      this.uploadOpen = false;
    },

    computeResult(row){
      this.$tab.openPage("计算结果", "/apsGoodsForecast/compute", {
            id: row.id
          }
      )
    },forecastDeploy(row){
      forecastDeploy(row);
    }
  }
}
</script>


<style scoped lang="scss">

</style>
