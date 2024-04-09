import request from '@/utils/request'
import md5 from 'js-md5';

// 登录方法
export function login(username, password, code, uuid) {
  const data = {
    loginPhone: username,
    pwd: md5(password).toUpperCase(),
    code,
    uuid
  }
  return request({
    url: '/loginAccount/login/phone/pwd',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data
  })
}

// 注册方法
export function register(data) {
  return request({
    url: '/register',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data
  })
}

// 获取用户详细信息
export function getInfo() {
  return request({
    url: '/loginAccount/getInfo',
    method: 'post',
    data: {}
  })
}

// 退出方法
export function logout() {
  // return request({
  //   url: '/logout',
  //   method: 'post'
  // })
  return Promise.resolve({});
}

// 获取验证码
export function getCodeImg() {
  // return request({
  //   url: '/captchaImage',
  //   headers: {
  //     isToken: false
  //   },
  //   method: 'get',
  //   timeout: 20000
  // })
  return Promise.resolve({captchaEnabled: false});
}
