import request from "@/utils/request";

export function selectList(data) {
  return request({
    url: '/store/queryPageList',
    method: 'post',
    data
  })
}
