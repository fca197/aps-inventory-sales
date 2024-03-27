import request from "@/utils/request";

export  function updateStatus(data){
  return request({
    url: '/jcxBuyPlan/updateStatus',
    method: 'post',
    data
  })
}
