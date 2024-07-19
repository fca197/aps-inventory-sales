<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryForm" :inline="true" :model="queryParams" label-width="88px" size="small">
      <el-form-item label="工厂ID" prop="factoryId">
        <el-input v-model="queryParams.data.factoryId" clearable placeholder="请输入工厂ID" @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="工艺路径" prop="processId">
        <!--        <el-input v-model="queryParams.data.processId" clearable placeholder="请输入工艺路径ID" @keyup.enter.native="handleQuery"/>-->
        <el-select v-model="queryParams.data.processId" placeholder="请选择工艺路径">
          <el-option v-for="item in processList" :key="item.id" :label="item.processPathName" :value="item.id"></el-option>
        </el-select>

      </el-form-item>
      <el-form-item label="排程版本号" prop="schedulingDayNo">
        <el-input v-model="queryParams.data.schedulingDayNo" clearable placeholder="请输入排程版本号" @keyup.enter.native="handleQuery"/>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button icon="el-icon-plus" plain size="mini" type="primary" @click="handleAdd"></el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button :disabled="multiple" icon="el-icon-delete" plain size="mini" type="danger" @click="handleDelete"></el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="apsSchedulingDayConfigList" @selection-change="handleSelectionChange">
      <el-table-column align="center" label="全选" prop="id" type="selection" width="50"/>
      <el-table-column v-for="(item,index) in  tableHeaderList" :key="index" :label="item.showName" :prop="item.fieldName" align="center" :width="item.width+'px'"/>
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

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" append-to-body width="1300px">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">

        <el-form-item label="工厂ID" prop="factoryId">
          <!--          <el-input v-model="form.factoryId" clearable placeholder="请输入工厂ID"/>-->
          <el-select v-model="form.factoryId" placeholder="请选择工厂ID" style="width: 100%">
            <el-option v-for="item in factoryList" :key="item.id" :label="item.factoryName" :value="item.id" style="width: 100%"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工艺路径" prop="processId">
          <!--          <el-input v-model="form.processId" clearable placeholder="请输入工艺路径ID"/>-->
          <el-select v-model="form.processId" placeholder="请选择工艺路径ID" style="width: 100%">
            <el-option v-for="item in processList" :key="item.id" :label="item.processPathName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排程版本号" prop="schedulingDayNo">
          <el-input v-model="form.schedulingDayNo" clearable placeholder="请输入排程版本号"/>
        </el-form-item>
        <el-form-item label="排程版本名称" prop="schedulingDayName">
          <el-input v-model="form.schedulingDayName" clearable placeholder="请输入排程版本名称"/>
        </el-form-item>
        <el-form-item label="排程步骤" prop="schedulingDayConfigItemDtoList">


          <el-table :data="form.schedulingDayConfigItemDtoList">
            <el-table-column label="车间" prop="roomName" width="140"/>
            <el-table-column label="状态" prop="statusName" width="140"/>
            <el-table-column label="排程配置" prop="configList">

              <template slot-scope="scope">
                <div v-if="scope.row.configList&&scope.row.configList.length>0">
                  <el-table :data="scope.row.configList">
                    <el-table-column label="类型" prop="configBizType" width="200">
                      <template slot-scope="scopeSub">
                        <el-select v-model="scopeSub.row.configBizType" placeholder="请选择类型" @change="value=>{selectConfigBizType(scopeSub.row,value)}">
                          <el-option v-for="item in configBizTypeList" :key="item.configBizType" :label="item.configBizTypeName" :value="item.configBizType"></el-option>
                        </el-select>
                      </template>
                    </el-table-column>
                    <el-table-column label="名称" prop="configBizName" width="200">
                      <template slot-scope="scopeSub">
                        <el-select v-model="scopeSub.row.configBizId" placeholder="请选择名称">
                          <el-option v-for="item in scopeSub.row.configBizNameList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                      </template>
                    </el-table-column>
                    <el-table-column label="数量" prop="configBizNum" width="150">
                      <template slot-scope="scopeSub">
                        <el-input v-model="scopeSub.row.configBizNum" clearable placeholder="请输入数量"/>
                      </template>
                    </el-table-column>
                    <el-table-column label="耗时(秒)" prop="configBizTime" width="150">
                      <template slot-scope="scopeSub">
                        <el-input v-model="scopeSub.row.configBizTime" clearable placeholder="请输入耗时(秒)"/>
                      </template>
                    </el-table-column>
                    <!-- 操作 -->
                    <el-table-column label="操作">
                      <template slot-scope="scopeSub">
                        <el-button icon="el-icon-plus" type="text" size="mini" @click="handleAddConfig(scope.row)"></el-button>
                        <el-button icon="el-icon-delete" type="text" size="mini" @click="handleDeleteConfig(scope.row,scopeSub.$index)"></el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
                <div v-else>
                  <el-button icon="el-icon-plus" type="primary" size="mini" @click="handleAddConfig(scope.row)"></el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>

        </el-form-item>

        <el-form-item label="是否默认" prop="isDefault">
          <el-select v-model="form.isDefault" placeholder="请选择是否默认" style="width: 100%">
            <el-option label="否" :value="0"></el-option>
            <el-option label="是" :value="1"></el-option>
          </el-select>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>


<script>

import { add, deleteByIdList, getById, queryPageList, queryUrlPageList, updateById } from '@/api/common'
import { getFactoryList } from '@/api/factory'

export default {
  name: 'tenantName',
  data() {

    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: false,
      // 总条数
      total: 0,
      apsSchedulingDayConfigList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        data: {}
      },
      // 表单参数
      form: {
        schedulingDayConfigItemDtoList: [],
        factoryId: undefined,
        processId: undefined,
        schedulingDayNo: undefined,
        schedulingDayName: undefined,
        isDefault: undefined,
        id: undefined
      },
      // 表单校验
      rules: {},
      tableHeaderList: [],
      factoryList: [],
      processList: [],
      processMap: {},
      statusMap: {},
      saleConfigList: [],
      projectList: [],
      bomList: [],
      configBizTypeList: [{
        configBizType: 'sale',
        configBizTypeName: '销售配置'
      }, {
        configBizType: 'project',
        configBizTypeName: '工程配置'
      }, {
        configBizType: 'bom',
        configBizTypeName: '零件'
      }
      ]
    }
  },
  created() {
    document['pagePath'] = '/apsSchedulingDayConfig'
    Promise.all([
      queryUrlPageList('/apsStatus', { queryPage: false }).then(t => {
        this.statusMap = t.data.dataList.reduce((p, c) => {
          p[c.id] = c.statusName
          return p
        }, {})
      }),
      getFactoryList({ queryPage: false }).then(response => {
        this.factoryList = response.data.dataList
        queryUrlPageList('/apsProcessPath', { queryPage: false }).then(t => {
          this.processList = t.data.dataList
          this.processList.forEach(p => {
            this.processMap[p.id] = p
          })
        })

      })
    ]).then(response => {
      this.getList()
    })
    queryUrlPageList('/apsSaleConfig', { queryPage: false, data: { isValue: 1 } }).then(t => {
      t.data.dataList.forEach(p => {
        this.saleConfigList.push({ id: p.id, name: p.saleName })
      })
    })
    queryUrlPageList('/apsProjectConfig', { queryPage: false, data: { isValue: 1 } }).then(t => {
      t.data.dataList.forEach(p => {
        this.projectList.push({ id: p.id, name: p.saleName })
      })
    })
    queryUrlPageList('/apsBom', { queryPage: false, data: { isValue: 1 } }).then(t => {
      t.data.dataList.forEach(p => {
        this.bomList.push({ id: p.id, name: p.bomName })
      })
    })

  },
  methods: {
    /** 查询公告列表 */
    getList() {
      this.loading = true
      queryPageList(this.queryParams).then(response => {
        response = response.data
        this.tableHeaderList = response.headerList
        this.apsSchedulingDayConfigList = response.dataList
        this.total = parseInt(response.total)
        this.loading = false
      })
    },
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      let fid = this.form.id
      let factoryId = this.factoryList[0].id
      this.form = {
        schedulingDayConfigItemDtoList: [],
        factoryId: factoryId,
        processId: this.processList[0].id,
        schedulingDayNo: undefined,
        schedulingDayName: undefined,
        isDefault: 0,
        id: fid
      }
      this.setItemList(this.form.processId)

      this.resetForm('form')
    },
    setItemList(processId) {
      var process = this.processMap[processId]
      if (process === null || process === undefined) {
        return
      }
      let tmp = []
      process.pathRoomList.forEach(room => {
        room.apsRoomConfigList.forEach(roomConfig => {
          let t = {
            roomId: room.id,
            roomName: roomConfig.roomName,
            statusId: roomConfig.statusId,
            statusName: this.statusMap[roomConfig.statusId],
            configBizTime: roomConfig.executeTime
          }
          t.configList = []
          tmp.push(t)
        })
      })
      this.form.schedulingDayConfigItemDtoList = tmp
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      this.handleQuery()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.title = '添加排程版本表'
      this.open = true
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      let req = { idList: [row.id], pageSize: 1, pageNum: 1 }
      getById(req).then(response => {
        this.form = response.data.dataList[0]
        this.title = '修改排程版本表'
        this.open = true
      })

    },

    /** 提交按钮 */
    submitForm: function() {

      let itemDtoList = this.form.schedulingDayConfigItemDtoList
      let subList = []
      itemDtoList.forEach(t => {
        t.configList.forEach(p => {
          subList.push({
            roomId: t.roomId,
            roomName: t.roomName,
            statusId: t.statusId,
            statusName: this.statusMap[t.statusId],
            configBizTime: t.configBizTime,
            configBizType: t.configBizType,
            configBizId: p.configBizId,
            configBizName: p.configBizName,
            configBizNum: p.configBizNum
          })
        })
      })

      this.form.schedulingDayConfigItemDtoList = subList

      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id !== undefined) {
            updateById(this.form).then(response => {
              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            add(this.form).then(response => {
              this.$modal.msgSuccess('新增成功')
              this.open = false
              this.getList()
            })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const idList = row.id ? [row.id] : this.ids
      this.$modal.confirm('是否确认删序号为 <span style="color:red">' + idList + '</span> 的数据项？', '删除提示').then(function() {
        let req = {
          idList: idList
        }
        return deleteByIdList(req)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess('删除成功')
      })
      document.getElementsByClassName('el-message-box')[0].style.width = '520px'
    },
    handleAddConfig(row) {
      let executeTime = 0
      if (row.configList && row.configList.length > 0) {
        let number = row.configList && row.configList.length - 1
        executeTime = row.configList[number].configBizTime
      } else {
        executeTime = row.configBizTime
      }
      row.configList.push({
        configBizTime: executeTime,
        configBizNum: 1,
        configBizId: undefined
      })
    },
    handleDeleteConfig(row, index) {
      row.configList.splice(index, 1)
    },
    selectConfigBizType(item, value) {
      console.info(item, value)
      item.configBizId = undefined
      if (value === 'bom') {
        item.configBizNameList = this.bomList
      } else if (value === 'sale') {
        item.configBizNameList = this.saleConfigList
      } else if (value === 'project') {
        item.configBizNameList = this.projectConfigList
      }
    }
  }

}


</script>

