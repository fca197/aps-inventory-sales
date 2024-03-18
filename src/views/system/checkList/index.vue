<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="88px">
      <el-form-item label="工厂">
        <el-select v-model="queryParams.data.factoryId" placeholder="请选择工厂" clearable>
          <el-option
              v-for="item in factoryList"
              :key="item.id"
              :label="item.factoryName"
              :value="item.id"/>
        </el-select>
      </el-form-item>


      <el-form-item label="盘点名称" prop="reportName">
        <el-input v-model="queryParams.data.reportName" placeholder="请输入盘点名称" clearable
                  @keyup.enter.native="handleQuery"/>
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
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete">
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="handleQuery"></right-toolbar>
    </el-row>


    <el-table v-loading="loading" :data="checkList" @selection-change="handleSelectionChange">
      <el-table-column label="全选" type="selection" align="center" prop="id" width="50"/>
      <el-table-column v-for="(item,index) in  tableHeaderList" :key="index" align="center" :prop="item.fieldName"
                       :label="item.showName"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-s-data" title="查看统计" @click="handleQueryData(scope.row)"></el-button>
          <el-button size="mini" type="text" icon="el-icon-edit" title="修改" @click="handleUpdate(scope.row)"></el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" title="删除" @click="handleDelete(scope.row)"></el-button>
          <el-button size="mini" type="text" icon="el-icon-circle-close" title="关闭盘点" @click="handleOverReport(scope.row)"></el-button>
          <el-button size="mini" type="text" icon="el-icon-refresh-right" title="打开盘点" @click="handleOpenReport(scope.row)"></el-button>
          <el-button size="mini" type="text"   title="生成快照"  @click="handleCreateSnapshot(scope.row)">
            <svg-icon icon-class="snapshot"></svg-icon>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="handleQuery"
    />

    <el-dialog title="盘点详情" :visible.sync="checkReportListRoomOpen" width="800px" append-to-body>

      <el-table v-loading="loading" :data="checkReportListRoomData" max-height="650">
        <el-table-column prop="propertyName" label="资产" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="isCheck" label="盘点" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <el-button type="success" circle v-if="scope.row.isCheck"></el-button>
            <el-button type="danger" circle v-else></el-button>
          </template>
        </el-table-column>

        <el-table-column label="盘点时间" prop="checkDate" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column label="在用" :show-overflow-tooltip="true" :render-header="render2InUse">
          <template slot-scope="scope">
            <el-select v-model="scope.row.inUse" @change="value=>{propertyChangeInUse(scope.row,value)}">
              <el-option label="是" :value="true"></el-option>
              <el-option label="否" :value="false"></el-option>
            </el-select>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog title="报表" :visible.sync="handleQueryDataOpen" width="800px" append-to-body>
      <el-table v-loading="loading" :data="handleQueryDataList">
        <el-table-column prop="storeyName" label="楼层" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="roomName" label="房间" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="checkCount" label="盘点数据" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            {{ scope.row.checkCount }}/{{ scope.row.allCount }}
          </template>
        </el-table-column>
        <el-table-column prop="result" label="盘点结果" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <el-button type="success" circle v-if="scope.row.checkCount === scope.row.allCount"></el-button>
            <el-button type="danger" circle v-else></el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <el-button size="mini" type="text" icon="el-icon-s-data" @click="handleQueryInfoRoomData()"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" plain icon="el-icon-download" @click="handleDownLoad()">下载</el-button>
        <el-button plain icon="el-icon-close" @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" label-width="100px">

        <el-form-item label="工厂" prop="factoryId">
          <el-select filterable v-model="form.factoryId" placeholder="请选择工厂">
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
        <el-button type="primary" v-if="form.id===undefined" @click="submitForm">确 定</el-button>
        <el-button type="primary" v-else @click="updateForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {handleOpenReport, handleOverReport, updateInUse} from '@/api/property'
import {checkReportListFactory, checkReportListRoom,downloadReportList} from '@/api/check'
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
      checkId:undefined,
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
      this.checkId=row.id;
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
              },"改为否时不记录该资产"),

              h("i", {                            // 生成 i 标签 ，添加icon 设置 样式，slot 必填
                class: "el-icon-question",
                slot: "reference"
              })
            ]
        )
      ])

    },
    handleDownLoad(){
      downloadReportList({id: this.checkId})
    },
    handleCreateSnapshot(row){
      this.$message.warning("功能开发中");
    }
  }
}
</script>
