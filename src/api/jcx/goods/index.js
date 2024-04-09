import request from "@/utils/request";

export function getFoodsList(data) {
  return request({
    url: '/jcx/goods/queryPageList',
    method: 'post',
    data
  }).then(res => {
    return res.data
  })
}
