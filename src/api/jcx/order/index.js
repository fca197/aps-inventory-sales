import request from "@/utils/request";

export  function  getOrderStatus(){

  return request({
    url: '/jcx/order/orderStatus',
    method: 'post',
    data:{}
  }).then((res)=>{
    return res.data.orderStatusName;
  })
}
