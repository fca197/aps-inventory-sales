import request from '@/utils/request'

export function getFactoryList(data) {
  return request({
    url: '/factory/queryPageList', method: 'post', data: { queryPage: false }
  })
}
