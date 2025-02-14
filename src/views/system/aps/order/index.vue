<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryForm" :inline="true" :model="queryParams" label-width="88px" size="small">
      <el-form-item label="工厂" prop="factoryList">
        <el-select v-model="queryParams.data.factoryId" clearable placeholder="请选择工厂">
          <el-option v-for="item in factoryList" :key="item.id" :label="item.factoryName" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <!-- 订单号 -->
      <el-form-item label="订单编号" prop="orderNo">
        <el-input v-model="queryParams.data.orderNo" placeholder="订单编号" clearable size="small" style="width: 200px"/>
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
        <el-button icon="el-icon-plus" plain size="mini" type="primary" @click="saveBatch">随机批量100条</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button :disabled="multiple" icon="el-icon-delete" plain size="mini" type="danger" @click="handleDelete"></el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="brandNameList" @selection-change="handleSelectionChange">

      <el-table-column align="center" label="全选" prop="id" type="selection" width="50"/>

      <el-table-column v-for="(item,index) in  tableHeaderList" :key="index" :label="item.showName" :prop="item.fieldName" :width="item.width" align="center">
        <template slot-scope="scope">
        <span v-if="item.fieldName=='orderGoodsStatus'">
          <el-select v-model="scope.row.orderGoodsStatus" @change="value=>{ updateOrderGoodsStatus(scope.row.id, value)}">
            <el-option v-for="(s,i) in apsStatusList" :key="s.id" :value="s.id" :label="s.statusName"></el-option>
          </el-select>
        </span>
<!--          <span v-else-if="item.fieldName=='orderStatus'">-->
<!--              订单状态-->
<!--        </span>-->
          <span v-else-if="item.fieldName==='schedulingDate'">
            <el-date-picker v-model="scope.row.schedulingDate" value-format="yyyy-MM-dd" @change="value=>{updateSchedulingDate(scope.row,value)}" style="width: 140px"
            ></el-date-picker>
          </span>
          <span v-else>
          {{ scope.row[item.fieldName] }}
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" class-name="small-padding fixed-width" label="操作" width="100" fixed="right">
        <template slot-scope="scope">
          <el-button icon="el-icon-edit" size="mini" type="text" @click="handleUpdate(scope.row)"></el-button>
          <el-button icon="el-icon-delete" size="mini" type="text" @click="handleDelete(scope.row)"></el-button>
          <el-button icon="el-icon-s-data" size="mini" type="text" @click="handleStatusInfo(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :limit.sync="queryParams.pageSize" :page.sync="queryParams.pageNum" :total="total" @pagination="getList"/>

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" append-to-body width="900px">
      <el-form ref="form" :model="form" label-width="100px">
        <el-tabs tab-position="left" style="height: 650px;" type="border-card">
          <el-tab-pane label="基本信息">
            <el-form-item label="订单编号" prop="orderNo">
              <el-input disabled v-model="form.orderNo" placeholder="请输入订单编号"/>
            </el-form-item>
            <el-form-item label="订单金额" prop="orderAmount">
              <el-input v-model="form.orderTotalPrice" placeholder="请输入订单金额"/>
            </el-form-item>
            <el-form-item label="定金金额" prop="orderAmount">
              <el-input v-model="form.reserveAmount" placeholder="请输入定金金额"/>
            </el-form-item>
            <el-form-item label="定金支付时间">
              <el-date-picker v-model="form.reserveDatetime" type="datetime" placeholder="选择日期时间"
                              align="right" value-format="yyyy-MM-dd HH:mm:ss"
              />
            </el-form-item>

            <el-form-item label="尾款金额" prop="finishPayedAmount">
              <el-input v-model="form.finishPayedAmount" placeholder="请输入尾款金额"/>
            </el-form-item>
            <el-form-item label="尾款支付时间" prop="finishPayedDatetime">
              <el-date-picker v-model="form.finishPayedDatetime" type="datetime" placeholder="选择日期时间"
                              align="right" value-format="yyyy-MM-dd HH:mm:ss"
              />
            </el-form-item>
            <el-form-item label="制造完成时间" prop="makeFinishDate">
              <el-date-picker v-model="form.makeFinishDate" type="date" placeholder="选择日期时间"
                              align="right" value-format="yyyy-MM-dd"
              />
            </el-form-item>
            <el-form-item label="交付时间" prop="deliveryDate">
              <el-date-picker v-model="form.deliveryDate" type="date" placeholder="选择日期时间"
                              align="right" value-format="yyyy-MM-dd"
              />
            </el-form-item>


            <el-form-item label="订单状态" prop="orderStatus">
              <el-select v-model="form.orderStatus" placeholder="请选择订单状态">
                <el-option label="待支付" value="1"/>
              </el-select>
            </el-form-item>

            <el-form-item label="订单备注" prop="orderRemark">
              <el-input v-model="form.orderRemark" placeholder="请输入订单备注"/>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="用户管理">
            <el-form-item label="客户名称" prop="userName">
              <el-input v-model="form.orderUser.userName" placeholder="请输入客户名称"/>
            </el-form-item>
            <el-form-item label="客户电话" prop="userPhone">
              <el-input v-model="form.orderUser.userPhone" placeholder="请输入客户电话"/>
            </el-form-item>
            <el-form-item label="客户性别" prop="userMobile">
              <el-radio-group v-model="form.orderUser.userSex">
                <el-radio :label="1">男</el-radio>
                <el-radio :label="0">女</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="国家" prop="userEmail">
              <el-select v-model="form.orderUser.countryCode" placeholder="请选择省份">
                <el-option v-for="item in countryCodeList" :key="item.id" :label="item.name" :value="item.id"/>
              </el-select>
            </el-form-item>
            <el-form-item label="省份" prop="provinceCode">
              <el-select v-model="form.orderUser.provinceCode" placeholder="请选择省份">
                <el-option v-for="item in provinceCodeList" :key="item.id" :label="item.name" :value="item.id"/>
              </el-select>
            </el-form-item>
            <el-form-item label="城市" prop="cityCode">
              <el-select v-model="form.orderUser.cityCode" placeholder="请选择城市">
                <el-option v-for="item in cityCodeList" :key="item.id" :label="item.name" :value="item.id"/>
              </el-select>
            </el-form-item>
            <el-form-item label="区县" prop="areaCode">
              <el-select v-model="form.orderUser.areaCode" placeholder="请选择区县">
                <el-option v-for="item in areaCodeList" :key="item.id" :label="item.name" :value="item.id"/>
              </el-select>
            </el-form-item>
            <el-form-item label="客户地址" prop="userAddress">
              <el-input v-model="form.orderUser.userAddress" placeholder="请输入客户地址"/>
            </el-form-item>
            <el-form-item label="备注" prop="userAddress">
              <el-input v-model="form.orderUser.userRemark" placeholder="请输入备注"/>
            </el-form-item>
            <el-button type="text" @click="getRandomUser">随机用户</el-button>
          </el-tab-pane>
          <el-tab-pane label="商品管理">
            <el-col :span="24" v-for="(it ,i) in form.goodsList" :key="i">
              <el-col :span="24">
                <el-select v-model="it.goodsId" placeholder="请选择商品" @change="value=>selectGoods(i,value)" style="width: 100%">
                  <el-option v-for="item in goodsList" :key="item.id" :label="item.goodsName" :value="item.id"/>
                </el-select>
                <el-input disabled v-model="it.goodsNum" placeholder="请输入商品数量"/>
              </el-col>
              <!--              <el-col :span="7" :offset="1">-->
              <!--                <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteGoods(i)"></el-button>-->
              <!--                <el-button type="primary" size="mini" icon="el-icon-plus" @click="addGoods"></el-button>-->
              <!--              </el-col>-->
            </el-col>
          </el-tab-pane>
          <el-tab-pane label="销售配置">
            <el-row title="销售配置" v-for="(it ,i) in  form.goodsList" :name="i" :key="i">
              <div v-if="goodsMap[it.goodsId]"> {{ goodsMap[it.goodsId].goodsName }}/ <span>{{ it.goodsNum }} /{{ goodsMap[it.goodsId].goodsRemark }}</span></div>
              <el-col :span="24" v-for="(sa ,index) in apsSaleConfigList" :key="index">
                <el-divider/>
                <el-col :span="6">
                  {{ sa.saleName }}/{{ sa.saleCode }}
                </el-col>
                <el-col :span="18">
                  <el-radio-group v-model="goodsSaleConfigMap[it.goodsId][sa.id]" @change="value=>changeGM(it.goodsId, sa.id,value)">
                    <el-radio v-for=" (ss ,j) in sa.children" :label="ss.id" :key="j">{{ ss.saleName }}/{{ ss.saleCode }}</el-radio>
                  </el-radio-group>
                </el-col>
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="工程配置">工程配置</el-tab-pane>
          <el-tab-pane label="零件">
            <el-table :data="goodsBomList">
              <el-table-column prop="bomName" label="名称"/>
              <el-table-column prop="bomCode" label="编号"/>
              <el-table-column prop="bomCostPriceUnit" label="单价规格"/>
              <el-table-column prop="bomCostPrice" label="单价"/>
              <el-table-column prop="isFollow" label="关注"/>
              <el-table-column label="数量">
                <template slot-scope="scope">
                  <el-input v-model="form.goodsBom[scope.row.id]">数量</el-input>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="订单状态时间一览表" :visible.sync="orderGoodsStatusDateShow" width="900px" append-to-body>
      <step :Index="3" :okRouteList="orderGoodsStatusDateList"/>
    </el-dialog>
  </div>
</template>

<script>

import { add, deleteByIdList, getById, log, post, queryPageList, queryUrlNoPageList, queryUrlPageList } from '@/api/common'
import { getFactoryList } from '@/api/factory'
import { getGoodsList } from '@/api/aps/goods'
import { getRandomUser } from '@/api/tool/random'
import request from '@/utils/request'
import { getSaleConfigList } from '@/api/aps/saleConfig' // console.info("xxx: ",uc.urlPrefix)
// console.info("xxx: ",uc.urlPrefix)
import Step from '@/views/components/step/Steps.vue'

export default {
  name: 'tenantName',
  components: {
    Step
  },
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

      brandNameList: [],
      goodsList: [],
      goodsMap: {},
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
      countryCodeList: [],
      provinceCodeList: [],
      cityCodeList: [],
      apsSaleConfigList: [],
      orderGoodsStatusDateList: [],
      orderGoodsStatusDateShow: false,
      areaCodeList: [],
      goodsSaleConfigMap: {},
      // 表单参数
      form: {
        goodsBom: {},
        goodsList: [],
        orderUser: {
          userName: undefined,
          userPhone: undefined,
          userSex: undefined,
          countryCode: undefined,
          provinceCode: undefined,
          cityCode: undefined,
          areaCode: undefined,
          userAddress: undefined,
          userRemark: undefined
        },
        goodsProjectConfigList: [],
        goodsSaleConfigList: [],
        id: undefined,
        confirmPwd: undefined
      },
      // 表单校验
      rules: {},
      tableHeaderList: [],
      goodsBomList: [],
      apsStatusList: []
    }
  },
  created() {
    document['pagePath'] = '/apsOrder'
    // process.env.pagePath = "/tenant"

    queryUrlNoPageList('/apsStatus').then(t => {
      this.apsStatusList = t.data.dataList
    })

    this.getList()
    getFactoryList({ queryPage: false }).then(data => {
      this.factoryList = data.data.dataList
      // console.info("factoryList: ", this.factoryList);
    })
    getGoodsList({ queryPage: false }).then(data => {
      this.goodsList = data.data.dataList
      this.goodsList.forEach(item => {
        this.goodsMap[item.id] = item
      })
      // console.info("goodsList: ", this.goodsList);
    })
    getSaleConfigList({ queryPage: false }).then(res => {
      this.apsSaleConfigList = res.data.dataList
    })
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
      this.orderGoodsStatusDateShow = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        goodsBom: {},
        goodsList: [],
        orderUser: {
          userName: undefined,
          userPhone: undefined,
          userSex: undefined,
          countryCode: undefined,
          provinceCode: undefined,
          cityCode: undefined,
          areaCode: undefined,
          userAddress: undefined,
          userRemark: undefined
        }
      }
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
      this.reset()
      this.addGoods(this.goodsList[0].id)
      this.selectGoods(0, this.goodsList[0].id)
      this.open = true
      this.title = '添加订单'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      let req = { idList: [row.id], pageSize: 1, pageNum: 1 }
      getById(req).then(response => {
        this.form = response.data.dataList[0]
        this.open = true
        this.title = '修改订单'
      })

    },
    /** 提交按钮 */
    submitForm: function() {
      //
      // private Long orderId;
      // private Long goodsId;
      // private Long configId;
      // private Long factoryId
      let apsOrderSaleConfigList = []
      for (let g in this.goodsSaleConfigMap) {
        for (let gs in this.goodsSaleConfigMap[g]) {
          apsOrderSaleConfigList.push({
            orderId: this.form.id,
            goodsId: g,
            configId: this.goodsSaleConfigMap[g][gs]
          })
        }
      }
      let apsGoodsBomList = []
      var goodsId = this.goodsList[0].goodsId
      for (let k in this.form.goodsBom) {
        let v = this.form.goodsBom[k]
        apsGoodsBomList.push({ goodsId: goodsId, bomCount: v, goodsBomId: k })
      }
      this.form.apsGoodsBomList = apsGoodsBomList
      this.form.apsOrderSaleConfigList = apsOrderSaleConfigList
      add(this.form).then(response => {
        this.$modal.msgSuccess('新增成功')
        this.open = false
        this.getList()
      })
    }
    ,
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
    }
    ,
    getRandomUser() {
      getRandomUser().then(d => {
        let randomUser = d.data
        this.form.orderUser.userName = randomUser.name
        this.form.orderUser.userPhone = randomUser.phone
        this.form.orderUser.userSex = randomUser.sex
        this.form.orderUser.userAddress = randomUser.address
      })
    },
    addGoods(val) {
      this.form.goodsList.push({
        goodsNum: 1,
        goodsId: val

      })
    },
    deleteGoods(index) {
      this.form.goodsList.splice(index, 1)
    },
    selectGoods(index, value) {
      let v = this.form.goodsList.filter(t => t.goodsId === value).length
      if (v > 1) {
        this.$message.error(this.goodsMap[value].goodsName + '该商品已存在')
        this.form.goodsList[index].goodsId = undefined
      }
      // apsGoodsSaleItemQueryPageList({ data: { goodsId: value }, queryPage: false }).then(res => {
      //   // console.info('res: ', res)
      // })
      this.goodsSaleConfigMap[value] = {}
      this.apsSaleConfigList.forEach(t => {
        this.goodsSaleConfigMap[value][t.id] = undefined
        t.children.forEach(t1 => {
          this.goodsSaleConfigMap[value][t.id] = t1.id
        })
      })
      this.goodsSaleConfigMap = { ...this.goodsSaleConfigMap }

      queryUrlNoPageList('/apsGoodsBom', { data: { goodId: value } }).then(tr => {
        this.goodsBomList = tr.data.dataList
      })

      // console.info('.goodsSaleConfigMap: ', this.goodsSaleConfigMap)
    },
    saveBatch() {
      request({
        url: '/apsOrder/batchInsert',
        method: 'post',
        data: {
          createCount: 100
        }
      }).then(response => {
        this.$message.success('保存成功')
      })
    },
    changeGM(gid, sid, value) {
      // console.info('changeGM: ', gid, sid, value)
      // console.info('this.goodsSaleConfigMap: ', this.goodsSaleConfigMap)
      this.goodsSaleConfigMap[gid][sid] = value
      // console.info('this.goodsSaleConfigMap: ', this.goodsSaleConfigMap)
      this.$forceUpdate()
    },
    handleStatusInfo(row) {
      queryUrlPageList('/apsOrderGoodsStatusDate', {
        queryPage: false, data: {
          orderId: row.id
        }
      }).then(res => {
        this.id = row.id
        this.orderGoodsStatusDateList = res.data.dataList.reverse()
        this.orderGoodsStatusDateShow = true
      })
    }
    , updateOrderGoodsStatus(orderId, sid) {
      post('/apsOrder/updateOrderStatus', {
        orderId: orderId,
        goodsStatusId: sid
      })
    },
    updateSchedulingDate(row, val) {
      log('updateSchedulingDate: ', row, val)
      this.$modal.confirm('订单号:[<span style="color:red">' + row.orderNo + '</span>],排产日期修改为:[<span style="color:red">' + (val == null ? '空' : val) + '</span>] ',
        '修改提示').then(function() {
        post('/apsOrder/updateSchedulingDate', { id: row.id, schedulingDate: val }, true)
      })
    }
  }
}

</script>

<style>
/deep/ input[aria-hidden="true"] {
  display: none !important;
}

/deep/ .el-radio:focus:not(.is-focus):not(:active):not(.is-disabled) .el-radio__inner {
  box-shadow: none !important;
}
</style>
