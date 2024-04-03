import request from "@/utils/request";
import ElementUI from "element-ui";
import {urlPrefix} from "@/api/tenant";
import * as XLSX from "xlsx";

export function add(data, options) {
  const urlPrefix = getPathPrefix()
  return request({
    url: urlPrefix + "/insert",
    "method": "POST",
    data: data
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

export function showMsg(res, successMsg) {
  ElementUI.Message({
    message: successMsg || '操作成功',
    type: 'success'
  });
}

export  function toString(obj) {
  return JSON.stringify(obj)
}



