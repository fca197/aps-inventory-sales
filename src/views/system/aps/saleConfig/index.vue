<template>
  <div class="app-container">
    <p>销售组</p>
    <el-button type="text" @click="() => append(null)">Append</el-button>
    <el-table :default-expand-all="true" :data="saleConfigList" row-key="id" :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
      <el-table-column label="id" prop="id"/>
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
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button v-if="scope.row.isValue === 0" type="text" plain icon="el-icon-delete" size="mini" @click=""></el-button>
          <el-button type="text" plain icon="el-icon-plus" size="mini" @click=""></el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import {queryPageList} from '@/api/common'

export default {
  name: "index",
  data() {
    return {
      id: 1,
      saleConfigList: []
    }
  },
  created() {
    document["pagePath"] = "/apsSaleConfig";
    this.getList()
  }
  ,
  methods: {
    getList() {
      return queryPageList({pageNum: 1, pageSize: 999})
      .then(t => {
        let dL = t.data.dataList;
        let dL2 = dL.sort((a, b) => {
          return a.saleCode.localeCompare(b.saleCode)
        })
        console.log("dL", dL2);
        let ret = [];
        ret = dL.filter(t => t.parentId === "0");
        ret.forEach(t => {
          let c = dL.filter(t1 => t1.parentId === t.id);
          t.children = c;
        })
        this.saleConfigList = ret
        console.log(this.saleConfigList);
      })
    },
    renderContent(h, {node, data, store}) {
      return (
          <span class="custom-tree-node">
            <span>{node.saleCode}/ {node.saleName} {data}</span>
            <span>
              <el-button size="mini" type="text" on-click={() => this.append(data)}>Append</el-button>
              <el-button size="mini" type="text" on-click={() => this.remove(node, data)}>Delete</el-button>
            </span>
          </span>);
    }
  }
}
</script>


<style scoped lang="scss">

</style>
