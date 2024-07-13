<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryForm" :inline="true" :model="queryParams" label-width="100px" size="small">
      <el-form-item label="预测产品" prop="goodsId">
        <el-select v-model="queryParams.data.goodsId" placeholder="请选择预测产品" @change="getList">
          <el-option v-for="item in goodsList" :key="item.id" :label="item.goodsName" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="预测版本名称" prop="brandName">
        <el-input v-model="queryParams.data.forecastName" clearable placeholder="请输入预测名称" @keyup.enter.native="handleQuery"/>
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

    <el-table :data="forecastList" @selection-change="handleSelectionChange">
      <el-table-column align="center" label="全选" prop="id" type="selection" width="50"/>
      <el-table-column v-for="(item,index) in  tableHeaderList" :key="index" :label="item.showName" :prop="item.fieldName" align="center" width="180px"/>
      <el-table-column align="center" class-name="small-padding fixed-width" label="操作">
        <template slot-scope="scope">
          <!--          TO_UPLOAD(10, "待上传"), //-->
          <!--          TO_COMPUTED(30, "待计算"), //-->
          <!--          COMPUTED_RESULT(50, "计算结束"),-->

          <el-button icon="el-icon-s-data" size="mini" type="text" @click="handleData(scope.row)"></el-button>
          <el-button icon="el-icon-edit" size="mini" type="text" @click="handleUpdate(scope.row)"></el-button>
          <el-button icon="el-icon-delete" size="mini" type="text" @click="handleDelete(scope.row)"></el-button>
          <el-button icon="el-icon-download" size="mini" type="text" @click="downloadTemplate(scope.row)"></el-button>
          <el-button icon="el-icon-upload" size="mini" type="text" @click="uploadTemplate(scope.row)"></el-button>
          <el-button v-if="scope.row.forecastStatus==30" size="mini" type="text" @click="compute(scope.row)">
            <svg-icon icon-class="calculator"></svg-icon>
          </el-button>
          <el-button v-if="scope.row.forecastStatus==50" icon="el-icon-s-data" size="mini" type="text" @click="computeResult(scope.row)"></el-button>
          <el-button v-if="scope.row.forecastStatus==50" size="mini" type="text" @click="forecastDeploy(scope.row)">
            <svg-icon icon-class="broadcast"></svg-icon>
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :limit.sync="queryParams.pageSize" :page.sync="queryParams.pageNum"
                :total="total" @pagination="getList"/>
    <el-dialog :title="title" :visible.sync="open" width="1000px" @close="cancel">
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="预测产品" prop="goodsId">
          <el-select v-model="form.goodsId" clearable placeholder="请选择预测产品">
            <el-option v-for="item in goodsList" :key="item.id" :label="item.goodsName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="预测版本编码" prop="forecastNo">
          <el-input v-model="form.forecastNo" clearable placeholder="请输入预测编码"/>
        </el-form-item>
        <el-form-item label="预测版本名称" prop="forecastName">
          <el-input v-model="form.forecastName" clearable placeholder="请输入预测名称"/>
        </el-form-item>
        <el-form-item label="预测开始时间" prop="forecastBeginDate">
          <el-date-picker v-model="form.forecastBeginDate" clearable format="yyyy-MM" placeholder="请选择预测开始时间" type="month" value-format="yyyy-MM"/>
        </el-form-item>
        <el-form-item label="预测结束时间" prop="forecastEndDate">
          <el-date-picker v-model="form.forecastEndDate" clearable format="yyyy-MM" placeholder="请选择预测结束时间" type="month" value-format="yyyy-MM"/>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确认</el-button>
        <el-button @click="cancel">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="title" :visible.sync="uploadOpen" width="500px" @close="cancel">
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="预测版本文件" prop="forecastName">
          <file-upload ref="fileUpload" :file-type="['xlsx']" :fileUploadSuccess="fileUploadSuccess" :upload-url="'/apsGoodsForecast/uploadTemplate/'+this.form.id"
                       :value="form.fileId"/>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {getGoodsList} from "@/api/aps/goods";
import {add, deleteByIdList, queryPageList, updateById} from "@/api/common";
import {downloadForm} from "@/utils/request";
import {compute, forecastDeploy} from "@/api/aps/forecast";

export default {
  name: "forecastIndex",
  data() {
    return {

      title: "",
      goodsList: [],
      ids: [],
      forecastList: [],
      tableHeaderList: [],
      form: {
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
    document["pagePath"] = "/apsGoodsForecast";
    getGoodsList({queryPage:false}).then(t => {
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
        this.forecastList = t.data.dataList
        this.tableHeaderList = t.data.headerList
        this.total = parseInt(t.data.total)
      })
    },
    handleAdd() {
      this.title = "新增预测版本"
      this.open = true;
      this.form.forecastNo = "YC-" + this.formatDates(new Date(), true);
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
          this.getList();
          this.cancel();
        })
      } else {
        add(this.form).then(t => {
          this.$modal.msgSuccess("新增成功")
          this.getList();
          this.cancel();
        })
      }
    }, handleUpdate(data) {
      this.form = data;
      this.title = "修改预测版本";
      this.open = true;
    },
    downloadTemplate(row) {
      downloadForm("/apsGoodsForecast/downloadTemplate/" + row.id, {}, row.forecastName + ".xlsx");
    },
    uploadTemplate(row) {
      this.form.id = row.id;
      this.title = "上传预测版本";
      this.uploadOpen = true;
    }, handleData(row) {
      this.$tab.openPage("预测数据", "/psGoodsForecast/getDataById", {
            id: row.id
          }
      )
    },
    fileUploadSuccess(data) {
      this.$modal.msgSuccess("上传成功")
      this.uploadOpen = false;
    },
    compute(row) {
      return compute(row);
    },
    computeResult(row) {
      this.$tab.openPage("计算结果", "/apsGoodsForecast/compute", {
            id: row.id
          }
      )
    }, forecastDeploy(row) {
      forecastDeploy(row);
    }
  }
}
</script>


<style lang="scss" scoped>

</style>
