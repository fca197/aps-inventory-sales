import request from "@/utils/request";

export  function  queryDataById(data){
  return request({
    url: '/apsGoodsForecastMake/queryDataById',
    method: 'post',
    data
  })
}
