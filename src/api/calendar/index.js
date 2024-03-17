import request from "@/utils/request";

const urlPrefix = "/calendar"

export  function  calendarDayUpdate(data){
  return request({
    url: urlPrefix+"/day/update",
    method: 'post',
    data
  })
}
export  function  calendarDayById(data){
  return request({
    url: urlPrefix+"//day/byId",
    method: 'post',
    data
  })
}
