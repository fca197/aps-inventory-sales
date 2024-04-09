<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryForm" :inline="true" :model="queryParams" label-width="88px" size="small">
      <el-form-item label="工厂">
        <el-select v-model="queryParams.data.factoryId" clearable placeholder="请选择工厂">
          <el-option
              v-for="item in factoryList"
              :key="item.id"
              :label="item.factoryName"
              :value="item.id"/>
        </el-select>
      </el-form-item>


      <el-form-item label="盘点名称" prop="reportName">
        <el-input v-model="queryParams.data.reportName" clearable placeholder="请输入盘点名称"
                  @keyup.enter.native="handleQuery"/>
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
        <el-button :disabled="multiple" icon="el-icon-delete" plain size="mini" type="danger" @click="handleDelete">
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="handleQuery"></right-toolbar>
    </el-row>


    <el-table v-loading="loading" :data="checkList" @selection-change="handleSelectionChange">
      <el-table-column align="center" label="全选" prop="id" type="selection" width="50"/>
      <el-table-column v-for="(item,index) in  tableHeaderList" :key="index" :label="item.showName" :prop="item.fieldName"
                       align="center"/>
      <el-table-column align="center" class-name="small-padding fixed-width" label="操作">
        <template slot-scope="scope">
          <el-button icon="el-icon-s-data" size="mini" title="查看统计" type="text" @click="handleQueryData(scope.row)"></el-button>
          <el-button icon="el-icon-edit" size="mini" title="修改" type="text" @click="handleUpdate(scope.row)"></el-button>
          <el-button icon="el-icon-delete" size="mini" title="删除" type="text" @click="handleDelete(scope.row)"></el-button>
          <el-button icon="el-icon-circle-close" size="mini" title="关闭盘点" type="text" @click="handleOverReport(scope.row)"></el-button>
          <el-button icon="el-icon-refresh-right" size="mini" title="打开盘点" type="text" @click="handleOpenReport(scope.row)"></el-button>
          <el-button size="mini" title="生成快照" type="text" @click="handleCreateSnapshot(scope.row)">
            <svg-icon icon-class="snapshot"></svg-icon>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
        v-show="total>0"
        :limit.sync="queryParams.pageSize"
        :page.sync="queryParams.pageNum"
        :total="total"
        @pagination="handleQuery"
    />

    <el-dialog :visible.sync="checkReportListRoomOpen" append-to-body title="盘点详情" width="800px">

      <el-table v-loading="loading" :data="checkReportListRoomData" max-height="650">
        <el-table-column :show-overflow-tooltip="true" label="资产" prop="propertyName"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" label="盘点" prop="isCheck">
          <template slot-scope="scope">
            <el-button v-if="scope.row.isCheck" circle type="success"></el-button>
            <el-button v-else circle type="danger"></el-button>
          </template>
        </el-table-column>

        <el-table-column :show-overflow-tooltip="true" label="盘点时间" prop="checkDate">
        </el-table-column>
        <el-table-column :render-header="render2InUse" :show-overflow-tooltip="true" label="在用">
          <template slot-scope="scope">
            <el-select v-model="scope.row.inUse" @change="value=>{propertyChangeInUse(scope.row,value)}">
              <el-option :value="true" label="是"></el-option>
              <el-option :value="false" label="否"></el-option>
            </el-select>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog :visible.sync="handleQueryDataOpen" append-to-body title="报表" width="800px">
      <el-table v-loading="loading" :data="handleQueryDataList">
        <el-table-column :show-overflow-tooltip="true" label="楼层" prop="storeyName"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" label="房间" prop="roomName"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" label="盘点数据" prop="checkCount">
          <template slot-scope="scope">
            {{ scope.row.checkCount }}/{{ scope.row.allCount }}
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" label="盘点结果" prop="result">
          <template slot-scope="scope">
            <el-button v-if="scope.row.checkCount === scope.row.allCount" circle type="success"></el-button>
            <el-button v-else circle type="danger"></el-button>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" label="操作">
          <template slot-scope="scope">
            <el-button icon="el-icon-s-data" size="mini" type="text" @click="handleQueryInfoRoomData()"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button icon="el-icon-download" plain type="primary" @click="handleDownLoad()">下载</el-button>
        <el-button icon="el-icon-close" plain @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="title" :visible.sync="open" append-to-body width="500px">
      <el-form ref="form" :model="form" label-width="100px">

        <el-form-item label="工厂" prop="factoryId">
          <el-select v-model="form.factoryId" filterable placeholder="请选择工厂">
            <el-option v-for="item in factoryList" :key="item.id" :label="item.factoryName" :value="item.id"/>
          </el-select>
        </el-form-item>

        <el-form-item label="盘点编码" prop="reportCode">
          <el-input v-model="form.reportCode" placeholder="请输入盘点编码"/>
        </el-form-item>
        <el-form-item label="盘点名称" prop="reportName">
          <el-input v-model="form.reportName" placeholder="请输入盘点名名称"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="form.id===undefined" type="primary" @click="submitForm">确 定</el-button>
        <el-button v-else type="primary" @click="updateForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {handleOpenReport, handleOverReport, updateInUse} from '@/api/property'
import {checkReportListFactory, checkReportListRoom, downloadReportList} from '@/api/check'
import {getFactoryList} from '@/api/factory'
import {add, checkCompare, checkCompareDesc, deleteByIdList, queryPageList, updateById} from '@/api/common'

export default {
  name: "checkName",
  data() {
    return {
      ids: [],
      handleQueryDataList: [{
        checkCount: 0,
        allCount: 0
      }],
      form: {
        id: undefined,
        factoryId: undefined,
        reportCode: undefined,
        reportName: undefined
      },
      roomList: [],
      storeyList: [],
      defPage: {
        data: {},
        pageSize: 1000,
        pageNum: 1,
      },
      open: false,
      checkId: undefined,
      handleQueryDataOpen: false,
      checkReportListRoomOpen: false,
      checkReportListRoomData: [{isCheck: false}],
      title: "",
      tableHeaderList: [],
      loading: false,
      checkList: [],
      total: 0,
      multiple: true,
      showSearch: false,
      factoryList: [],
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        data: {
          reportName: undefined,
          factoryId: undefined,
          roomId: undefined,
          storeyId: undefined
        }
      }
    }
  },
  created() {
    document["pagePath"] = "/checkReport"
    getFactoryList(this.defPage).then(t => {
      this.factoryList = t.data.dataList;
      this.handleQuery();
    });

  },
  methods: {
    handleQuery() {
      return queryPageList(this.queryParams).then(t => {
        this.tableHeaderList = t.data.headerList;
        this.checkList = t.data.dataList;
        this.total = parseInt(t.data.total);
      })
    },
    resetQuery() {

    }, handleAdd() {
      this.title = "增加盘点"
      this.open = true;
      this.form.id = undefined;
    },
    handleDelete(row) {
      if (this.ids.length === 0) {
        this.ids.push(row.id)
      }
      if (this.ids.length === 0) {
        this.$message.warning("请先选择需要删除的记录");
        return;
      }
      deleteByIdList({idList: this.ids}).then(t => {
        this.handleQuery();
        this.$message.success("删除成功");
      })
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    handleUpdate(row) {
      this.open = true;
      this.title = "修改盘点";
      this.form = row;
    },
    cancel() {
      this.open = false;
      this.handleQueryDataOpen = false;
    },
    submitForm() {
      add(this.form).then(t => {
        this.open = false;
        this.handleQuery();
      })
    }, updateForm() {
      updateById(this.form).then(t => {
        this.open = false;
        this.handleQuery();
        this.$message.success("修改成功");
      })
    },
    handleQueryData(row) {
      this.handleQueryDataOpen = true;
      this.checkId = row.id;
      checkReportListFactory({checkId: row.id}).then(t => {
        this.handleQueryDataList = t.data.dataList;
        this.handleQueryDataList.forEach(t => t.unCheckCount = t.allCount - t.checkCount)
        this.handleQueryDataList = this.handleQueryDataList.sort(checkCompareDesc("unCheckCount"));
      })

    }
    , handleQueryInfoRoomData(row) {
      checkReportListRoom({checkId: row.checkId, roomId: row.roomId})
      .then(t => {
        this.checkReportListRoomData = t.data.dataList.sort(checkCompare("isCheck"));
        this.checkReportListRoomData.forEach(t => t.inUse = true)
      })
      this.checkReportListRoomOpen = true;
    },
    propertyChangeInUse(row, v) {
      row.id = row.propertyId
      return updateInUse(row, v).then(t => this.handleQueryInfoRoomData(row))
    },
    handleOverReport(row) {
      return handleOverReport(row).then(() => this.handleQuery());
    }, handleOpenReport(row) {
      return handleOpenReport(row).then(() => this.handleQuery());
    },
    render2InUse(h, {column, $index}) {
      return h("div", [
        h("span", column.label + "  ", {
          align: "left"
        }),
        h(
            "el-popover",
            {
              props: {
                placement: "top-start",    // 一般 icon 处可添加浮层说明，浮层位置等属性
                width: "170",
                trigger: "hover"
              }
            },
            [
              h("span", {
                style: {
                  width: "5px",
                },
              }, "改为否时不记录该资产"),

              h("i", {                            // 生成 i 标签 ，添加icon 设置 样式，slot 必填
                class: "el-icon-question",
                slot: "reference"
              })
            ]
        )
      ])

    },
    handleDownLoad() {
      downloadReportList({id: this.checkId})
    },
    handleCreateSnapshot(row) {
      this.$message.warning("功能开发中");
    }
  }
}
</script>
