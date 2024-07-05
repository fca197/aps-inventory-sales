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
    <el-form :model="form" label-width="130px">
      <div v-if="active===1">
        <el-form-item label="版本号">
          <el-input v-model="form.schedulingVersionNo" placeholder="请输入版本号"></el-input>
        </el-form-item>
        <el-form-item label="版本名称">
          <el-input v-model="form.schedulingVersionName" placeholder="请输入版本名称"></el-input>
        </el-form-item>
        <el-form-item label="约束条件">
          <el-select v-model="form.schedulingConstraintsId" placeholder="请选择约束条件">
            <el-option
                v-for="item in schedulingConstraintsList"
                :key="item.id"
                :label="item.constraintsName"
                :value="item.id">
            </el-option>
          </el-select>

        </el-form-item>

        <el-form-item label="排产天数">
          <el-input v-model="form.schedulingDayCount" placeholder="请输入排产天数"></el-input>
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
import {getSchedulingConstraintsList} from "@/api/aps/schedulingConstraints";
import {add, queryPageList, showMsg, updateById} from "@/api/common";
import useConstraintsResult from "@/views/system/aps/scheduling/useConstraintsResult.vue";
import useMakeCapacityResult from "@/views/system/aps/scheduling/useMakeCapacityResult.vue"
import bomTotalResult from "@/views/system/aps/scheduling/bomTotalResult.vue";
import request from "@/utils/request";
import scheduling from "@/views/system/aps/scheduling/index.vue";

export default {
  name: "CreateScheduling",
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
        schedulingDayCount: 94,
        schedulingVersionNo: "",
        schedulingVersionName: "",
        schedulingConstraintsId: "",
        schedulingConstraintsName: ""
      }
    }

  },
  created() {
    document["pagePath"] = "/apsSchedulingVersion";
    this.form.schedulingVersionNo = "PC-" + this.formatDates(new Date(), true);
    this.form.schedulingVersionName = "排产-" + this.formatDates(new Date(), true);
    getSchedulingConstraintsList({pageNum: 1, pageSize: 300}).then(t => {
      this.schedulingConstraintsList = t.data.dataList;
    });
    if (this.$route.query.id) {
      queryPageList({data: {id: this.$route.query.id}, pageNum: 1, pageSize: 300})
      .then(t => {
        this.form = t.data.dataList[0];
        this.isShow = this.form.versionStep === 100;
      });
    }
  },
  methods: {

    saveOrUpdate() {
      if (this.isShow) {
        this.next();
        return;
      }
      if (this.form.id) {
        updateById(this.form).then(t => {
          showMsg(t, "修改成功")

          this.useConstraints();
        });
      } else {
        add(this.form).then(t => {
          showMsg(t, "保存成功")
          this.form.id = t.data.id;
          this.useConstraints();
        });
      }
    },
    next() {
      if (this.active++ > 2) {
        this.active = 0;
      }
    },
    pre() {
      if (this.active-- < 0) {
        this.active = 2;
      }
    },
    deploy() {
      var dateList = this.$refs.makeResult.queryParams.currentDate;
      if (dateList.length === 0) {
        this.$message.error("请选择排产日期");
        return
      }

      showMsg({code: 200}, dateList + "发布完成");
    },

    finish() {
      if (this.isShow) {
        this.$tab.closeOpenPage("/aps/scheduling/index")
        return;
      }
      request({
        url: "/apsSchedulingVersion/finish",
        method: "post",
        data: {
          id: this.form.id
        }
      }).then(() => {
        showMsg({code: 200, msg: "完成"})
        this.active = 4;
        this.$tab.closeOpenPage("/aps/scheduling/index")
      })
    },

    useConstraints() {
      if (this.isShow) {
        this.next();
        return;
      }
      request({
        url: "/apsSchedulingVersion/useConstraints",
        method: "post",
        data: {
          id: this.form.id
        }
      }).then((() => {
        this.next()
        this.useMakeCapacityDisable = false;
      }))
      // this.next();
    },
    useMakeCapacity() {
      if (this.isShow) {
        this.next();
        return;
      }
      request({
        url: "/apsSchedulingVersion/useMakeCapacity",
        method: "post",
        data: {
          id: this.form.id
        }
      }).then(t => {
        this.next();
      })
      // this.next();

    },
    useConstraintsResult() {

    },
    showBomTotal() {
      this.schedulingVersionId = this.form.id;
      this.showBomTotalShow = true;
    }
  }
}
</script>


<style scoped lang="scss">

</style>
