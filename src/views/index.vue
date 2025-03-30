<template>
  <div class="app-container home">

    <el-row>
      <el-col :span="24" style="line-height: 40px;">
        <el-button type="primary" size="mini" @click="resetDb">{{ resetLastTime }}秒后可还原数据库</el-button>
      </el-col>
    </el-row>

    <user-report-home/>

  </div>
</template>

<script>

import { post } from '@/api/common'
import UserReportHome from '@/views/system/base/baseReportConfig/UserReportHome.vue'

export default {
  name: 'VersionChangeIndex',
  components: {
    UserReportHome
  },
  data() {
    let cl = [5, 10, 30, 50]
    let taskOpen = false
    return {
      resetLastTime: 0,
      taskLoading: true,
      taskSetting: {
        open: taskOpen
      },
      taskOpen: taskOpen,
      machineOpen: false,
      orderCreateOpen: false,
      apsSystemPreviewOpen: false,
      machineProduceBomOpen: false,
      machineUseTimeOpen: false,
      orderCreateAndMakeOpen: false,
      orderCreateForecastProcessOpen: false,
      unDonTaskCountList: cl,
      unDonTaskCount: cl[0],
      undoneTaskList: [],
      // 版本号
      version: '3.8.6'

    }
  },
  mounted() {

  },
  created() {
    this.resetLast()
  },
  methods: {

    resetDb() {
      if (this.resetLastTime != 0) {
        this.$message.warning('请' + this.resetLastTime + '秒后再试')
        return
      }
      post('/db/reset', {})
    },
    resetLast() {
      post('/db/reset/last', {}, false).then(t => {
        this.resetLastTime = t.data.expire
        if (this.resetLastTime <= 0) {
          this.resetLastTime = 0
          return
        }
        let _t = this
        // 设置定时器，每秒执行一次
        const intervalId = setInterval(() => {
          // 倒计时减 1
          _t.resetLastTime--
          // 当倒计时到 0 时，停止定时器
          if (_t.resetLastTime === 0) {
            clearInterval(intervalId)
          }
        }, 1000)

      })
    }
  }
}
</script>

<style lang="scss" scoped>
.home {
  blockquote {
    padding: 10px 20px;
    margin: 0 0 20px;
    font-size: 17.5px;
    border-left: 5px solid #eee;
  }

  hr {
    margin-top: 20px;
    margin-bottom: 20px;
    border: 0;
    border-top: 1px solid #eee;
  }

  .col-item {
    margin-bottom: 20px;
  }

  ul {
    padding: 0;
    margin: 0;
  }

  font-family: "open sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 13px;
  color: #676a6c;
  overflow-x: hidden;

  ul {
    list-style-type: none;
  }


  h3 {
    margin-bottom: 10px;
    font-size: 18px;
    line-height: 1.1;
    font-weight: 800;
  }

  p {
    margin-top: 10px;

    b {
      font-weight: 700;
    }
  }

  .update-log {
    ol {
      display: block;
      list-style-type: decimal;
      margin-block-start: 1em;
      margin-block-end: 1em;
      margin-inline-start: 0;
      margin-inline-end: 0;
      padding-inline-start: 40px;
    }
  }
}
</style>

