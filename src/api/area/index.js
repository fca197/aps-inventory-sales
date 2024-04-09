import request from "@/utils/request";

export function areaList(data) {
  return new request({
    url: '/area/queryPageList',
    data
  })
}
