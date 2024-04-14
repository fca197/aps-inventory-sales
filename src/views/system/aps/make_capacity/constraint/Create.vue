<template>
  <div>
    <table width="100%" v-for="(item,index) in constraintList" :key="index" cellpadding="0" cellspacing="0" style="border-bottom: #00afff 1px solid ;padding-bottom: 20px;">
      <tr v-for="(it,i) in item.filterList" :key="i">
        <td width="60px" style="border-right: #a15050 1px solid"> {{ '约束' + (index + 1) }}</td>
        <td style="padding: 10px">
          <el-select v-model="it.filterFieldType" :placeholder="it.name" clearable>
            <el-option v-for="(itt,i) in  filterFieldMap " :key="i" :label="itt.name" :value="i">{{ itt.name }}</el-option>
          </el-select>
          <el-select v-model="it.fieldName" :placeholder="it.name" clearable v-if="it.filterFieldType" @change="value=>selectFieldName(it,index,value)">
            <el-option v-for="(itt,i) in  filterFieldMap[it.filterFieldType].values " :key="i" :label="itt.showName" :value="itt.fieldName"></el-option>
          </el-select>
          <el-select v-model="it.operator" @change="value=>changeOperator(it,index,value)">
            <el-option v-for="(itt,i) in  operatorMap[index] " :key="i" :label="itt.name" :value="itt.value">{{ itt.name }}</el-option>
          </el-select>
          <el-button type="danger" v-if=" deleteFirst|| index!==0" icon="el-icon-delete" size="mini" @click="deleteFilter(item,index)"></el-button>
          <el-button type="primary" icon="el-icon-plus" size="mini" @click="addFilter(item,index)"></el-button>
          <div style="height: 10px"></div>
          <div v-if="operatorFieldMap[index]==='DATE'">
            过滤值:
            <el-date-picker v-if="it.operator==='BETWEEN'"
                            v-model="it.valueList" type="daterange" placeholder="选择日期" value-format="yyyy-MM-dd"/>
            <el-date-picker v-else
                            v-model="it.valueList[0]" type="date" placeholder="选择日期" value-format="yyyy-MM-dd"/>
          </div>
          <div v-else>
            过滤值:
            <el-input style="width: 90%" v-model="it.valueList[0]" placeholder="请输入过滤值" clearable/>
          </div>
          <div style="height: 10px"></div>
          排序:
          <el-button type="primary" icon="el-icon-plus" size="mini" @click="addOrderBy(item)"></el-button>
          <div v-for="(orderBy,ind) in item.orderBy" :key="ind">
            <el-select v-model="orderBy.orderFieldName">
              <el-option-group v-for="(ittr,i) in  filterFieldMap" :key="i+11" :value="ittr.showName" :label="ittr.name">
                <el-option v-for="(itt,i) in  ittr.values " :key="i+11" :label="itt.showName" :value="itt.fieldName"></el-option>
              </el-option-group>
            </el-select>
            <el-select v-model="orderBy.orderBy">
              <el-option label="正序" value="ASC"></el-option>
              <el-option label="倒序" value="DSC"></el-option>
            </el-select>
            <el-button v-if="item.orderBy.length>1" type="danger" icon="el-icon-delete" size="mini" @click="deleteOrderBy(item,ind)"></el-button>

          </div>

          子约束:
          <el-button type="primary" icon="el-icon-plus" size="mini" @click="addSecondFilter(item)"></el-button>
          <div v-if="item.children.length>0">
            <create :deleteFirst="true" :constraint-list="item.children"></create>
          </div>


        </td>
      </tr>
    </table>
  </div>
</template>

<script>

import Create from './Create.vue'

export default {
  name: "Create",

  props: {
    deleteFirst: {
      type: Boolean,
      default: false
    },
    constraintList: {
      type: Array
    },
  },
  components: {
    // CreateTmp
    Create
  },
  data() {
    return {

      constObj: {
        "filterList": [{
          "filterFieldType": "",
          "fieldName": "",
          "operator": "",
          "valueList": []
        }],
        children: [],
        "orderBy": []
      },
      operatorMap: {},
      operatorFieldMap: {},
      filterFieldMap: {
        GOODS_SALE: {
          name: "销售值",
          values: [
            {
              fieldName: "createTime",
              showName: "销售创建时间",
              operator: [{name: "等于", value: "EQ"}, {name: "不等于", value: "NE"}, {name: "大于", value: "GT"}
                , {name: "大于等于", value: "EGT"}, {name: "小于", value: "LT"}, {name: "小于等于", value: "ELT}"},
                // {name: "模糊匹配", value: "LIKE"}, {name: "左模糊匹配", value: "LEFT_LIKE"},
                // {name: "右模糊匹配", value: "RIGHT_LIKE"},
                {name: "范围", value: "BETWEEN"},
                {name: "空", value: "NULL"}, {name: "非空", value: "NOT_NULL"},
              ],
              valueType: "DATE"
            }]
        },
        ORDER: {
          name: "订单信息",
          values: [
            {
              fieldName: "createTime",
              showName: "创建时间",
              operator: [{name: "等于", value: "EQ"}, {name: "不等于", value: "NE"}, {name: "大于", value: "GT"}
                , {name: "大于等于", value: "EGT"}, {name: "小于", value: "LT"}, {name: "小于等于", value: "ELT}"},
                {name: "范围", value: "BETWEEN"},
                {name: "空", value: "NULL"}, {name: "非空", value: "NOT_NULL"},
              ],
              valueType: "DATE"
            }, {
              fieldName: "orderTotalPrice",
              showName: "订单总额",
              operator: [{name: "等于", value: "EQ"}, {name: "不等于", value: "NE"}, {name: "大于", value: "GT"}
                , {name: "大于等于", value: "EGT"}, {name: "小于", value: "LT"}, {name: "小于等于", value: "ELT}"},
                // {name: "模糊匹配", value: "LIKE"}, {name: "左模糊匹配", value: "LEFT_LIKE"},
                // {name: "右模糊匹配", value: "RIGHT_LIKE"},
                {name: "范围", value: "BETWEEN"},
                {name: "空", value: "NULL"}, {name: "非空", value: "NOT_NULL"},
              ],
              valueType: "TEXT"
            }, {
              fieldName: "updateTime",
              showName: "修改时间",
              operator: [{name: "等于", value: "EQ"}, {name: "不等于", value: "NE"}, {name: "大于", value: "GT"}
                , {name: "大于等于", value: "EGT"}, {name: "小于", value: "LT"}, {name: "小于等于", value: "ELT}"},
                // {name: "模糊匹配", value: "LIKE"}, {name: "左模糊匹配", value: "LEFT_LIKE"},
                // {name: "右模糊匹配", value: "RIGHT_LIKE"},
                {name: "范围", value: "BETWEEN"},
                {name: "空", value: "NULL"}, {name: "非空", value: "NOT_NULL"},
              ],
              valueType: "DATE"
            }, {
              fieldName: "deliveryDate",
              showName: "交付时间",
              operator: [{name: "等于", value: "EQ"}, {name: "不等于", value: "NE"}, {name: "大于", value: "GT"}
                , {name: "大于等于", value: "EGT"}, {name: "小于", value: "LT"}, {name: "小于等于", value: "ELT}"},
                // {name: "模糊匹配", value: "LIKE"}, {name: "左模糊匹配", value: "LEFT_LIKE"},
                // {name: "右模糊匹配", value: "RIGHT_LIKE"},
                {name: "范围", value: "BETWEEN"},
                {name: "空", value: "NULL"}, {name: "非空", value: "NOT_NULL"},
              ],
              valueType: "DATE"
            }, {
              fieldName: "finishPayedDatetime",
              showName: "支付时间",
              operator: [{name: "等于", value: "EQ"}, {name: "不等于", value: "NE"}, {name: "大于", value: "GT"}
                , {name: "大于等于", value: "EGT"}, {name: "小于", value: "LT"}, {name: "小于等于", value: "ELT}"},
                // {name: "模糊匹配", value: "LIKE"}, {name: "左模糊匹配", value: "LEFT_LIKE"},
                // {name: "右模糊匹配", value: "RIGHT_LIKE"},
                {name: "范围", value: "BETWEEN"},
                {name: "空", value: "NULL"}, {name: "非空", value: "NOT_NULL"},
              ],
              valueType: "DATE"
            }
          ]
        }
      },
    }
  },
  created() {
    if (this.constraintList.length === 0) {
      let d = JSON.parse(JSON.stringify(this.constObj));
      this.constraintList.push(d)
    }
    for (let i = 0; i < this.constraintList.length; i++) {
      this.operatorMap[i] = [{name: "等于", value: "EQ"}, {name: "不等于", value: "NE"}, {name: "大于", value: "GT"}
        , {name: "大于等于", value: "EGT"}, {name: "小于", value: "LT"}, {name: "小于等于", value: "ELT}"},
        {name: "模糊匹配", value: "LIKE"}, {name: "左模糊匹配", value: "LEFT_LIKE"},
        {name: "右模糊匹配", value: "RIGHT_LIKE"},
        {name: "范围", value: "BETWEEN"},
        {name: "空", value: "NULL"}, {name: "非空", value: "NOT_NULL"},
      ];
    }
  },
  methods: {

    changeOperator(filter, index, value) {
      console.info("changeOperator: ", filter, index, value)
      filter.valueList = []
    },
    selectFieldName(filter, index, value) {
      console.info("filter: ", filter, index, value)
      var filterElement = this.filterFieldMap[filter.filterFieldType].values.filter(it => it.fieldName === value)[0];
      this.operatorMap[index] = filterElement.operator;
      this.operatorFieldMap[index] = filterElement.valueType;
      filter.valueList = [];
    },
    deleteFilter(item, index) {
      this.constraintList.splice(index, 1);
    },
    addFilter(item, index) {
      let d = JSON.parse(JSON.stringify(this.constObj));
      this.constraintList.push(d);
    },
    deleteOrderBy(item, index) {
      item.orderBy.splice(index, 1);
    },
    addOrderBy(item) {
      item.orderBy.push({})
    },
    addSecondFilter(item) {
      let d = JSON.parse(JSON.stringify(this.constObj));
      if (item.children) {
        item.children.push(d);
      } else {
        item.children = [d];
      }
    }
  }
}
</script>


<style scoped lang="scss">

</style>
