<template>
  <div :style="style" class="top-right-btn">

    <el-row>
      <el-button v-if="exportTable" icon="el-icon-download" size="mini" @click="exportExcel"></el-button>
      <el-tooltip v-if="search" :content="showSearch ? '隐藏搜索' : '显示搜索'" class="item" effect="dark" placement="top">
        <el-button v-if="showSearch" circle icon="el-icon-caret-top" size="mini" @click="toggleSearch()"/>
        <el-button v-else circle icon="el-icon-caret-bottom" size="mini" @click="toggleSearch()"/>
      </el-tooltip>
      <el-tooltip  v-if="refreshShow" class="item" content="刷新" effect="dark" placement="top">
        <el-button circle icon="el-icon-refresh" size="mini" @click="refresh()"/>
      </el-tooltip>
      <el-tooltip v-if="columns" class="item" content="显隐列" effect="dark" placement="top">
        <el-button circle icon="el-icon-menu" size="mini" @click="showColumn()"/>
      </el-tooltip>
    </el-row>
    <el-dialog :title="title" :visible.sync="open" append-to-body>
      <el-transfer
          v-model="value"
          :data="columns"
          :titles="['显示', '隐藏']"
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
    refreshShow:{
      default:true
    },
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
      let h = [];
      try {
        let headerTdList = em.children[1].children[0].children[1].children[0].children;
        for (let headerTdListElement of headerTdList) {
          h.push(headerTdListElement.innerText)
        }
      } catch (e) {
        console.error(e)
      }
      let data = [h];
      let dataTr;
      try {
        dataTr = em.children[2].children[0].children[1].children;
        for (let dataTrElement of dataTr) {
          let t = [];
          data.push(t);
          for (let i = 0; i < dataTrElement.children.length; i++) {
            t.push(dataTrElement.children[i].innerText);
          }
        }
      } catch (e) {
        console.error(e)
      }
      try {
        dataTr = em.children[3].children[0].children[1].children;
        for (let dataTrElement of dataTr) {
          let t = [];
          data.push(t);
          for (let i = 0; i < dataTrElement.children.length; i++) {
            t.push(dataTrElement.children[i].innerText);
          }
        }
      } catch (e) {
        // console.error(e)
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
