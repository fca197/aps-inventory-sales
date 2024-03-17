import request from "@/utils/request";

export  function  checkReportListFactory(data){
  return request({
    url: '/checkReportList/factory',
    method: 'post',
    data
  });
}
export  function  checkReportListRoom(data){
  return request({
    url: '/checkReportList/room',
    method: 'post',
    data
  });
}

export function getReportList(data) {
  return request({
    url: '/checkReport/queryList',
    method: 'post',
    data
  });
}
