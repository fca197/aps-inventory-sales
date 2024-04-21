<template>
  <div>
    <el-col style="margin-bottom: 10px" :span="24" v-if="!isChild">
      <el-button type="primary" size="mini" @click="addRowConstraint">
        <i class="el-icon-plus"></i>
      </el-button>
    </el-col>
    <el-col :span="24" v-for="(item,ooo) in rowConstraintList" :key="ooo" style="border-bottom: #00afff 1px solid ;margin-bottom: 20px; margin-top: 10px">
      <el-col :span="2" width="60px"> {{ '约束-' + (ooo + 1) }}
        <el-button type="danger" v-if="ooo!==0" size="mini" @click="deleteRowConstraint(ooo)"><i class="el-icon-delete"></i></el-button>
      </el-col>
      <el-col :span="22" style="padding-left: 10px ;border-left: #a15050 1px solid">
        <el-col :span="24" v-for="(f,index) in item.filterList" :key="index">
          <el-col :span="24" style="padding-bottom: 10px;">
            <el-select v-model="f.fieldName" @change="changeField(f,index)">
              <el-option
                  v-for="(item,index3) in constrainedFieldList"
                  :key="index3"
                  :label="item.showName"
                  :value="item.fieldName">
              </el-option>
            </el-select>
            -
            <el-select v-model="f.operator">
              <el-option @change="changeOperator(f)"
                         v-for="(item,index3) in operatorMap[f.id]" :key="index3" :label="item.name" :value="item.value">
              </el-option>
            </el-select>
            <el-button type="danger" size="mini" v-if="index!==0" @click="deleteFilter(item,ooo)">
              <i class="el-icon-delete"></i>
            </el-button>
            <el-button type="primary" size="mini" @click="addFilter(item,ooo)"><i class="el-icon-plus"></i></el-button>
          </el-col>
          <el-col :span="2">
            过滤值:
          </el-col>
          <el-col :span="22" style="padding-bottom: 10px ">
            <div v-if="f.filterFieldType==='DATE'">
              <div v-if="f.operator==='BETWEEN' || f.operator==='NOT_BETWEEN'">
                <el-date-picker type="daterange" v-model="f.valueList" placeholder="请输入过滤值" clearable/>
              </div>
              <div v-else-if="f.operator!=='IS_NULL'">
                <el-date-picker type="date" v-model="f.valueList[0]" placeholder="请输入过滤值" clearable/>
              </div>

            </div>
            <div v-else-if="f.filterFieldType==='TEXT'">
              <div v-if="f.operator==='BETWEEN' || f.operator==='NOT_BETWEEN' ">
                <el-input style="width: 30%" v-model="f.valueList[0]" placeholder="请输入过滤值" clearable/>
                至
                <el-input style="width: 30%" v-model="f.valueList[1]" placeholder="请输入过滤值" clearable/>
              </div>
              <div v-else-if="f.operator!=='IS_NULL'">
                <el-input style="width: 90%" v-model="f.valueList[0]" placeholder="请输入过滤值" clearable/>
              </div>
            </div>
            <div v-else-if="f.filterFieldType==='SELECT'">
              <div v-if="f.operator==='IN'">
                <el-select v-model="f.valueList" multiple>
                  <el-option
                      v-for="(item4,index4) in operatorMapValueList[f.id]"
                      :key="index4"
                      :label="item4.valueName"
                      :value="item4.value">
                  </el-option>
                </el-select>
              </div>
              <div v-else>
                <el-select v-model="f.valueList[0]">
                  <el-option
                      v-for="(item4,index4) in operatorMapValueList[f.id]"
                      :key="index4"
                      :label="item4.valueName"
                      :value="item4.value">
                  </el-option>
                </el-select>
              </div>
            </div>
          </el-col>


        </el-col>

        <el-col :span="24" style="padding-bottom: 10px">
          <el-col :span="3">
            排序:
            <el-button type="primary" size="mini" @click="addOrderBy(item)"><i class="el-icon-plus"></i></el-button>
          </el-col>
          <el-col :span="21">
            <div v-for="(o,i) in item.orderBy" :key="i" style="padding-bottom: 10px">
              <el-select v-model="o.fieldName">
                <el-option
                    v-for="(item,index3) in constrainedFieldList"
                    :key="index3"
                    :label="item.showName"
                    :value="item.fieldName">
                </el-option>
              </el-select>
              <el-select v-model="o.orderType">
                <el-option label="升序" value="ASC"></el-option>
                <el-option label="降序" value="DSC"></el-option>
              </el-select>
              <el-button type="danger" size="mini" @click="deleteOrderBy(item,i)"><i class="el-icon-delete"></i></el-button>
            </div>
          </el-col>
        </el-col>

        <el-col :span="24" style="padding-bottom: 10px">
          <el-col :span="6">
            子约束:
            <el-button type="primary" size="mini" @click="addChild(item)"><i class="el-icon-plus"></i></el-button>
          </el-col>
          <create v-if="item.children.length>0" :deleteFirst="deleteFirst" :constrainedFieldList="constrainedFieldList" :isChild="true" :rowConstraintList="item.children"/>
        </el-col>
      </el-col>
    </el-col>
  </div>
</template>

<script>

import Create from './Create.vue'
import {randomNum} from "@/api/common";

export default {
  name: "Create",

  props: {
    deleteFirst: {
      type: Boolean,
      default: false
    },
    isChild: {
      default: false
    },
    constrainedFieldList: {},
    rowConstraintList: {
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
        orderBy: []
      },
      operatorMap: {},
      operatorMapValueList: {},

      filterFieldMap: {},
    }
  },
  created() {
    // console.info("rowConstraintList: ", this.isChild, JSON.stringify(this.rowConstraintList))
    if (this.isChild && this.rowConstraintList && this.rowConstraintList.length === 0) {
      return
    }
    this.initSetOperatorMap(this.rowConstraintList);
  },
  methods: {

    initSetOperatorMap(list) {
      if (list) {
        list.forEach(t => {
          if (t.orderBy === undefined) {
            t.orderBy = [];
          }
          // console.info("t: ", t.filterList)
          for (let i = 0; i < t.filterList.length; i++) {
            try {
              let t2 = t.filterList[i];
              // console.info("t2: ", t2)

              let f = this.constrainedFieldList.filter(t => t.fieldName === t2.fieldName)[0];
              // console.info("t2,f: ", t2,f )
              this.operatorMap[t2.id] = f.operator;
              this.operatorMapValueList[t2.id] = f.valueItemList;
            } catch (e) {
              console.info(e)
              this.operatorMap[t2.id] = this.constrainedFieldList[0].operator;
            }

          }
          this.initSetOperatorMap(t.children);
        })
      }
      // console.info(JSON.stringify(this.operatorMap))
    },
    changeOperator(f) {
      f.valueList = [];
    },
    changeField(it, index) {
      let t = this.constrainedFieldList.filter(t => t.fieldName === it.fieldName)[0];
      it.fieldName = t.fieldName;
      it.showName = t.showName;
      it.filterFieldType = t.valueType;
      this.operatorMap[it.id] = t.operator;
      this.operatorMapValueList[it.id] = t.valueItemList;
      console.info("changeField: ", JSON.stringify(it), this.operatorMapValueList)
      it.valueList = [];
    },
    addRowConstraint() {
      try {

        var items = JSON.parse(JSON.stringify(this.constObj));
        items.id = randomNum(38);
        items.filterList.forEach(t => {
          t.id = randomNum(38);
        })
        this.rowConstraintList.push(items);
      } catch (e) {
        console.info("addRowConstraint: ", e)
      }
    },
    addOrderBy(item) {
      debugger
      if (item.orderBy === undefined) {
        item.orderBy = []
      }
      item.orderBy.push({})
    },
    deleteOrderBy(item, i) {
      item.orderBy.splice(i, 1);
    }, addChild(item) {
      try {
        var items = JSON.parse(JSON.stringify(this.constObj));
        items.id = randomNum(9) + "-";
        items.filterList.forEach(t => {
          t.id = randomNum(9) + "-";
        })
        item.children.push(items)
      } catch (e) {
        console.info("addChild: ", e)
      }

    },
    deleteFilter(item, i) {
      item.filterList.splice(i, 1);
    },
    addFilter(item) {
      item.filterList.push({valueList: []})
    },
    deleteRowConstraint(index) {
      this.rowConstraintList.splice(index, 1);
    }
  }
}
</script>


<style scoped lang="scss">

</style>
