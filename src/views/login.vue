<template>
  <div class="login">
    <div v-if="loginType===2" class="dingLoginDiv">
      <div class="usePwdLogin" @click="loginType=1"/>
      <h3 class="title"><span style="color: red; font-size: 22px;padding:  0 5px">APS</span>后台管理系统</h3>
      <div id="self_defined_element" style="
    margin-left: 50px;
    margin-top: -25px;"
      >
        <div style="font-size: 30px;    color: #111;    font-family: cursive;vert-align: middle; height: 200px; margin-top: 130px">开发中 ...
        </div>
      </div>
      <div>
      </div>
    </div>
    <div v-if="loginType===1">
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form">
        <div class="useOtherLogin" @click="dingLogin"></div>
        <h3 class="title"><span style="color: red; font-size: 22px;padding:  0 5px">APS</span>后台管理系统</h3>
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            auto-complete="off"
            placeholder="账号"
            type="text"
          >
            <svg-icon slot="prefix" class="el-input__icon input-icon" icon-class="user"/>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            auto-complete="off"
            placeholder="密码"
            type="password"
            @keyup.enter.native="handleLogin"
          >
            <svg-icon slot="prefix" class="el-input__icon input-icon" icon-class="password"/>
          </el-input>
        </el-form-item>
        <el-form-item v-if="captchaEnabled" prop="code">
          <el-input
            v-model="loginForm.code"
            auto-complete="off"
            placeholder="验证码"
            style="width: 63%"
            @keyup.enter.native="handleLogin"
          >
            <svg-icon slot="prefix" class="el-input__icon input-icon" icon-class="validCode"/>
          </el-input>
          <div class="login-code">
            <img :src="codeUrl" class="login-code-img" @click="getCode"/>
          </div>
        </el-form-item>
        <el-checkbox v-model="loginForm.rememberMe" style="margin:0px 0px 25px 0px;">记住密码</el-checkbox>
        <el-form-item style="width:100%;">
          <el-button
            :loading="loading"
            size="medium"
            style="width:100%;"
            type="primary"
            @click.native.prevent="handleLogin"
          >
            <span v-if="!loading">登 录</span>
            <span v-else>登 录 中...</span>
          </el-button>
          <div v-if="register" style="float: right;">
            <router-link :to="'/register'" class="link-type">立即注册</router-link>
          </div>
          <!--          <el-tag type="warning" style="float: right;margin-top: 10px;margin-bottom: -5px" >体验版版本</el-tag>-->
        </el-form-item>
      </el-form>
    </div>
    <!--  底部  -->
    <div class="el-login-footer">
      <span>Copyright © 2024-2025 solveplan.cn All Rights Reserved.  <a href="https://beian.miit.gov.cn/">鲁ICP备2024105874号</a> </span>
    </div>


  </div>
</template>

<script>
import { getCodeImg } from '@/api/login'
import Cookies from 'js-cookie'
import { decrypt, encrypt } from '@/utils/jsencrypt'
import versionChange from '@/views/version/index.vue'
import { addJs, log } from '@/api/common'
import { v4 as uuidv4 } from 'uuid'

export default {
  name: 'Login',
  components: {
    versionChange
  },
  data() {
    return {
      loginType: 1,
      codeUrl: '',
      loginForm: {
        username: '18600000000',
        password: 'admin',
        rememberMe: false,
        code: '',
        uuid: ''
      },
      loginRules: {
        username: [
          { required: true, trigger: 'blur', message: '请输入您的账号' }
        ],
        password: [
          { required: true, trigger: 'blur', message: '请输入您的密码' }
        ],
        code: [{ required: true, trigger: 'change', message: '请输入验证码' }]
      },
      loading: false,
      // 验证码开关
      captchaEnabled: false,
      // 注册开关
      register: false,
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  created() {
    var item = localStorage.getItem('deviceId') || uuidv4()
    log(item)
    localStorage.setItem('deviceId', item)
    addJs('https://g.alicdn.com/dingding/h5-dingtalk-login/0.21.0/ddlogin.js')
    this.getCode()
    this.getCookie()

    this.$notify({
      title: '版本提示',
      type: 'warning',
      message: '该版本为体验版本!develop分支',
      duration: 0
    })
  },
  methods: {
    getCode() {
      getCodeImg().then(res => {
        this.captchaEnabled = res.captchaEnabled === undefined ? true : res.captchaEnabled
        if (this.captchaEnabled) {
          this.codeUrl = 'data:image/gif;base64,' + res.img
          this.loginForm.uuid = res.uuid
        }
      })
    },
    getCookie() {
      const username = Cookies.get('username')
      const password = Cookies.get('password')
      const rememberMe = Cookies.get('rememberMe')
      this.loginForm = {
        username: username === undefined ? this.loginForm.username : username,
        password: password === undefined ? this.loginForm.password : decrypt(password),
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          if (this.loginForm.rememberMe) {
            Cookies.set('username', this.loginForm.username, { expires: 30 })
            Cookies.set('password', encrypt(this.loginForm.password), { expires: 30 })
            Cookies.set('rememberMe', this.loginForm.rememberMe, { expires: 30 })
          } else {
            Cookies.remove('username')
            Cookies.remove('password')
            Cookies.remove('rememberMe')
          }
          this.$store.dispatch('Login', this.loginForm).then(() => {
            this.$router.push({ path: this.redirect || '/' }).catch(() => {
            })
          }).catch(() => {
            this.loading = false
            if (this.captchaEnabled) {
              this.getCode()
            }
          })
        }
      })
    },
    dingLogin() {
      this.loginType = 2
      this.$nextTick(() => {
        window.DTFrameLogin(
          {
            id: 'self_defined_element',
            width: 250,
            height: 250
          },
          {
            redirect_uri: encodeURIComponent('https://aps.solveplan.cn/api/peanut/ding/auth'),
            client_id: '',
            scope: 'openid',
            response_type: 'code',
            state: '',
            prompt: 'consent'
          },
          (loginResult) => {
            const { redirectUrl, authCode, state } = loginResult
            // 这里可以直接进行重定向
            window.location.href = redirectUrl
            // 也可以在不跳转页面的情况下，使用code进行授权
            console.log(authCode)
          },
          (errorMsg) => {
            // 这里一般需要展示登录失败的具体原因,可以使用toast等轻提示
            console.error(`errorMsg of errorCbk: ${errorMsg}`)
          }
        )
      })
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss">
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-image: url("../assets/images/login-background.jpg");
  background-size: cover;
}

.title {
  margin: 0px auto 30px auto;
  text-align: center;
  color: #707070;
}

.login-form {
  border-radius: 10px;
  background: #ffffff;
  width: 400px;
  padding: 25px 25px 5px 25px;
  height: 350px;

  .el-input {
    height: 38px;

    input {
      height: 38px;
    }
  }

  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 2px;
  }
}

.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}

.login-code {
  width: 33%;
  height: 38px;
  float: right;

  img {
    cursor: pointer;
    vertical-align: middle;
  }
}

.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}

.login-code-img {
  height: 38px;
}

.useOtherLogin {
  float: right;
  margin-right: -25px;
  margin-top: -25px;
  width: 60px;
  background-size: contain;
  top: -20px;
  height: 60px;
  background-image: url("../assets/images/qr-login.png");
}

.usePwdLogin {
  float: right;
  margin-right: -25px;
  margin-top: -25px;
  width: 60px;
  background-size: contain;
  top: -20px;
  height: 60px;
  background-image: url("../assets/images/pwd-login.png");
}

.dingLoginDiv {
  border-radius: 10px;
  width: 400px;
  height: 350px;
  background: #ffffff;
  padding: 25px;
}
</style>
