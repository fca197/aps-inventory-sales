import request from '@/utils/request'

export function queryPageList(data) {
  return request({
    url: "/loginAccount/queryPageList",
    method: "post",
    data: data
  })
}

export function getById(data) {
  return request({
    url: "/loginAccount/queryPageList",
    method: "post",
    data: data
  })
}

export function updateById(data) {
  return request({
    url: "/loginAccount/updateById",
    method: "post",
    data: data
  })
}

export function addAccount(data) {
  return request({
    url: "/loginAccount/insert",
    method: "post",
    data: data
  })
}

export function removeAccount(data) {
  return request({
    url: "/loginAccount/deleteByIdList",
    method: "post",
    data: data
  })
}

export function resetPwd(data) {
  return request({
    url: "/loginAccount/resetPwd",
    method: "post",
    data: data
  })
}
