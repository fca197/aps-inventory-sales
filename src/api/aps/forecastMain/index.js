import request from "@/utils/request";

export function getForecastData(data) {
  return request({
    url: '/apsGoodsForecastMainSaleData/getDataByGoodsId',
    method: 'post',
    data
  })
}
