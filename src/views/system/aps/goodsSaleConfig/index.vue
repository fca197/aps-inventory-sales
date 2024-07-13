<template>
  <div class="app-container">


    <el-form ref="queryForm" :inline="true" label-width="100px" size="small">
      <el-form-item label="请选择商品" prop="goodsId">
        <el-select v-model="form.goodsId">
          <el-option v-for="item in goodsList" :key="item.id" :label="item.goodsName" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <right-toolbar :showSearch.sync="showSearch" export-table="dataTable" export-table-file-name="商品销售配置" @queryTable="getList"></right-toolbar>

    </el-form>


    <el-table id="dataTable" :data="apsSaleConfigList" :default-expand-all="true" :tree-props="{children: 'children', hasChildren: 'hasChildren'}" row-key="id" stripe>
      <!--      <el-table-column label="全选" type="selection" prop="id"/>-->
      <el-table-column label="组编码" prop="saleCode">
        <template slot-scope="scope">
          <span v-if="scope.row.isValue !== 1">{{ scope.row.saleCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="值编码" prop="saleCode">
        <template slot-scope="scope">
          <span v-if="scope.row.isValue === 1">{{ scope.row.saleCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="组名称" prop="saleName">
        <template slot-scope="scope">
          <span v-if="scope.row.isValue !== 1">{{ scope.row.saleName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="值名称" prop="saleName">
        <template slot-scope="scope">
          <span v-if="scope.row.isValue === 1">{{ scope.row.saleName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="组/值">
        <template slot-scope="scope">
          <span v-if="scope.row.isValue === 1">值</span>
          <span v-else>组</span>
        </template>
      </el-table-column>
      <el-table-column label="本商品配置">
        <template slot-scope="scope">
          <span v-if="scope.row.isValue === 1">
            <el-checkbox v-model="goodsSaleConfig[scope.row.id]" @change="value=>{changeSaleSelect(scope.row.id,value)}"></el-checkbox>
            <span style="margin: 0 10px"></span>    <span v-if="goodsSaleConfig[scope.row.id]">是</span><span v-else>否</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="参与预测">
        <template slot-scope="scope">
          <span v-if="scope.row.isValue === 1">
           <el-checkbox v-model="goodsSaleForecastConfig[scope.row.id]" :value="scope.row.id" @change="value=>{changeForecastSelect(scope.row.id,value)}"></el-checkbox>
           <span style="margin: 0 10px"></span>    <span v-if="goodsSaleForecastConfig[scope.row.id]">是</span><span v-else>否</span>
          </span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import {deleteByIdList, queryPageList} from '@/api/common'
import {getGoodsList} from '@/api/aps/goods'
import {getSaleConfigList} from "@/api/aps/saleConfig";
import {updateForecast, updateSaleConfig} from "@/api/aps/goodsSaleConfig";

export default {
  name: "index",
  data() {
    return {
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
      getGoodsList({}).then(t => {
        this.goodsList = t.data.dataList
        this.form.goodsId = this.goodsList[0].id;
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
    }
  }
}
</script>


<style lang="scss" scoped>

</style>
