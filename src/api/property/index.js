import request from "@/utils/request";
import {showMsg} from "@/api/common";

export function updateInUse(data) {
  return request({
    url: '/property/updateUse',
    method: 'post',
    data
  }).then(res => {
    showMsg(res);
  });
}

export function insertCheckList(data) {
  return request({
    url: "/checkReportList/insert",
    data,
    method: "post"
  }).then(res => {
    debugger
    showMsg(res);
  })
}

export function handleOverReport(obj) {
  obj.isOver = true
  let data = {
    id: obj.id,
    isOver: obj.isOver,
    versionNum: obj.versionNum
  }
return   updateById(data);
}
function  updateById(data){
  return request({
    url: "/checkReport/updateById",
    data,
    method: "post"
  }).then(res => {
    showMsg(res);
  });
}

export  function  handleOpenReport(obj){
  obj.isOver = false
  let data = {
    id: obj.id,
    isOver: obj.isOver,
    versionNum: obj.versionNum
  }
 return  updateById(data);
}
