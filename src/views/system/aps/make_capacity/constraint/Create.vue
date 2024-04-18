<template>
  <div>
    <el-col style="margin-bottom: 10px" :span="24" v-if="!isChild">
      <el-button type="primary" size="mini" @click="addRowConstraint">
        <i class="el-icon-plus"></i>
      </el-button>
    </el-col>
    <el-col :span="24" v-for="(item,ooo) in rowConstraintList" :key="ooo" style="border-bottom: #00afff 1px solid ;margin-bottom: 20px; margin-top: 10px">
      <el-col :span="2" width="60px"> {{ '约束-' + (ooo + 1) }}
        <el-button type="danger" v-if="ooo!==0" size="mini" @click="deleteRowConstraint(ooo)">  <i class="el-icon-delete"></i></el-button>
      </el-col>
      <el-col :span="22" style="padding-left: 10px ;border-left: #a15050 1px solid">
        <el-col :span="24" v-for="(f,index) in item.filterList" :key="index">
          <el-col :span="24" style="padding-bottom: 10px">
            <el-select v-model="f.fieldName" @change="changeField(f)">
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
              <i class="el-icon-plus"></i>
            </el-button>
            <el-button type="primary" size="mini" @click="addFilter(item,ooo)"> <i class="el-icon-plus"></i></el-button>
          </el-col>
          <el-col :span="2">
            过滤值:
          </el-col>
          <el-col :span="22" style="padding-bottom: 10px">
            <div v-if="f.filterFieldType==='DATE'">
              <div v-if="f.operator==='BETWEEN'">
                <el-date-picker type="daterange" v-model="f.valueList" placeholder="请输入过滤值" clearable/>
              </div>
              <div v-else>
                <el-date-picker type="date" v-model="f.valueList" placeholder="请输入过滤值" clearable/>
              </div>
            </div>
            <div v-else>
              <div v-if="f.operator==='BETWEEN'">
                <el-input style="width: 30%" v-model="f.valueList[0]" placeholder="请输入过滤值" clearable/>
                至
                <el-input style="width: 30%" v-model="f.valueList[1]" placeholder="请输入过滤值" clearable/>
              </div>
              <div v-else>
                <el-input style="width: 90%" v-model="f.valueList[0]" placeholder="请输入过滤值" clearable/>
              </div>
            </div>
          </el-col>


        </el-col>

        <el-col :span="24" style="padding-bottom: 10px">
          <el-col :span="3">
            排序:
            <el-button type="primary" size="mini" @click="addOrderBy(item)"> <i class="el-icon-plus"></i></el-button>
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
              <el-button type="danger" size="mini" @click="deleteOrderBy(item,i)"> <i class="el-icon-delete"></i></el-button>
            </div>
          </el-col>
        </el-col>

        <el-col :span="24" style="padding-bottom: 10px">
          <el-col :span="6">
            子约束:
            <el-button type="primary" size="mini" @click="addChild(item)"> <i class="el-icon-plus"></i></el-button>
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

      filterFieldMap: {},
    }
  },
  created() {
    // console.info("rowConstraintList: ", this.isChild, JSON.stringify(this.rowConstraintList))
    if (this.isChild && this.rowConstraintList && this.rowConstraintList.length === 0) {
      return
    }
    // if (this.rowConstraintList.length === 0) {
    //   this.addRowConstraint();
    // }
    // this.rowConstraintList.forEach(t => {
    //   t.filterList.forEach(item => {
    //     item.id = randomNum(38);
    //   })
    //   t.id = randomNum(38);
    // })
    // console.info("rowConstraintList: ", JSON.stringify(this.rowConstraintList))

    this.initSetOperatorMap(this.rowConstraintList);
  },
  methods: {

    initSetOperatorMap(list) {
      if (list) {
        list.forEach(t => {
          if (t.orderBy === undefined) {
            t.orderBy = [];
          }
          t.filterList.forEach(t2 => {
            try {
              let t3 = this.constrainedFieldList.filter(t => t.fieldName === t2.fieldName)[0];
              // console.info("t3: ", JSON.stringify(t3))
              this.operatorMap[t2.id] = t3.operator;
            } catch (e) {
              this.operatorMap[t2.id] = this.constrainedFieldList[0].operator;
            }
          })
          this.initSetOperatorMap(t.children);
        })
      }
      // console.info(JSON.stringify(this.operatorMap))
    },
    changeOperator(f) {
      f.valueList = [];
    },
    changeField(it) {
      let t = this.constrainedFieldList.filter(t => t.fieldName === it.fieldName)[0];
      it.fieldName = t.fieldName;
      it.showName = t.showName;
      it.filterFieldType = t.valueType;
      this.operatorMap[it.id] = t.operator;
      console.info("changeField: ", JSON.stringify(it))
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
        items.id = randomNum(38);
        items.filterList.forEach(t => {
          t.id = randomNum(38);
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
    deleteRowConstraint(index){
      this.rowConstraintList.splice(index, 1);
    }
  }
}
</script>


<style scoped lang="scss">

</style>
