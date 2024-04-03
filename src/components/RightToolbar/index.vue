<template>
  <div class="top-right-btn" :style="style">

    <el-row>
      <el-button v-if="exportTable" icon="el-icon-download" size="mini" @click="exportExcel"></el-button>
      <el-tooltip class="item" effect="dark" :content="showSearch ? '隐藏搜索' : '显示搜索'" placement="top" v-if="search">
        <el-button size="mini" circle icon="el-icon-caret-top" v-if="showSearch" @click="toggleSearch()"/>
        <el-button size="mini" circle icon="el-icon-caret-bottom" v-else @click="toggleSearch()"/>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="刷新" placement="top">
        <el-button size="mini" circle icon="el-icon-refresh" @click="refresh()"/>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="显隐列" placement="top" v-if="columns">
        <el-button size="mini" circle icon="el-icon-menu" @click="showColumn()"/>
      </el-tooltip>
    </el-row>
    <el-dialog :title="title" :visible.sync="open" append-to-body>
      <el-transfer
          :titles="['显示', '隐藏']"
          v-model="value"
          :data="columns"
          @change="dataChange"
      ></el-transfer>
    </el-dialog>
  </div>
</template>
<script>
import * as XLSX from "xlsx";

export default {
  name: "RightToolbar",
  data() {
    return {
      // 显隐数据
      value: [],
      // 弹出层标题
      title: "显示/隐藏",
      // 是否显示弹出层
      open: false,
    };
  },
  props: {
    exportTable: {},
    exportTableFileName: {},
    showSearch: {
      type: Boolean,
      default: false,
    },
    columns: {
      type: Array,
    },
    search: {
      type: Boolean,
      default: true,
    },
    gutter: {
      type: Number,
      default: 10,
    },
  },
  computed: {
    style() {
      const ret = {};
      if (this.gutter) {
        ret.marginRight = `${this.gutter / 2}px`;
      }
      return ret;
    }
  },
  created() {
    // 显隐列初始默认隐藏列
    for (let item in this.columns) {
      if (this.columns[item].visible === false) {
        this.value.push(parseInt(item));
      }
    }
  },
  methods: {
    // 搜索
    toggleSearch() {
      this.$emit("update:showSearch", !this.showSearch);
    },
    // 刷新
    refresh() {
      this.$emit("queryTable");
    },
    // 右侧列表元素变化
    dataChange(data) {
      for (let item in this.columns) {
        const key = this.columns[item].key;
        this.columns[item].visible = !data.includes(key);
      }
    },
    // 打开显隐列dialog
    showColumn() {
      this.open = true;
    },
    exportExcel() {
      console.log(this.exportTable, this.exportTableFileName);
      var em = document.getElementById(this.exportTable);

      let headerTdList = em.children[1].children[0].children[1].children[0].children;

      let h = [];
      for (let headerTdListElement of headerTdList) {
        h.push(headerTdListElement.innerText)
      }

      let dataTr = em.children[2].children[0].children[1].children;
      let data=[h];
      for (let dataTrElement of dataTr) {
        let t = [];
        data.push(t);
        for (let i = 0; i < dataTrElement.children.length; i++) {
          t.push(dataTrElement.children[i].innerText);
        }
      }

        dataTr = em.children[3].children[0].children[1].children;

      for (let dataTrElement of dataTr) {
        let t = [];
        data.push(t);
        for (let i = 0; i < dataTrElement.children.length; i++) {
          t.push(dataTrElement.children[i].innerText);
        }
      }


      console.log(h);
      const ws = XLSX.utils.aoa_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      XLSX.writeFile(wb, this.exportTableFileName + '.xlsx');

    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .el-transfer__button {
  border-radius: 50%;
  padding: 12px;
  display: block;
  margin-left: 0px;
}

::v-deep .el-transfer__button:first-child {
  margin-bottom: 10px;
}
</style>
