<template>
  <div>
    <el-form ref="addForm" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="备注">
        <el-input v-model="form.orderRemark" placeholder="请输入备注" clearable></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="form.orderStatus" placeholder="请选择状态">
          <el-option v-for="( value,key,index) in orderStatusOptionsMap" :key="index" :label="value" :value="key">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="订单号">
        <div v-for="(item,index) in form.goodsList">
          <el-select v-model="item.goodsId" placeholder="请选择商品" @change="changeGoods">
            <el-option v-for="(value,key,index) in toSelectGoods" :key="index" :label="value.goodsName" :value="value.id"/>
          </el-select>
          <el-input v-model="item.goodsCount" placeholder="商品数量" clearable></el-input>
        </div>
      </el-form-item>
      <el-form-item label="" prop="" align="right">
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {add, updateById} from '@/api/common'

export default {
  name: "createOrder",
  props: {
    open: {},
    successFun: {},
    orderStatusOptionsMap: {}
  },
  computed: {},
  components: {},
  data() {
    return {
      toSelectGoods: [{
        id: "11111",
        goodsName: "商品11"
      }],
      // 表单参数
      form: {
        goodsList: [{}, {}],
        orderStatus: "10",
        goodsName: undefined,
        goodsId: undefined,
        goodsCount: 1
      },
      // 表单校验
      rules: {}
    };
  },
  created() {
    document["pagePath"] = "/jcx/order";
  },
  mounted() {
    this.$nextTick(()=>{
      console.log("xxxx")
      this.form = {
        goodsList: [{}, {}],
        orderStatus: "10",
        goodsName: undefined,
        goodsId: undefined,
        goodsCount: 1
      }
    })
  },
  methods: {
    // 取消按钮
    cancel() {
      this.$emit("cancel", false);
    },
    // 表单重置
    reset() {
      this.resetForm("form");
    },

    /** 提交按钮 */
    submitForm: function () {
      if (this.form.id !== undefined) {
        return updateById(this.form).then(response => this.successFunExec(response));
      } else {
        return add(this.form).then(response => this.successFunExec(response));
      }
    },
    successFunExec(response) {
      if (this.successFun) {
        this.successFun(response);
      } else {
        this.$modal.msgSuccess("新增成功");
      }
    },
    changeGoods(val) {

    }
  }
}
</script>
