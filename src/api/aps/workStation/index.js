import request from "@/utils/request";

export  function getWorkStationList(data) {
  return request({
    url: "/workshopStation/queryPageList",
    method: "post",
    data
  });
}
