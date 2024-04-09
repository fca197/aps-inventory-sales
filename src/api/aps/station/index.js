import request from "@/utils/request";

export function getStationList(data) {
  return request({
    url: "/workshopStation/queryPageList",
    method: "post",
    data
  });
}
