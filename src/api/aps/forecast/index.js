import request from "@/utils/request";

export function getForecastData(id) {
  return request({
    url: '/apsGoodsForecast/getForecastDataById',
    method: 'post',
    data: {
      id: id
    }
  })
}
