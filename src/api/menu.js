import request from '@/utils/request'
import constantRoutes from "@/router";
import Layout from "@/layout";


// 公共路由
// 获取路由
export const getRouters = () => {
  // return request({
  //   url: '/getRouters',
  //   method: 'get'
  // })

  return Promise.resolve({data:[]})
}
