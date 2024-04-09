<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryForm" :inline="true" :model="queryParams" label-width="88px" size="small">
      <el-form-item label="工厂">
        <el-select v-model="queryParams.data.factoryId" clearable placeholder="请选择工厂" @change="changeFactory">
          <el-option
              v-for="item in factoryList"
              :key="item.id"
              :label="item.factoryName"
              :value="item.id"/>
        </el-select>
      </el-form-item>

      <el-form-item label="楼层">
        <el-select v-model="queryParams.data.storeyId" clearable placeholder="请选择楼层"
                   @change="changeStorey">
          <el-option
              v-for="item in storeyList"
              :key="item.id"
              :label="item.storeyName"
              :value="item.id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="房间">
        <el-select v-model="queryParams.data.roomId" clearable placeholder="请选择房间">
          <el-option
              v-for="item in roomList"
              :key="item.id"
              :label="item.roomName"
              :value="item.id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="资产名称" prop="propertyName">
        <el-input v-model="queryParams.data.propertyName" clearable placeholder="请输入资产名称"
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
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>


    <el-table v-loading="loading" :data="checkList" @selection-change="handleSelectionChange">

      <el-table-column align="center" label="全选" prop="id" type="selection" width="50"/>
      <el-table-column v-for="(item,index) in  tableHeaderList" :key="index" :label="item.showName" :prop="item.fieldName"
                       align="center"/>
      <el-table-column align="center" class-name="small-padding fixed-width" label="操作">
        <template slot-scope="scope">
          <el-button icon="el-icon-edit" size="mini" type="text" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button icon="el-icon-delete" size="mini" type="text" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
        v-show="total>0"
        :limit.sync="queryParams.pageSize"
        :page.sync="queryParams.pageNum"
        :total="total"
        @pagination="getList"
    />

    <el-dialog :title="title" :visible.sync="open" append-to-body width="500px">
    </el-dialog>
  </div>
</template>
<script>

import {getFactoryList} from '@/api/factory'
import {getStoreyList} from '@/api/storey'
import {getRoomList} from '@/api/room'
import {queryPageList} from '@/api/common'
// console.info("xxx: ",uc.urlPrefix)
export default {
  name: "checkName",

  data() {
    return {
      roomList: [],
      storeyList: [],
      defPage: {
        data: {},
        pageSize: 1000,
        pageNum: 1,
      },
      open: false,
      title: "",
      tableHeaderList: [],
      loading: false,
      checkList: [],
      total: 0,
      multiple: true,
      showSearch: false,
      factoryList: [],
      queryParams: {
        data: {
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
      this.getList();
    });

  },
  methods: {
    getList() {
      return queryPageList(this.queryParams).then(t => {
        this.tableHeaderList = t.data.headerList;
      })
    },
    handleQuery() {

    },
    resetQuery() {

    }, handleAdd() {
      this.title = "增加盘点"
      this.open = true;

    }, handleDelete() {

    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    handleUpdate(row) {

    },
    changeFactory(val) {
      let page = Object.assign({}, this.defPage);
      page.data.factoryId = val;
      this.queryParams.data.storeyId = undefined;
      this.queryParams.data.roomId = undefined;
      getStoreyList(page).then(t => {
        this.roomList = []
        this.storeyList = t.data.dataList;

      });
    },
    changeStorey(val) {
      this.queryParams.data.roomId = undefined;
      let page = Object.assign({}, this.defPage);
      page.data.storeyId = val;
      getRoomList(page).then(t => {
        this.roomList = t.data.dataList;
      });
    }
  }
}
</script>
