// 公共路由
// 获取路由
import { queryUrlNoPageList } from '@/api/common'

export const getRouters = () => {
  return queryUrlNoPageList('/baseAppResource')

  // return Promise.resolve({ data: [] })
}
