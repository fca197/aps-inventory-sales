<template>
  <div class="navbar">
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar"/>

    <breadcrumb v-if="!topNav" id="breadcrumb-container" class="breadcrumb-container"/>
    <top-nav v-if="topNav" id="topmenu-container" class="topmenu-container"/>

    <div class="right-menu">
      <template v-if="device!=='mobile'" hidden="hidden">


        <el-button class="right-menu-item hover-effect" type="text">
          <span @click="showHelpDrawerShow">
            <el-tooltip class="item" effect="dark" content="帮助中心" placement="top">
               <svg-icon icon-class="question-thin"></svg-icon>
              </el-tooltip>
          </span>
        </el-button>
        <el-button class="right-menu-item hover-effect" type="text">
          <span @click="showMsgDrawerShow">
             <el-tooltip class="item" effect="dark" content="消息中心" placement="top">
            <i class="el-icon-bell" title="消息中心"/>
               <span v-if="messageCount>0" class=" msg-count-tips">{{ messageCount }}</span></el-tooltip>
          </span>
        </el-button>
        <!--        <search id="header-search"   class="right-menu-item"/>-->
        <el-tooltip class="item" effect="dark" content="全屏" placement="top">
          <screenfull id="screenfull" class="right-menu-item hover-effect"/>
        </el-tooltip>
        <el-tooltip content="布局大小" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect"/>
        </el-tooltip>
      </template>

      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatar" :title="userName" class="user-avatar">
          <i class="el-icon-caret-bottom"/>
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/user/profile">
            <el-dropdown-item>个人中心</el-dropdown-item>
          </router-link>
          <el-dropdown-item @click.native="setting = true">
            <span>布局设置</span>
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">
            <span>退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-drawer :key="toStr(messageList)" :visible.sync="showDrawerMsg" direction="rtl" title="消息中心">
      <user-message :now-time="nowTime" :query-un-read-count-fun="queryUnReadCountFun"></user-message>
    </el-drawer>
    <el-drawer :visible.sync="showHelpDrawer" direction="rtl" title="帮助中心">
      <div style="width: 90%;margin-left: 5%">
        <el-collapse accordion>
          <el-collapse-item v-for="(h ,i) in helpDataList" :title=" (i+1)+') '+ h.title" :key="i">
           <div v-html="h.content"></div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import TopNav from '@/components/TopNav'
import Hamburger from '@/components/Hamburger'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import Search from '@/components/HeaderSearch'
import {queryUnReadCount} from "@/api/message";
import DynamicTable from "@/components/DynamicTable/index.vue";
import {toString} from "@/api/common";
import UserMessage from "@/layout/components/UserMessage.vue";
import Cookies from "js-cookie";
import watermark from "watermark-dom";
import helpData from '@/api/help'

export default {
  data() {
    return {
      nowTime: "123",
      visible: false,
      messageList: [],
      helpDataList: [],
      messageListTotal: 0,
      messageListPageNum: 0,
      messageListPageSize: 10,
      showDrawerMsg: false,
      showHelpDrawer: false,
      showDrawerMsgIndex: '',
      messageCount: 0
    }
  },
  components: {
    Breadcrumb,
    TopNav,
    Hamburger,
    Screenfull,
    SizeSelect,
    Search,
    DynamicTable,
    UserMessage
  },
  computed: {

    ...mapGetters([
      'sidebar',
      'avatar',
      'device',
      'userName'
    ]),
    setting: {
      get() {
        return this.$store.state.settings.showSettings
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'showSettings',
          value: val
        })
      }
    },
    topNav: {
      get() {
        return this.$store.state.settings.topNav
      }
    }
  },
  created() {
    this.queryUnReadCountFun()
    this.addMark();
  },
  updated() {
  },
  methods: {
    showMsgDrawerShow() {
      this.showDrawerMsg = true
      this.nowTime = 'a--' + new Date().getTime()
    },
    toStr() {
      return toString(this.messageList)
    },
    queryUnReadCountFun() {
      return queryUnReadCount().then(res => {
        this.messageCount = res
        this.showDrawerMsgIndex = "a_" + new Date().getTime()
      });
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      this.$confirm('确定注销并退出系统吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('LogOut').then(() => {
          location.href = '/';
        })
      }).catch(() => {
      });
    }
    , addMark() {
      let username = Cookies.get("username");
      if (username) {
        let now = new Date();
        let year = now.getFullYear();
        let month = now.getMonth() + 1;
        let day = now.getDate();
        month = month < 10 ? '0' + month : month;
        day = day < 10 ? '0' + day : day;
        let date = year + '-' + month + '-' + day;
        watermark.load({
          watermark_txt: username + ',' + date,
          // 水印起始位置x轴坐标
          watermark_x: 100,
          // 水印起始位置Y轴坐标
          watermark_y: 0,
          // 水印行数
          watermark_rows: 5,
          // 水印列数
          watermark_cols: 10,
          // 水印x轴间隔
          watermark_x_space: 0,
          // 水印y轴间隔
          watermark_y_space: 0,
          // 水印字体颜色
          watermark_color: '#ddd',
          // 水印透明度
          watermark_alpha: 0.4,
          // 水印字体大小
          watermark_fontsize: '13px',
          // 水印字体
          watermark_font: '微软雅黑',
          // 水印宽度
          watermark_width: 200,
          // 水印长度
          watermark_height: 100,
          // 水印倾斜度数
          watermark_angle: 20
        })
      }
    },
    showHelpDrawerShow() {
      var path = this.$route.path;
      this.helpDataList = helpData[path];
      this.showHelpDrawer = true
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, .08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .topmenu-container {
    position: absolute;
    left: 50px;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}

.msg-count-tips {
  margin: -20px 0 0 0;
  display: table-caption;
  background-color: red;
  color: red;
  border-radius: 50%;
  font-size: 5px;
  width: 7px;
  height: 7px;
}

.footer {
  margin: 20px 30px 0 0;
  text-align: right;
}

.footer .count {
  color: #f4516c;
  font-size: 14px;
}
</style>
