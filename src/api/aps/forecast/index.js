import request from "@/utils/request";
import {Message} from "element-ui";

export function getForecastData(id) {
  return request({
    url: '/apsGoodsForecast/getForecastDataById',
    method: 'post',
    data: {
      id: id
    }
  })
}

export function compute(row) {
  return request({
    url: '/apsGoodsForecast/compute',
    method: 'post',
    data: row
  }).then(res => {
    Message.success("计算成功")
  })
}

export function computeResult(data) {
  return request({
    url: '/apsGoodsForecast/computeResult',
    method: 'post',
    data
  });
}

export function forecastDeploy(data) {
  return request({
    url: '/apsGoodsForecast/deploy',
    method: 'post',
    data
  }).then(res => {
    Message.success("发布成功")
  });
}
