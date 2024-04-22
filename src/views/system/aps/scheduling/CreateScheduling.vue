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
    <el-form :model="form" label-width="100px">
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
        <el-button style="margin-top: 12px;" @click="saveOrUpdate">下一步</el-button>
      </div>
      <div v-if="active===2">
        <use-constraints-result :id="form.id"></use-constraints-result>
        <el-button style="margin-top: 12px;" @click="pre">上一步</el-button>
        <el-button style="margin-top: 12px;" @click="useMakeCapacity">下一步</el-button>
      </div>
      <div v-if="active===3">
        <use-make-capacity-result :id="form.id"></use-make-capacity-result>
        <el-button style="margin-top: 12px;" @click="pre">上一步</el-button>
        <el-button style="margin-top: 12px;" @click="finish">完成</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import {getSchedulingConstraintsList} from "@/api/aps/schedulingConstraints";
import {add, queryPageList, showMsg, updateById} from "@/api/common";
import useConstraintsResult from "@/views/system/aps/scheduling/useConstraintsResult.vue";
import useMakeCapacityResult from "@/views/system/aps/scheduling/useMakeCapacityResult.vue"
import request from "@/utils/request";

export default {
  name: "CreateScheduling",
  components: {
    useConstraintsResult,
    useMakeCapacityResult
  },
  data() {
    return {
      active: 1,
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
    getSchedulingConstraintsList({pageNum: 1, pageSize: 300}).then(t => {
      this.schedulingConstraintsList = t.data.dataList;
    });
    if (this.$route.query.id) {
      queryPageList({data: {id: this.$route.query.id}, pageNum: 1, pageSize: 300})
      .then(t => {
        this.form = t.data.dataList[0];
      });
    }
  },
  methods: {

    saveOrUpdate() {
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
    finish() {

      request({
        url: "/apsSchedulingVersion/finish",
        method: "post",
        data: {
          id: this.form.id
        }
      }).then(() => {
        showMsg({code: 200, msg: "完成"})
        this.active = 4;
        this.$tab.closeOpenPage("/aps/make/scheduling/index")
      })
    },

    useConstraints() {
      request({
        url: "/apsSchedulingVersion/useConstraints",
        method: "post",
        data: {
          id: this.form.id
        }
      }).then((() => this.next()))
      // this.next();
    },
    useMakeCapacity() {
      this.next();
      request({
        url: "/apsSchedulingVersion/useMakeCapacity",
        method: "post",
        data: {
          id: this.form.id
        }
      }).then(t => {

      })
      // this.next();

    },
    useConstraintsResult() {

    }
  }
}
</script>


<style scoped lang="scss">

</style>
