// 公共路由
// 获取路由
import { queryUrlPageList } from '@/api/common'

export const getRouters = (data) => {
  return queryUrlPageList('/baseAppResource',data)

  // return Promise.resolve({ data: [] })
}
