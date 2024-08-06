import { constantRoutes, dynamicFlowRoutes, dynamicRoutes } from '@/router'
import { getRouters } from '@/api/menu'
import { queryUrlNoPageList } from '@/api/common'

const permission = {
  state: {
    routes: [],
    addRoutes: [],
    defaultRoutes: [],
    topbarRouters: [],
    sidebarRouters: []
  },
  mutations: {
    SET_ROUTES: (state, routes) => {
      debugger
      state.addRoutes = routes
      state.routes = constantRoutes.concat(routes)
    },
    SET_DEFAULT_ROUTES: (state, routes) => {
      state.defaultRoutes = constantRoutes.concat(routes)
    },
    SET_TOPBAR_ROUTES: (state, routes) => {
      state.topbarRouters = routes
    },
    SET_SIDEBAR_ROUTERS: (state, routes) => {
      state.sidebarRouters = routes
    }
  },
  actions: {
    // 生成路由
    GenerateRoutes({ commit }) {
      return new Promise(resolve => {
        // 向后端请求路由数据
        getRouters().then(res => {
          let resourceUrlArray = Array.from(res.data.dataList,
            ({ resourceUrl }) => resourceUrl)
          resourceUrlArray.splice(0, 0, '----')
          // resourceUrlArray.push("");
          // console.log(resourceUrlArray)
          const asyncRoutes = filterDynamicRoutes(dynamicRoutes,
            resourceUrlArray)
          // console.log(asyncRoutes)

          commit('SET_SIDEBAR_ROUTERS', constantRoutes.concat(asyncRoutes))
          // resolve(asyncRoutes)

          queryUrlNoPageList('/flowGroup').then(t => {
            let fl = t.data.dataList
            if (fl.length > 0) {
              fl.forEach(r => {
                asyncRoutes.push(dynamicFlowRoutes(r))
              })
              // asyncRoutes.push(dynamicFlowRoutes(fl[0]))
            }
            commit('SET_SIDEBAR_ROUTERS', constantRoutes.concat(asyncRoutes))
            console.log(asyncRoutes)
            resolve(asyncRoutes)
          })
        })
      })
    }
  }
}

// 动态路由遍历，验证是否具备权限
export function filterDynamicRoutes(routes, resourceUrlArray) {
  const res = []
  routes.forEach(route => {
    let rt = {}
    Object.assign(rt, route)
    // if (route.children) {
    //   // rt.children =filterDynamicRoutes(route.children, resourceUrlArray);
    // }
    if (resourceUrlArray.indexOf(route.path) > -1) {
      res.push(rt)
      if (route.children) {
        rt.children = filterDynamicRoutes(route.children, resourceUrlArray)
      }
    }
  })
  // console.log(res)
  return res
}

export const loadView = (view) => {
  if (process.env.NODE_ENV === 'development') {
    return (resolve) => require([`@/views/${view}`], resolve)
  } else {
    // 使用 import 实现生产环境的路由懒加载
    return () => import(`@/views/${view}`)
  }
}

export default permission
