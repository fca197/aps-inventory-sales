<template>
  <div class="app-container">


    <el-form ref="queryForm" :inline="true" label-width="100px" size="small">
      <el-form-item label="请选择商品" prop="goodsId">
        <el-select v-model="form.goodsId">
          <el-option v-for="item in goodsList" :key="item.id" :label="item.goodsName" :value="item.id"></el-option>
        </el-select>
      </el-form-item>

      <el-button type="primary" size="mini" @click="saveConfig">保存配置</el-button>
      <!--      <right-toolbar :showSearch.sync="showSearch" export-table="dataTable" export-table-file-name="商品销售配置" @queryTable="getList"></right-toolbar>-->

    </el-form>


    <el-table id="dataTable" :data="apsSaleConfigList" :default-expand-all="true" :tree-props="{children: 'children', hasChildren: 'hasChildren'}" row-key="id" stripe>
      <!--      <el-table-column label="全选" type="selection" prop="id"/>-->
      <!--      <el-table-column label="序号" prop="id" width="170px"/>-->
      <el-table-column label="组编码" prop="saleCode" width="170px">
        <template slot-scope="scope">
          <span v-if="scope.row.isValue !== 1">{{ scope.row.saleCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="组名称" prop="saleName" width="170px">
        <template slot-scope="scope">
          <span v-if="scope.row.isValue !== 1">{{ scope.row.saleName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="值编码" prop="saleCode" width="170px">
        <template slot-scope="scope">
          <span v-if="scope.row.isValue === 1">{{ scope.row.saleCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="值名称" prop="saleName" width="170px">
        <template slot-scope="scope">
          <span v-if="scope.row.isValue === 1">{{ scope.row.saleName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="工程特征组" width="170px">
        <template slot-scope="scope">
          <span v-if="scope.row.isValue !== 1">
            <el-select v-model="scope.row.projectId" @change="value=>selectProject(scope.row.id, value)">
              <el-option v-for="item in apsProjectConfigList" :key="item.id" :label="item.saleName" :value="item.id"></el-option>
            </el-select>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="工程特征值">
        <template slot-scope="scope">
          <span v-if="scope.row.isValue === 1">
            <el-col :span="12" v-for="(plt ,index ) in goodsProjectMap[scope.row.parentId+'-'+scope.row.id]" :key="index">
              <el-col :span="24">
                   <el-col :span="12">
                   <el-input v-model="plt.saleConfigId" disabled style="display: none"/>
                   <el-input v-model="plt.projectConfigId" disabled style="display: none"/>
                   <el-input v-model="plt.projectConfigName" disabled/>
                 </el-col>
                <el-col :span="12">
                  <el-input v-model="plt.quantity"/>
                </el-col>
              </el-col>
            </el-col>
            <!--            <el-select v-model="scope.row."> </el-select>-->
          </span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import {deleteByIdList, post, queryPageList, queryUrlPageList} from '@/api/common'
import {getGoodsList} from '@/api/aps/goods'
import {getSaleConfigList} from "@/api/aps/saleConfig";
import {updateForecast, updateSaleConfig} from "@/api/aps/goodsSaleConfig";

export default {
  name: "index",
  data() {
    return {
      items: {
        quantity: 0
      },
      goodsList: [],
      goodsSaleConfig: {},
      goodsSaleForecastConfig: {},
      parentData: null,
      title: "",
      open: false,
      multiple: false,
      form: {
        goodsId: "",
      },
      initForm: {
        goodsId: "",
      },
      showSearch: false,
      id: 1,
      rules: [],
      apsSaleConfigList: [],
      apsProjectConfigList: [],
      saleProjectMap: {
        "1": []
      },
      goodsProjectMap: []
    }
  },
  created() {

    document["pagePath"] = "/apsGoodsSaleItem";
    getSaleConfigList({queryPage:false})
    .then(t => {
      this.apsSaleConfigList = t.data.dataList;
    }).then(() => {
      this.apsSaleConfigList.forEach(t => {
        t.children.forEach(t1 => {
          this.goodsSaleConfig[t1.id] = false
        })
        this.goodsSaleConfig[t.id] = false
      })
    }).then(() => {
      queryUrlPageList("/apsProjectConfig", {queryPage: false}).then(t => {
        // console.log("apsProjectConfig",t)
        this.apsProjectConfigList = t.data.dataList

      })
      getGoodsList({}).then(t => {
        this.goodsList = t.data.dataList
        this.form.goodsId = this.goodsList[0].id;
        this.form.goods = this.goodsList[0];
      })
    })
  }
  ,
  watch: {
    'form.goodsId': function (val) {
      this.getList();
    }
  },
  methods: {
    getList() {
      queryPageList({data: {goodsId: this.form.goodsId}, queryPage:false})
      .then(t => {
        let d = {}
        let f = {}
        t.data.dataList.forEach(g => {
          d["" + g.saleConfigId] = true;
          f ["" + g.saleConfigId] = g.useForecast === 1 ? true : false;
        })
        this.goodsSaleConfig = d;
        this.goodsSaleForecastConfig = f;
      }).then(r => {
        post("/apsGoodsSaleProjectConfig/queryPageList", {queryPage: false, data: {goodsId: this.form.goodsId}}, false).then(res => {

          this.goodsProjectMap = []
          res.data.dataList.forEach(tt => {
            let key = tt.saleConfigParentId + "-" + tt.saleConfigId;
            let lt = this.goodsProjectMap[key] || [];
            let parse = {
              quantity: tt.quantity,
              factoryId: tt.factoryId,
              saleConfigId: tt.saleConfigId,
              saleConfigParentId: tt.saleConfigParentId,
              saleConfigName: tt.saleConfigName,
              goodsId: tt.goodsId,
              projectConfigId: tt.projectConfigId,
              projectConfigParentId: tt.projectConfigParentId,
              projectConfigName: tt.projectConfigName
            };
            lt.push(parse);

            this.$set(this.goodsProjectMap, key, lt)
            for (let scc in this.apsSaleConfigList) {
              if (this.apsSaleConfigList[scc].id === tt.saleConfigParentId) {
                this.$set(this.apsSaleConfigList[scc], "projectId", tt.projectConfigParentId)
                break;
              }
            }
          })
        }).then(() => {
          console.log("goodsProjectMap", this.goodsProjectMap)
          this.$forceUpdate();
        });

      })
    },
    handleAdd(row) {

    },

    resetForm() {

    },
    cancel() {
      this.resetForm();
      this.open = false;
    }, submitForm() {

    }, handleDelete(row) {
      const idList = row.id ? [row.id] : this.ids
      this.$modal.confirm('是否确认删序号为 <span style="color:red">' + idList + '</span> 的数据项？', "删除提示").then(function () {
        let req = {
          idList: idList
        }
        return deleteByIdList(req);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      });
    },
    changeSaleSelect(id, val) {
      updateSaleConfig({goodsId: this.form.goodsId, saleConfigId: id, isAdd: val}).then(t => {
        this.$modal.msgSuccess("修改成功")
        this.getList();
      })
    },
    changeForecastSelect(id, val) {
      console.log('changeForecastSelect', id, val, this.goodsSaleConfig)
      if (val === true && this.goodsSaleConfig[id] === false) {
        $.modal.msgError("请先选择销售配置")
        return;
      }
      updateForecast({goodsId: this.form.goodsId, saleConfigId: id, useForecast: val ? 1 : 0}).then(t => {
        this.$modal.msgSuccess("修改成功")
        this.getList();
      })
    },
    selectProject(saleId, projectId) {

      let lt = this.apsProjectConfigList.filter(t => t.id === projectId)[0].children || [];
      if (lt.length === 0) {
        $.modal.msgError("请先添加工程特征值")
        return;
      }
      let saleConfigList = this.apsSaleConfigList.filter(t => t.id === saleId)[0].children || []

      saleConfigList.forEach(sc => {
        let ltt = []
        lt.forEach(t => {
          let parse = {
            quantity: 0,
            factoryId: this.form.goods.factoryId,
            saleConfigId: sc.id,
            saleConfigParentId: sc.parentId,
            saleConfigName: sc.saleName,
            goodsId: this.form.goodsId,
            projectConfigId: t.id,
            projectConfigParentId: t.parentId,
            projectConfigName: t.saleName
          };
          ltt.push(parse);
        })
        // this.goodsProjectMap[saleId + '-' + sc.id] = ltt;
        this.$set(this.goodsProjectMap, saleId + '-' + sc.id, ltt)

      })

      // console.log("goodsSaleConfig", saleId, projectId, this.goodsProjectMap)
    },
    saveConfig() {
      let f = [];
      for (let key in this.goodsProjectMap) {
        let l = this.goodsProjectMap[key];
        l.forEach(t => {
          f.push(t)
        })
      }

      if (f.length === 0) {
        $.modal.msgError("请先选择工程特征值")
        return;
      }
      post("/apsGoodsSaleProjectConfig/insertBatch", f);
    },
    onInput() {
      this.$forceUpdate();
    }
  }
}
</script>


<style lang="scss" scoped>

</style>
