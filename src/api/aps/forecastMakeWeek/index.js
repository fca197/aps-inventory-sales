import request from "@/utils/request";
import {Message} from "element-ui";

export function queryDataById(data) {
  return request({
    url: '/apsGoodsForecastMake/queryDataById',
    method: 'post',
    data
  })
}
export function queryProjectDataById(data) {
  return request({
    url: '/apsGoodsForecastMake/queryProjectDataById',
    method: 'post',
    data
  })
}

export function deploy(data) {
  return request({
    url: '/apsGoodsForecastMake/deploy',
    method: 'post',
    data
  }).then(res => {
    Message.success("发布成功")
  })
}
