<template>
  <div class="navbar">
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar"/>

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" v-if="!topNav"/>
    <top-nav id="topmenu-container" class="topmenu-container" v-if="topNav"/>

    <div class="right-menu">
      <template v-if="device!=='mobile'" hidden="hidden">


        <el-button class="right-menu-item hover-effect" type="text" @click="goodsInventory">
          <i class="el-icon-data-analysis" title="消息中心"/>
        </el-button>


        <el-button class="right-menu-item hover-effect" type="text">
          <span @click="showMsgDrawerShow">
            <i class="el-icon-bell" title="消息中心"/>
            <span class=" msg-count-tips" v-if="messageCount>0">{{ messageCount }}</span>
          </span>
        </el-button>
        <search id="header-search" class="right-menu-item"/>
        <screenfull id="screenfull" class="right-menu-item hover-effect"/>
        <el-tooltip content="布局大小" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect"/>
        </el-tooltip>
      </template>

      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatar" class="user-avatar" :title="userName">
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
    <el-drawer title="消息中心" :key="showDrawerMsgIndex" :visible.sync="showDrawerMsg" direction="rtl">
      <el-collapse accordion>
        <el-collapse-item v-for="(item,index) in messageList" width="100%" :title="item.messageTitle" :id="'md_'+item.id" :name="'name_'+index" :key="'a'+index">
          <div class="header-div"><span class="header-title ">创建时间: </span> <span class="header-value">{{ item.createTime }}</span></div>
          <div class="header-div"><span class="header-title ">消息内容: </span> <span class="header-value">{{ item.messageContext }}</span></div>
          <div style="height: 10px"></div>
          <dynamic-table :table-data="item.messageJsonDataObject"/>
        </el-collapse-item>
      </el-collapse>
      <pagination @pagination="showMsgDrawer" v-show="messageList.length>0" :total="messageListTotal" :page.sync="messageListPageNum" :limit.sync="messageListPageSize"/>
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
import request from "@/utils/request";
import {getTenantId} from "@/utils/auth";
import {msgMessageReadQueryPageList, queryUnReadCount} from "@/api/message";
import DynamicTable from "@/components/DynamicTable/index.vue";

export default {
  data() {
    return {
      visible: false,
      messageList: [],
      messageListTotal: 0,
      messageListPageNum: 0,
      messageListPageSize: 10,
      showDrawerMsg: false,
      showDrawerMsgIndex: '',
      messageCount: 10
    }
  },
  components: {
    Breadcrumb,
    TopNav,
    Hamburger,
    Screenfull,
    SizeSelect,
    Search,
    DynamicTable
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
    queryUnReadCount().then(res => {
      this.messageCount = res
    })
  },
  methods: {
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
          location.href = '/index';
        })
      }).catch(() => {
      });
    },
    async goodsInventory() {
      request({
        url: '/jcx/goods/inventory/' + getTenantId(),
        method: 'get'
      }).then(res => {
        console.info(res)
      });
    },

    showMsgDrawerShow() {
      this.showDrawerMsgIndex = new Date().getTime() + 'a';
      this.showDrawerMsg = true
      this.showMsgDrawer();
    },
    showMsgDrawer() {
      msgMessageReadQueryPageList({pageNum: this.messageListPageNum, pageSize: this.messageListPageSize})
      .then(r => {
        this.messageList = r.dataList
        this.messageList.forEach(item => {
          item.hasJsonData = true;
          item.messageJsonDataObject = JSON.parse(item.messageJsonData)
        })
        this.messageListTotal = parseInt(r.total)
        // console.info(this.messageList)
      }).then(() => {
        this.messageList.forEach(ttt => {
          var children = document.getElementById('md_' + ttt.id).children[0].children[0];

          children.innerHTML = '<span style="width:15px"> </span>' + children.innerText
          .replaceAll("*", "").trimEnd() + (!ttt.isRead ? "&nbsp;&nbsp;<span style='color:red'>*</span>" : "");
        });
      })
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
