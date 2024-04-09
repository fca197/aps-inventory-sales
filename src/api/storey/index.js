import request from "@/utils/request";

export function getStoreyList(data) {
  return request({
    url: "/storey/queryPageList",
    method: 'post',
    data: data
  })
}
