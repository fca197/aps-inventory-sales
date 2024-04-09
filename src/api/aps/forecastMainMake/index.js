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

export function queryDataById(data) {
  return request({
    url: '/apsGoodsForecastMainMake/queryDataById',
    method: 'post',
    data
  })
}
