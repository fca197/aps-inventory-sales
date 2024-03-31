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
    Message.success("开始计算")
  })
}

export function computeResult(data) {
  return request({
    url: '/apsGoodsForecast/computeResult',
    method: 'post',
    data
  });
}
