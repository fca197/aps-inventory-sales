import request from "@/utils/request";
import ElementUI from "element-ui";

export function add(data, options) {
  const urlPrefix = getPathPrefix()
  return request({
    url: urlPrefix + "/insert",
    "method": "POST",
    data: data
  })
}

export function post(url, data, showMsg) {
  return request({
    url: url,
    "method": "POST",
    data: data
  }).then(res => {
    if (showMsg === undefined || showMsg === true) {
      if (res.code === 200) {
        ElementUI.Message({
          message: '操作成功',
          type: "success"
        });
      } else {
        ElementUI.Message({
          message: res.msg,
          type: "error"
        });
      }
    }
    return res;
  })
}

export function queryPageList(data) {
  const urlPrefix = getPathPrefix()
  return request({
    url: urlPrefix + "/queryPageList",
    "method": "POST",
    data: data
  })
}

export function queryUrlPageList(url, data) {
  return request({
    url: url + "/queryPageList",
    "method": "POST",
    data: data
  })
}

export function updateById(data) {
  const urlPrefix = getPathPrefix()
  return request({
    url: urlPrefix + "/updateById",
    "method": "POST",
    data: data
  })
}

export function deleteByIdList(data) {
  const urlPrefix = getPathPrefix()
  return request({
    url: urlPrefix + "/deleteByIdList",
    "method": "POST",
    data: data
  })
}

export function getById(data) {
  const urlPrefix = getPathPrefix()
  return request({
    url: urlPrefix + "/queryByIdList",
    "method": "POST",
    data: data
  })
}

function getPathPrefix() {
  return document["pagePath"]
}

export function updateStatus(data) {
  const urlPrefix = getPathPrefix()
  return request({
    url: urlPrefix + "/updateStatus",
    "method": "POST",
    data: data
  })
}

export function checkCompareDesc(property) {
  return function (a, b) {
    let value1 = a[property];
    let value2 = b[property];
    return value2 - value1;
  }
}

export function checkCompare(property) {
  return function (a, b) {
    let value1 = a[property];
    let value2 = b[property];
    return value1 - value2;
  }
}

export function showMsg(res, showMsg) {
  if (res.code !== 200) {
    ElementUI.Message({
      message: res.msg || showMsg || '操作失败',
      type: 'error'
    });
    return false;
  }
  ElementUI.Message({
    message: showMsg || '操作成功',
    type: 'success'
  });
}

export function toString(obj) {
  return JSON.stringify(obj)
}

export function randomNum(maxNum) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWSYZabcdefghijklmnopqrstuvwsyz0123456789';
  const list = [];
  //通过随机获取八个字符串的索引下标
  for (let i = 0; i < maxNum; i++) {
    //61为chars字符串长度为62，注意索引是从0开始的
    const val_1 = Math.round(Math.random() * 61);
    list.push(val_1);
  }

  return list.map(item => chars[item]).join('');
}
