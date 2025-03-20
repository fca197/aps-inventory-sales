<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="88px">
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
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"></el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="brandNameList" @selection-change="handleSelectionChange">
      <el-table-column label="全选" type="selection" align="center" prop="id" width="50"/>
      <el-table-column v-for="(item,index) in  tableHeaderList" :key="index" align="center" :prop="item.fieldName" :label="item.showName"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right" width="140px">
        <template slot-scope="scope">
          <!--          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)">修改</el-button>-->
          <el-button size="mini" type="text" icon="el-icon-s-data" @click="handleInfo(scope.row)">详情</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>

    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" label-width="100px">

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="title" :visible.sync="openItemShow" width="1200px" append-to-body>

      <el-form inline>
        <el-form-item label="开始时间">
          <el-date-picker v-model="mailForm.beginDate"/>
        </el-form-item>
        <el-form-item label="开始时间">
          <el-date-picker v-model="mailForm.endDate"/>
        </el-form-item>
        <el-button type="primary" size="medium" ref="sendMailBtn" @click="sendMail" :disabled="mailBtnIsDisabled">发送经销商</el-button>
      </el-form>
      <el-table :data="apsGoodsBomBuyPlanItemDataItem" height="600px">
        <el-table-column v-for="(item,index) in  apsGoodsBomBuyPlanItemHeaderItem" :key="index" align="center" :width="item.width" :prop="item.fieldName" :label="item.showName"/>
        <el-table-column v-for="(item ,index) in JSON.parse(buyPlan.bomUseDate) " :key="index+100" width="190px" :label="item.date">
          <template scope="scope">
            <span v-if=" scope.row['bomUseDay'+item.day]">
               <el-popover placement="top-start" width="270" trigger="hover">
                 <div style="width: 230px">
                   <kv :label="'类型'" :value="scope.row['bomUseDay' + item.day]['lack'] ? '购买' : '存量' "></kv>
                 <kv :label="'使用量'" :value="scope.row['bomUseDay' + item.day]['need_use'] "></kv>
                 <kv :label="'库存'" :value="scope.row['bomUseDay' + item.day]['bom_inv']"></kv>
                 <kv :label="'缺少量'" :value="scope.row['bomUseDay' + item.day]['buy_inv']"></kv>
                 </div>
                  <el-button slot="reference">{{ scope.row['bomUseDay' + item.day]['buy_inv'] }}</el-button>
                </el-popover>


            </span>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>

import { add, deleteByIdList, getById, post, queryPageList, queryUrlPageList, updateById } from '@/api/common' // console.info("xxx: ",uc.urlPrefix)
// console.info("xxx: ",uc.urlPrefix)
import kv from '@/layout/components/kv.vue'

export default {
  name: 'tenantName',
  components: { kv },
  data() {

    return {
      // 遮罩层
      loading: true,
      openItemShow: false,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      mailBtnIsDisabled: false,
      // 显示搜索条件
      showSearch: false,
      // 总条数
      total: 0,

      brandNameList: [],
      goodsList: [],
      workStationList: [],
      factoryList: [],
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
      mailForm: {
        beginDate: undefined,
        endDate: undefined
      },
      // 表单参数
      form: {
        goodsId: undefined,
        factoryId: undefined,
        goodsRemark: '',
        remark: '',
        brandName: '',
        pwd: '',
        id: undefined,
        confirmPwd: undefined,
        isFollow: false
      },
      // 表单校验
      rules: {},
      tableHeaderList: [],
      apsGoodsBomBuyPlanItemDataItem: [],
      apsGoodsBomBuyPlanItemHeaderItem: [],
      buyPlan: {
        bomUseDate: '[]'
      }
    }
  },
  created() {
    document['pagePath'] = '/apsGoodsBomBuyPlan'
    // process.env.pagePath = "/tenant"
    this.getList()

  },
  methods: {
    /** 查询公告列表 */
    getList() {
      this.loading = true
      queryPageList(this.queryParams).then(response => {
        response = response.data
        this.tableHeaderList = response.headerList
        this.brandNameList = response.dataList
        this.total = parseInt(response.total)
        this.loading = false
      })
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset();
 this.form.id=undefined;
  },
    // 表单重置
    reset() {
      this.form = {}
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
    this.open = true
      this.title = '添加零件'
    },
    handleInfo(row) {
      this.buyPlan = row
      queryUrlPageList('/apsGoodsBomBuyPlanItem', { queryPage: false, data: { buyPlanId: row.id } }).then(t => {
        this.apsGoodsBomBuyPlanItemDataItem = t.data.dataList
        this.apsGoodsBomBuyPlanItemDataItem.forEach(t3 => {
          for (let lt in t3) {
            if (lt.startsWith('bomUseDay') && t3[lt]) {
              t3[lt] = JSON.parse(t3[lt])
            }
          }
        })

        this.apsGoodsBomBuyPlanItemHeaderItem = t.data.headerList
        this.openItemShow = true
      })
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
 this.form.id=undefined;
    let req = { idList: [row.id], pageSize: 1, pageNum: 1 }
      getById(req).then(response => {
        this.form = response.data.dataList[0]
        this.open = true
        this.title = '修改零件'
      })
    },
    /** 提交按钮 */
    submitForm: function() {
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
    sendMail() {
      if (this.mailForm.beginDate === undefined || this.mailForm.endDate === undefined) {
        this.$message.error("开始或结束日期不能为空");
        return;
      }
      this.mailForm.buyPlanId=this.buyPlan.id;
      this.mailBtnIsDisabled=true
      post("/apsGoodsBomBuyPlanItem/sendMail2supplier",this.mailForm,true).then(t=>this.mailBtnIsDisabled=false)
    }
  }
}
</script>
