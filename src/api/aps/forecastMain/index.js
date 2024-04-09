import request from "@/utils/request";

export function getForecastData(data) {
  return request({
    url: '/apsGoodsForecastMainSaleData/getDataByGoodsId',
    method: 'post',
    data
  })
}

export function getAllForecastMain(data) {
  return request({
    url: '/apsGoodsForecastMain/queryList',
    method: 'post',
    data
  })
}
