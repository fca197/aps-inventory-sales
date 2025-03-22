<template>
  <div class="app-container">
    <el-steps :active="active" finish-status="success">
      <el-step title="基本信息">
      </el-step>
      <el-step title="订单排序"></el-step>
      <el-step title="产能排单"></el-step>
      <el-step title="结束"></el-step>
    </el-steps>
    <div style="height: 20px"></div>
    <el-form ref="form" :model="form" label-width="130px" :rules="rules">
      <div v-if="active===1">
        <el-form-item label="版本号" prop="schedulingVersionNo">
          <el-input v-model="form.schedulingVersionNo" placeholder="请输入版本号"></el-input>
        </el-form-item>
        <el-form-item label="版本名称" prop="schedulingVersionName">
          <el-input v-model="form.schedulingVersionName" placeholder="请输入版本名称"></el-input>
        </el-form-item>

        <el-form-item label="工厂" prop="factoryIdList">
          <el-select v-model="form.factoryIdList" placeholder="请输入版本名称" multiple>
            <el-option v-for="f in factoryList" :label="f.factoryName" :value="f.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品" prop="goodsIdList">
          <el-select v-model="form.goodsIdList" placeholder="请输入版本名称" multiple>
            <el-option v-for="g in filteredGoodsList()" :value="g.id" :label="g.goodsName"
            ></el-option>
          </el-select>
        </el-form-item>


        <el-form-item label="约束条件" prop="schedulingConstraintsId">
          <el-select v-model="form.schedulingConstraintsId" placeholder="请选择约束条件">
            <el-option
              v-for="item in schedulingConstraintsList"
              :key="item.id"
              :label="item.constraintsName"
              :value="item.id"
            >
            </el-option>
          </el-select>

        </el-form-item>

        <el-form-item label="开始日期" prop="startDate">
          <el-date-picker type="date" value-format="yyyy-MM-dd" v-model="form.startDate" placeholder="开始日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="排产限制约束">
          <el-checkbox-group v-model="form.useFactoryMakeCapacity">
            <el-checkbox value="true" label="工厂产能"></el-checkbox>
          </el-checkbox-group>
          <el-checkbox-group v-model="form.useGoodsMakeCapacity">
            <el-checkbox value="true" label="商品产能"></el-checkbox>
          </el-checkbox-group>
          <el-checkbox-group v-model="form.useSaleConfigMakeCapacity">
            <el-checkbox value="true" label="销售配置产能"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="排产天数" prop="schedulingDayCount">
          <el-input v-model.number="form.schedulingDayCount" placeholder="请输入排产天数"></el-input>
        </el-form-item>

        <!--        <el-form-item label="零件汇总结束日期">-->
        <!--          <el-date-picker-->
        <!--              v-model="form.bomTotalEndDate"-->
        <!--              type="date"-->
        <!--              placeholder="选择日期"-->
        <!--              value-format="yyyy-MM-dd">-->
        <!--          </el-date-picker>-->
        <!--        </el-form-item>-->
        <el-button style="margin-top: 12px;" @click="saveOrUpdate">下一步</el-button>
      </div>
      <div v-if="active===2">
        <use-constraints-result :id="form.id"></use-constraints-result>
        <el-button style="margin-top: 12px;" @click="pre">上一步</el-button>
        <el-button style="margin-top: 12px;" @click="useMakeCapacity" :disabled="useMakeCapacityDisable">下一步</el-button>
      </div>
      <div v-if="active===3">
        <use-make-capacity-result ref="makeResult" :id="form.id"></use-make-capacity-result>
        <el-button style="margin-top: 12px;" @click="pre">上一步</el-button>

        <el-button style="margin-top: 12px;" @click="finish" v-if="form.versionStep!==100">完成</el-button>
        <el-button style="margin-top: 12px;" @click="deploy" v-else>选择排产日期发布到制造系统</el-button>
        <el-button style="margin-top: 12px;" @click="showBomTotal">查看零件使用</el-button>
      </div>
    </el-form>
    <el-dialog title="零件使用" :visible.sync="showBomTotalShow" width="80%">
      <bom-total-result :id="schedulingVersionId"></bom-total-result>
    </el-dialog>
  </div>
</template>

<script>
import { getSchedulingConstraintsList } from '@/api/aps/schedulingConstraints'
import { add, post, queryPageList, showMsg, updateById } from '@/api/common'
import useConstraintsResult from '@/views/system/aps/scheduling/useConstraintsResult.vue'
import useMakeCapacityResult from '@/views/system/aps/scheduling/useMakeCapacityResult.vue'
import bomTotalResult from '@/views/system/aps/scheduling/bomTotalResult.vue'
import request from '@/utils/request'
import scheduling from '@/views/system/aps/scheduling/index.vue'
import { formatDates } from '@/utils/formatDate'
import { getFactoryList } from '@/api/factory'
import { getGoodsList } from '@/api/aps/goods'

export default {
  name: 'CreateScheduling',
  computed: {
    scheduling() {
      return scheduling
    }
  },
  components: {
    bomTotalResult,
    useConstraintsResult,
    useMakeCapacityResult
  },
  data() {
    return {
      schedulingVersionId: 0,
      showBomTotalShow: false,
      useMakeCapacityDisable: false,
      active: 1,
      isShow: false,
      schedulingConstraintsList: [],
      form: {
        startDate: formatDates(new Date(new Date().getTime() + 24 * 60 * 60 * 1000)).substring(0, 10),
        schedulingDayCount: 94,
        schedulingVersionNo: '',
        schedulingVersionName: '',
        factoryIdList: '',
        goodsIdList: '',
        schedulingConstraintsId: '',
        schedulingConstraintsName: '',
        useFactoryMakeCapacity: false,
        useGoodsMakeCapacity: false,
        useSaleConfigMakeCapacity: false,
        useProjectConfigMakeCapacity: false
      }
      , rules: {
        schedulingDayCount: [{ required: true, message: '不能为空' },
          { type: 'number', message: '必须为数字值' }],
        schedulingVersionNo: [{ required: true, message: '不能为空', trigger: 'blur' }, { min: 5, max: 20, message: '长度在 5 到 20 个字符', trigger: 'blur' }],
        schedulingVersionName: [{ required: true, message: '不能为空', trigger: 'blur' }, { min: 5, max: 20, message: '长度在 5 到 20 个字符', trigger: 'blur' }],
        schedulingConstraintsId: [{ required: true, message: '不能为空', trigger: 'blur' }],
        startDate: [{ required: true, message: '不能为空', trigger: 'blur' }]

      },
      factoryList: [],
      goodsList: []
    }

  },
  created() {
    getFactoryList({}).then(t => {
      this.factoryList = t.data.dataList
    })
    getGoodsList({}).then(t => this.goodsList = t.data.dataList)
    document['pagePath'] = '/apsSchedulingVersion'
    this.form.schedulingVersionNo = 'PC-' + this.formatDates(new Date(), true)
    this.form.schedulingVersionName = '排产-' + this.formatDates(new Date(), true)
    getSchedulingConstraintsList({ pageNum: 1, pageSize: 300 }).then(t => {
      this.schedulingConstraintsList = t.data.dataList
    })
    if (this.$route.query.id) {
      queryPageList({ data: { id: this.$route.query.id }, queryPage: false })
      .then(t => {
        this.form = t.data.dataList[0]
        this.isShow = this.form.versionStep === 100
      })
    }
  },
  watch: {
    'form.factoryIdList': {
      handler(n, o) {
        // console.log(n,o)
        this.form.goodsIdList=[]
      }
    }
  },
  methods: {

    saveOrUpdate() {
      if (this.isShow) {
        this.next()
        return
      }
      this.$refs['form'].validate(res => {
        if (res) {
          if (this.form.id) {
            updateById(this.form).then(t => {
              showMsg(t, '修改成功')
              this.useConstraints()
            })
          } else {
            add(this.form).then(t => {
              showMsg(t, '保存成功')
              this.form.id = t.data.id
              this.useConstraints()
            })
          }
        }
      })

    },
    next() {
      if (this.active++ > 2) {
        this.active = 0
      }
    },
    pre() {
      if (this.active-- < 0) {
        this.active = 2
      }
    },
    deploy() {
      var dateList = this.$refs.makeResult.queryParams.currentDate
      if (dateList.length === 0) {
        this.$message.error('请选择排产日期')
        return
      }
      post('apsSchedulingIssueItem/insert', {
        schedulingVersionId: this.form.id,
        scheduledDayList: dateList
      })
      //
      // showMsg({code: 200}, dateList + "发布完成");
    },

    finish() {
      if (this.isShow) {
        this.$tab.closeOpenPage('/aps/scheduling/index')
        return
      }
      request({
        url: '/apsSchedulingVersion/finish',
        method: 'post',
        data: {
          id: this.form.id
        }
      }).then(() => {
        showMsg({ code: 200, msg: '完成' })
        this.active = 4
        this.$tab.closeOpenPage('/aps/scheduling/index')
      })
    },

    useConstraints() {
      if (this.isShow) {
        this.next()
        return
      }
      request({
        url: '/apsSchedulingVersion/useConstraints',
        method: 'post',
        data: {
          id: this.form.id
        }
      }).then((() => {
        this.next()
        this.useMakeCapacityDisable = false
      }))
      // this.next();
    },
    useMakeCapacity() {
      if (this.isShow) {
        this.next()
        return
      }
      request({
        url: '/apsSchedulingVersion/useMakeCapacity',
        method: 'post',
        data: {
          id: this.form.id
        }
      }).then(t => {
        this.next()
      })
      // this.next();

    },
    useConstraintsResult() {

    },
    showBomTotal() {
      this.schedulingVersionId = this.form.id
      this.showBomTotalShow = true
    },
    filteredGoodsList() {
      if (this.form.factoryIdList.length === 0) {
        this.form.goodsIdList.slice(0, this.form.goodsIdList.length)
        return []
      }
      return this.goodsList.filter(good =>
        this.form.factoryIdList.includes(good.factoryId)
      )
    }
  }
}
</script>


<style scoped lang="scss">
/* 在全局样式文件中添加以下样式 */
.el-select {
  width: 550px;
}
</style>
