<template>
  <div>
    <el-form ref="addForm" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="备注">
        <el-input v-model="form.orderRemark" clearable placeholder="请输入备注"></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="form.orderStatus" placeholder="请选择状态">
          <el-option v-for="( value,key,index) in orderStatusOptionsMap" :key="index" :label="value" :value="key">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商品">
        <div v-for="(item,index) in form.goodsList" v-if="toSelectGoods[index]" class="goods-item">
          <el-col :span="10">
            {{ index + 1 }}=>
            <el-select v-model="item.goodsId" :filter-method="value=>{changeGoods(value,index)}" filterable placeholder="请选择商品" width="100%">
              <el-option v-for="(value,index) in toSelectGoods[index]" :key="index" :label="value.goodsName" :value="value.id"/>
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-input v-model="item.goodsCount" clearable placeholder="商品数量"></el-input>
          </el-col>
          <el-col :span="2" align="center"><span>-</span>
          </el-col>
          <el-col :span="6">
            <el-button type="primary" @click="addGoods">添加</el-button>
            <el-button type="danger" @click="deleteGoods(index)">删除</el-button>
          </el-col>
        </div>
      </el-form-item>
      <el-form-item align="right" label="" prop="">
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {add, updateById} from '@/api/common'
import {getFoodsList} from "@/api/jcx/goods";

export default {
  name: "createOrder",
  props: {
    id: undefined,
    open: {},
    successFun: {},
    orderStatusOptionsMap: {}
  },
  computed: {},
  components: {},
  data() {
    return {
      toSelectGoods: {},
      // 表单参数
      form: {
        orderRemark: undefined,
        goodsList: [],
        orderStatus: "10",
        goodsName: undefined,
        goodsId: undefined,
      },
      // 表单校验
      rules: {}
    }
        ;
  },
  created() {
    document["pagePath"] = "/jcx/order";
  },
  mounted() {
    this.$nextTick(() => {
      this.form = {
        goodsList: [],
        orderStatus: "10",
        goodsName: undefined,
        goodsId: undefined,
      }
      this.addGoods();
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
    changeGoods(val, index) {
      return getFoodsList({pageNum: 1, pageSize: 10, data: {goodsName: val}})
      .then(response => {
        this.toSelectGoods[index] = []
        response.dataList.forEach(item => {
          this.toSelectGoods[index].push(item)
        })
        this.$forceUpdate()
      })
    }
    , addGoods() {
      this.form.goodsList.push({goodsCount: 1})
      this.toSelectGoods[this.form.goodsList.length - 1] = []
    }, deleteGoods(index) {
      if (this.form.goodsList.length !== 1) {
        this.form.goodsList.splice(index, 1)
      } else {
        this.$modal.msgError("至少保留一条数据")
      }
    }
  }
}
</script>
<style>
.goods-item {
  margin-bottom: 10px;
  display: flex;
}
</style>
