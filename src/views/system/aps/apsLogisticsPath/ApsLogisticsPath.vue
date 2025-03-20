<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryForm" :inline="true" :model="queryParams" label-width="88px" size="small">
      <el-form-item label="工厂" prop="factoryId">
        <el-select v-model="queryParams.data.factoryId" placeholder="请选择工厂">
          <el-option v-for="item in factoryList" :key="item.id" :label="item.factoryName" :value="item.id"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="物流路径编码" prop="logisticsPathCode">
        <el-input v-model="queryParams.data.logisticsPathCode" clearable placeholder="请输入物流路径编码" @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="物流路径名称" prop="logisticsPathName">
        <el-input v-model="queryParams.data.logisticsPathName" clearable placeholder="请输入物流路径名称" @keyup.enter.native="handleQuery"/>
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

    <el-table v-loading="loading" :data="apsLogisticsPathList" @selection-change="handleSelectionChange">
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
    <el-dialog :title="title" :visible.sync="open" append-to-body width="1000px">
      <el-form ref="form" :model="form" :rules="rules" label-width="140px">
        <el-form-item label="工厂" prop="factoryId" >
          <!--          <el-input v-model="form.factoryId" clearable placeholder="请输入工厂"/>-->
          <el-select v-model="form.factoryId" placeholder="请选择工厂">
            <el-option v-for="item in factoryList" :key="item.id" :label="item.factoryName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="物流路径编码" prop="logisticsPathCode">
          <el-input v-model="form.logisticsPathCode" clearable placeholder="请输入物流路径编码"/>
        </el-form-item>
        <el-form-item label="物流路径名称" prop="logisticsPathName">
          <el-input v-model="form.logisticsPathName" clearable placeholder="请输入物流路径名称"/>
        </el-form-item>

        <el-form-item label="物流路径项" prop="apsLogisticsPathItemList">

          <el-row style="padding-bottom: 5px;margin-bottom: 10px ;border-bottom:  1px solid #ddd">
            <el-col :span="14">
              <el-input clearable placeholder="全部运输天数" v-model="form.allTransportDay"></el-input>
            </el-col>
            <el-col :span="9" :offset="1">
              <el-button type="primary" size="mini" icon="el-icon-setting" @click="setAllTransportDay">设置全部</el-button>
            </el-col>
          </el-row>

          <el-row v-for="(item,index) in form.apsLogisticsPathItemList" :key="index" style="padding-bottom: 5px;margin-bottom: 10px ;border-bottom:  1px solid #ddd">
            <el-col :span="5">
              <el-select v-model="item.provinceCode" placeholder="请选择省" disabled>
                <el-option v-for="item in provinceList" :key="item.id" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </el-col>
            <el-col :span="14">
              <el-input v-model="item.transportDay" clearable placeholder="请输入运输天数" style="width: 80%"/>
              <el-button v-show=" cityListMap[item.provinceCode] &&  cityListMap[item.provinceCode].length>0" type="primary" size="mini" icon="el-icon-plus" @click="addCity(item)">
                添加
              </el-button>

              <!-- v-if="cityListMap[item.provinceCode]&&cityListMap[item.provinceCode].length>0" -->
              <div style="margin: 5px 0" v-for="(c,i ) in item.cityList">
                <el-select v-model="c.cityCode" placeholder="请选择市" style="width: 150px">
                  <el-option v-for="item in cityListMap[item.provinceCode]" :key="item.id" :label="item.name" :value="item.code"></el-option>
                </el-select>
                <el-input v-model="c.transportDay" value="number" clearable placeholder="请输入运输天数" style="width: 150px;margin: 5px"/>
                <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteCity(item,c,i)">删除</el-button>
              </div>

            </el-col>

          </el-row>
        </el-form-item>

        <el-form-item label="备注" prop="logisticsPathRemark">
          <el-input v-model="form.logisticsPathRemark" clearable placeholder="请输入备注"/>
        </el-form-item>
        <el-form-item label="是否默认" prop="isDefault">
          <!--   0 否,1 是-->
          <el-select v-model="form.isDefault" placeholder="请选择是否默认 0 否,1 是">
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
      apsLogisticsPathList: [],
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
        allTransportDay: 4,
        logisticsPathCode: undefined,
        logisticsPathName: undefined,
        logisticsPathRemark: undefined,
        isDefault: 0,
        factoryId: undefined,
        id: undefined,
        apsLogisticsPathItemList: [{
          provinceCode: undefined,
          cityCode: undefined,
          transportDay: 4,
          cityList: []
        }]
      },
      // 表单校验
      rules: {
        logisticsPathCode :[{required: true, message: "不能为空", trigger: "blur"},{ min: 5, max: 20, message: '长度在 5 到 20 个字符', trigger: 'blur' }],
        logisticsPathName :[{required: true, message: "不能为空", trigger: "blur"},{ min: 5, max: 20, message: '长度在 5 到 20 个字符', trigger: 'blur' }],
        logisticsPathRemark :[{required: true, message: "不能为空", trigger: "blur"},{ min: 5, max: 20, message: '长度在 5 到 20 个字符', trigger: 'blur' }],
        isDefault :[{required: true, message: "不能为空", trigger: "blur"}],
        factoryId :[{required: true, message: "不能为空", trigger: "blur"},{ min: 5, max: 20, message: '长度在 5 到 20 个字符', trigger: 'blur' }],

      },
      tableHeaderList: [],
      factoryList: [],
      provinceList: [],
      cityListMap: {}
    }
  },
  created() {
    document['pagePath'] = '/apsLogisticsPath'
    getFactoryList({ queryPage: false }).then(t => {
      this.factoryList = t.data.dataList
    })
    queryUrlPageList('/districtCode', { queryPage: false }).then(t => {
      this.provinceList = t.data.dataList.filter(t => t.level === 1).sort(t => t.code)
      this.provinceList.forEach(p => {
        this.cityListMap[p.code] = t.data.dataList.filter(t => t.level === 2 && t.parentCode === p.code)
      })
    })
    this.getList()
  },
  methods: {
    /** 查询公告列表 */
    getList() {
      this.loading = true
      queryPageList(this.queryParams).then(response => {
        response = response.data
        this.tableHeaderList = response.headerList
        this.apsLogisticsPathList = response.dataList
        this.total = parseInt(response.total)
        this.loading = false
      })
    },
    cancel() {
      this.open = false
      this.reset();
 this.form.id=undefined;
  },
    // 表单重置
    reset() {
      let fid = this.form.id
      this.form = {
        allTransportDay: 4,
        logisticsPathCode: undefined,
        logisticsPathName: undefined,
        logisticsPathRemark: undefined,
        isDefault: 0,
        factoryId: undefined,
        id: fid,
        apsLogisticsPathItemList: []
      }
      this.provinceList.forEach(p => {
        let pt = {
          provinceCode: p.code,
          cityCode: undefined,
          transportDay: 4,
          cityList: []
        }
        if (this.cityListMap[p.code] && this.cityListMap[p.code].length > 0) {
          pt.cityList = []
        }

        this.form.apsLogisticsPathItemList.push(pt)
      })
      this.resetForm('form')
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
      this.reset();
 this.form.id=undefined;
    this.title = '添加物流路径'
      this.open = true
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      // this.reset();
 this.form.id=undefined;
    let req = { idList: [row.id], pageSize: 1, pageNum: 1 }
      getById(req).then(response => {
        this.form = response.data.dataList[0]
        let itemList = response.data.dataList[0].apsLogisticsPathItemList
        let groupBy = this.groupBy(itemList, 'provinceCode')

        let tmpList = []
        console.info(groupBy)
        for (let groupByKey in groupBy) {
          let t = groupBy[groupByKey]
          var items = {
            provinceCode: t[0].provinceCode,
            cityCode: undefined,
            transportDay: t[0].transportDay,
            cityList: []
          }
          tmpList.push(items)
          if (t.length > 1) {
            for (let i = 1; i < t.length; i++) {
              let k = t[i]
              let item = {
                provinceCode: k.provinceCode,
                cityCode: k.cityCode,
                transportDay: k.transportDay
              }
              items.cityList.push(item)
            }
          }
        }
        this.form.apsLogisticsPathItemList = tmpList
        this.title = '修改物流路径'
        this.open = true
      })

    },

    /** 提交按钮 */
    submitForm: function() {

      let apsLogisticsPathItemList = []

      let itemList = this.form.apsLogisticsPathItemList
      for (let i = 0; i < itemList.length; i++) {
        let item = itemList[i]
        apsLogisticsPathItemList.push({
          provinceCode: item.provinceCode,
          cityCode: undefined,
          transportDay: item.transportDay
        })
        if (item.cityList && item.cityList.length > 0) {
          for (let j = 0; j < item.cityList.length; j++) {
            let city = item.cityList[j]
            apsLogisticsPathItemList.push({
              provinceCode: item.provinceCode,
              cityCode: city.cityCode,
              transportDay: city.transportDay
            })
          }
        }
      }
      this.form.apsLogisticsPathItemList = apsLogisticsPathItemList

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
    addCity(item) {
      item.cityList.push({})
    },

    deleteCity(item, c, index) {
      item.cityList.splice(index, 1)
    },
    setAllTransportDay() {
      this.form.apsLogisticsPathItemList.forEach(t => {
        t.transportDay = this.form.allTransportDay
        t.cityList.forEach(c => {
          c.transportDay = this.form.allTransportDay
        })
      })
    }
  }

}


</script>

