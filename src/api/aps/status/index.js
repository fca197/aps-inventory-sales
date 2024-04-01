import request from "@/utils/request";

export  function getStatusList(data) {
  return request({
    url: "/apsStatus/queryPageList",
    method: "post",
    data
  });
}
