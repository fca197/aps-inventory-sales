import request from '@/utils/request'

export function getApsOrderStatus() {
  //
  return request({
    url: '/apsOrder/statusList',
    method: 'post',
    data: {}
  })
}
