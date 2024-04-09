<template>
  <div :key="nowTime">
    <el-col :offset="19" :span="5">
      <el-button :size="'mini'" @click="messageMaskRead">全部已读</el-button>
      <div style="height: 10px"></div>
    </el-col>
    <el-col>
      <el-collapse accordion>
        <el-collapse-item v-for="(item,index) in messageList" :id="'md_'+item.id" :key="'a'+index" :name="'name_'+index" :title="item.messageTitle" width="100%">
          <div class="header-div"><span class="header-title ">创建时间: </span> <span class="header-value">{{ item.createTime }}</span></div>
          <div class="header-div"><span class="header-title ">消息内容: </span> <span class="header-value">{{ item.messageContext }}</span></div>
          <div style="height: 10px"></div>
          <dynamic-table v-if="item.hasJsonData" :table-data="item.messageJsonDataObject"/>
        </el-collapse-item>
      </el-collapse>
      <pagination v-show="messageList.length>0" :limit.sync="messageListPageSize" :page.sync="messageListPageNum" :total="messageListTotal" @pagination="showMsgDrawer"/>
    </el-col>
  </div>
</template>

<script>
import DynamicTable from "@/components/DynamicTable/index.vue";

import {messageMaskRead, msgMessageReadQueryPageList} from "@/api/message";

export default {
  name: "Message",
  components: {DynamicTable},
  props: {nowTime: String, queryUnReadCountFun: {}},
  data() {
    return {
      messageList: [],
      messageListTotal: 0,
      messageListPageNum: 0,
      messageListPageSize: 10,
    }
  },
  watch: {
    nowTime(val, oldVal) {
      this.showMsgDrawer()
    }
  },
  created() {
    // this.showMsgDrawer()
  },
  mounted() {
    this.showMsgDrawer()
  },
  methods: {
    messageMaskRead() {
      return messageMaskRead().then(r => {
        this.showMsgDrawer()
      }).then(() => {
        this.queryUnReadCountFun();
      });
    },
    showMsgDrawer() {
      return msgMessageReadQueryPageList({pageNum: this.messageListPageNum, pageSize: this.messageListPageSize})
      .then(r => {
        this.messageList = r.dataList
        this.messageList.forEach(item => {
          if (item.messageJsonData) {
            item.hasJsonData = true;
            item.messageJsonDataObject = JSON.parse(item.messageJsonData)
          }
        })
        this.messageListTotal = parseInt(r.total)
        // console.info(this.messageList)
      })
      .then(() => {
        this.messageList.forEach(ttt => {
          var children = document.getElementById('md_' + ttt.id).children[0].children[0];
          children.innerHTML = '<span style="width:15px"> </span>' + children.innerText
          .replaceAll("*", "").trimEnd() + (!ttt.isRead ? "&nbsp;&nbsp;<span style='color:red'>*</span>" : "");
        });
      })
      .catch(e => {
        console.error(e)
      })
      .then(() => {
        this.$forceUpdate()
      })
    },
    showMsgDrawerShow() {
      this.showDrawerMsg = true
      this.showMsgDrawer();
    }
  }
}
</script>


<style lang="scss" scoped>

</style>
