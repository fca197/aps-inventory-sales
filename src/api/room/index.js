import request from "@/utils/request";


export  function  getRoomList(data){
  return request({
    url: "/room/queryPageList",
    method: 'post',
    data:data
  })
}
