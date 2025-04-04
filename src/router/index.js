import Vue from 'vue'
import Router from 'vue-router'
/* Layout */
import Layout from '@/layout'
import { getRouters } from '@/api/menu'

Vue.use(Router)

/**
 * Note: 路由配置项
 *
 * hidden: false                     // 当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
 * alwaysShow: true                 // 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
 *                                  // 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
 *                                  // 若你想不管路由下面的 children 声明的个数都显示你的根路由
 *                                  // 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 * redirect: noRedirect             // 当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'               // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * query: '{"id": 1, "name": "ry"}' // 访问路由的默认传递参数
 * roles: ['admin', 'common']       // 访问路由的角色权限
 * permissions: ['a:a:a', 'b:b:b']  // 访问路由的菜单权限
 * meta : {
 noCache: true                   // 如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
 title: 'title'                  // 设置该路由在侧边栏和面包屑中展示的名字
 icon: 'svg-name'                // 设置该路由的图标，对应路径src/assets/icons/svg
 breadcrumb: false               // 如果设置为false，则不会在breadcrumb面包屑中显示
 activeMenu: '/system/user'      // 当路由设置了该属性，则会高亮相对应的侧边栏。
 }
 */

// 公共路由
export const constantRoutes = [{
  path: '/hidden.layout', component: Layout, hidden: true,

  children: [{
    path: '/aps/goods/forecast/make/week/result',
    name: '(预)生产数据-销售配置',
    component: () => import('@/views/system/aps/forecastMakeWeek/result'),
    meta: { title: '(预)周生产管理数据', icon: 'eye-open', affix: false }
  }, {
    path: '/aps/goods/forecast/make/week/projectResult',
    name: '(预)生产数据-工程配置',
    component: () => import('@/views/system/aps/forecastMakeWeek/projectResult'),
    meta: {
      title: '(预)周生产管理数据-规划配置', icon: 'eye-open', affix: false
    }
  }, {
    path: '/aps/goods/forecast/make/week/bomResult',
    name: '(预)生产数据-零件配置',
    component: () => import('@/views/system/aps/forecastMakeWeek/bomResult.vue'),
    meta: { title: '(预)周生产管理数据-零件', icon: 'eye-open', affix: false }
  }, {
    path: '/psGoodsForecast/getDataById',
    component: () => import('@/views/system/aps/forecast/data.vue'),
    meta: { title: '上传数据', icon: 'redis', affix: false },
    hidden: false
  }, {
    path: '/apsGoodsForecast/compute',
    name: '计算结果',
    component: () => import('@/views/system/aps/forecast/result.vue'),
    meta: { title: '计算结果', icon: 'redis', affix: false },
    hidden: false
  }, {
    path: '/psGoodsForecastMain/getDataByGoodsId',
    name: '主版本预测数据',
    component: () => import('@/views/system/aps/forecastMain/result.vue'),
    meta: { title: '主版本预测数据', icon: 'redis', affix: false },
    hidden: false
  }, {
    path: '/apsGoodsForecastMainMakeWeek/queryDataDataById',
    name: '(预测)生产数据看板',
    component: () => import('@/views/system/aps/forecastMainMake/result.vue'),
    meta: { title: '(预测)生产数据看板', icon: 'redis', affix: false },
    hidden: false
  }, {
    path: '/apsGoodsForecastMainMakeWeek/queryProjectDataById',
    name: '(预测)生产数据看板-工程配置',
    component: () => import('@/views/system/aps/forecastMainMake/projectResult.vue'),
    meta: { title: '(预测)生产数据看板-工程配置', icon: 'redis', affix: false },
    hidden: true
  }, {
    path: '/apsGoodsForecastMainMakeWeek/queryBomDataById',
    name: '(预测)生产数据看板-零件配置',
    component: () => import('@/views/system/aps/forecastMainMake/bomResult.vue'),
    meta: { title: '(预测)生产数据看板-零件配置', icon: 'redis', affix: false },
    hidden: true
  }, {
    path: '/aps/make/scheduling/create',
    name: '创建排产版本',
    component: () => import('@/views/system/aps/scheduling/CreateScheduling.vue'),
    meta: { title: '创建排产版本', icon: 'redis', affix: false },
    hidden: false
  }]
}, {
  path: '/redirect', component: Layout, hidden: false, children: [{
    path: '/redirect/:path(.*)', component: () => import('@/views/redirect')
  }]
}, {
  path: '/login', component: () => import('@/views/login'), hidden: false
}, {
  path: '/register', component: () => import('@/views/register'), hidden: false
}, {
  path: '/404', component: () => import('@/views/error/404'), hidden: false
}, {
  path: '/401', component: () => import('@/views/error/401'), hidden: false
}, {
  path: '', component: Layout, redirect: 'index', children: [{
    path: 'index',
    component: () => import('@/views/index'),
    name: 'Index',
    meta: { title: '首页', icon: 'dashboard', affix: false }
  }]
}]

// 防止连续点击多次路由报错
let routerPush = Router.prototype.push
let routerReplace = Router.prototype.replace
// push
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(err => err)
}
// replace
Router.prototype.replace = function push(location) {
  return routerReplace.call(this, location).catch(err => err)
}

export default new Router({
  // mode: 'history', // 去掉url中的#
  mode: 'hash', // 去掉url中的#
  scrollBehavior: () => ({ y: 0 }), routes: constantRoutes
})

let roureMap = {
  '/aps/apsLogistics/path/index': {
    hidden: false,
    comment: () => import('@/views/system/aps/apsLogisticsPath/ApsLogisticsPath.vue')
  }, '/aps/apsOrderGoodsHistory': {
    hidden: false,
    comment: () => import('@/views/system/aps/apsOrderGoodsHistory/ApsOrderGoodsHistory.vue')
  }, '/aps/apsOrderGoodsSaleHistory': {
    hidden: false,
    comment: () => import('@/views/system/aps/apsOrderGoodsSaleHistory/ApsOrderGoodsSaleHistory.vue')
  },

  '/aps/bom/index': {
    hidden: false, comment: () => import('@/views/system/aps/bom/index')
  }, '/aps/bom/supplier/index': {
    hidden: false,
    comment: () => import('@/views/system/aps/apsBomSupplier/ApsBomSupplier.vue')
  }, '/aps/bomBuyPlan/index': {
    hidden: false, comment: () => import('@/views/system/aps/bomBuyPlan/index')
  }, '/aps/bomGroup/index': {
    hidden: false, comment: () => import('@/views/system/aps/bomGroup/index')
  },

  '/aps/goods/forecast/index': {
    hidden: false, comment: () => import('@/views/system/aps/forecast/index')
  }, '/aps/goods/forecast/main/index': {
    hidden: false,
    comment: () => import('@/views/system/aps/forecastMain/index')
  }, '/aps/goods/forecast/make/week/index': {
    hidden: false,
    comment: () => import('@/views/system/aps/forecastMakeWeek/index')
  }, '/aps/goods/forecast/make/weekMain/index': {
    hidden: false,
    comment: () => import('@/views/system/aps/forecastMainMake/index')
  }, //xx
  '/aps/goods/index': {
    hidden: false, comment: () => import('@/views/system/aps/goods/index')
  }, '/aps/goods/sale/index': {
    hidden: false,
    comment: () => import('@/views/system/aps/goodsSaleConfig/index')
  }, '/aps/goods/sale/project/index': {
    hidden: false,
    comment: () => import('@/views/system/aps/goodsSale2project/index')
  }, '/aps/goodsBom/index': {
    hidden: false, comment: () => import('@/views/system/aps/goodsBom/index')
  },

  '/aps/machine/index': {
    hidden: false,
    comment: () => import('@/views/system/aps/apsMachine/ApsMachine.vue')
  },

  '/aps/make/constraint/index': {
    hidden: false,
    comment: () => import('@/views/system/aps/make_capacity/constraint')
  }, '/aps/make/make_capacity_goods/index': {
    hidden: false,
    comment: () => import('@/views/system/aps/make_capacity/make_capacity_goods')
  }, '/aps/make/make_capacity_sale_config/index': {
    hidden: false,
    comment: () => import('@/views/system/aps/make_capacity/make_capacity_sale_config/index.vue')
  }, '/aps/make_capacity_factory/index': {
    hidden: false,
    comment: () => import('@/views/system/aps/make_capacity/make_capacity_factory/index.vue')
  },

  '/aps/order/index': {
    hidden: false, comment: () => import('@/views/system/aps/order/index')
  }, '/aps/order/roll/factory/index': {
    hidden: false,
    comment: () => import('@/views/system/aps/apsRollingForecastFactoryCapacity/ApsRollingForecastFactoryCapacity.vue')
  }, '/aps/order/roll/index': {
    hidden: false,
    comment: () => import('@/views/system/aps/roll/ApsOrderRollingForecast.vue')
  }, '/aps/order/timeline/index': {
    hidden: false,
    comment: () => import('@/views/system/aps/order/timeLine.vue')
  }, '/aps/order/goodsSaleHistory': {
    hidden: false,
    comment: () => import('@/views/system/aps/apsOrderGoodsSaleHistory/ApsOrderGoodsSaleHistory.vue')
  },

  '/aps/process/path/index': {
    hidden: false, comment: () => import('@/views/system/aps/processPath/index')
  }, '/aps/produceProcess/path/index': {
    hidden: false,
    comment: () => import('@/views/system/aps/apsProduceProcess/ApsProduceProcess.vue')
  }, '/aps/project/index': {
    hidden: false,
    comment: () => import('@/views/system/aps/projectConfig/index')
  }, '/aps/room/index': {
    hidden: false, comment: () => import('@/views/system/aps/room/index')
  }, '/aps/sale/index': {
    hidden: false, comment: () => import('@/views/system/aps/saleConfig/index')
  }, '/aps/scheduling/bom/index': {
    hidden: true,
    comment: () => import('@/views/system/aps/scheduling/bomTotalResult.vue')
  }, '/aps/scheduling/day/config/index': {
    hidden: false,
    comment: () => import('@/views/system/aps/apsSchedulingDayConfigVersion/ApsSchedulingDayConfigVersion.vue')
  }, '/aps/scheduling/day/index': {
    hidden: false,
    comment: () => import('@/views/system/aps/apsSchedulingDayConfig/ApsSchedulingDayConfig.vue')
  }, '/aps/scheduling/index': {
    hidden: false, comment: () => import('@/views/system/aps/scheduling')
  }, '/aps/section/index': {
    hidden: false, comment: () => import('@/views/system/aps/section/index')
  }, '/aps/station/index': {
    hidden: false, comment: () => import('@/views/system/aps/station/index')
  }, '/aps/status/index': {
    hidden: false, comment: () => import('@/views/system/aps/status/index')
  }, '/apsSchedulingDayConfigVersion/detailList': {
    hidden: true,
    comment: () => import('@/views/system/aps/apsSchedulingDayConfigVersion/detailList.vue')
  }, '/base/baseTableHeader/index': {
    hidden: false,
    comment: () => import('@/views/system/baseTableHeader/BaseTableHeader.vue')
  }, '/base/role/group/index': {
    hidden: false,
    comment: () => import('@/views/system/base/baseRoleGroup/BaseRoleGroup.vue')
  }, '/base/role/index': {
    hidden: false,
    comment: () => import('@/views/system/base/baseRole/BaseRole.vue')
  }, '/baseApp/index': {
    hidden: false,
    comment: () => import('@/views/system/base/baseApp/BaseApp.vue')
  }, '/baseAppResource/index': {
    hidden: false,
    comment: () => import('@/views/system/base/baseResource/BaseResource.vue')
  }, '/file/upload/index': {
    hidden: false, comment: () => import('@/views/system/fileUpload/index')
  }, '/login/account/index': {
    hidden: false, comment: () => import('@/views/loginAccount/index')
  }, '/prop/shift/index': {
    hidden: false, comment: () => import('@/views/system/basic/shift/index')
  }, '/prop/spec/index': {
    hidden: false, comment: () => import('@/views/system/calendar/index')
  }, '/seller/index': {
    hidden: false,
    comment: () => import('@/views/system/aps/apsSellerStore/ApsSellerStore.vue')
  }, '/setting/baseApp/index': {
    hidden: false,
    comment: () => import('@/views/system/base/baseApp/BaseApp.vue')
  }, '/setting/baseResource': {
    hidden: false,
    comment: () => import('@/views/system/base/baseResource/BaseResource.vue')
  }, '/setting/oplog/index': {
    hidden: false,
    comment: () => import('@/views/system/base/oplog/BaseOplog.vue')
  }, '/supplier/index': {
    hidden: false, comment: () => import('@/views/system/supplier/index')
  }, '/views/brand/index': {
    hidden: false, comment: () => import('@/views/system/brand/index')
  }, '/views/factory/index': {
    hidden: false, comment: () => import('@/views/system/factory/index')
  }, '/views/tenant/index': {
    hidden: false, comment: () => import('@/views/system/tenant/index')
  }, '/task/taskDef': {
    hidden: false,
    comment: () => import('@/views/system/task/taskDef/TaskDef.vue')
  },

  '/base/report/config': {
    hidden: false,
    comment: () => import('@/views/system/base/baseReportConfig/BaseReportConfig.vue')
  }

}

export function convertMenusToRoutes(menus) {
  // console.info(menus)
  return menus.filter(t => t !== null).sort((a, b) => {
    // console.log( a.sortIndex , b.sortIndex)
    if (a.sortIndex > b.sortIndex) return 1
    if (a.sortIndex < b.sortIndex) return -1
    return 0
  }).map(menu => {
    const route = {
      path: encodeURI(menu.resourceUrl), name: menu.resourceName, // component: Layout,
      component: Layout, meta: {
        title: menu.resourceName, icon: 'eye-open', affix: false
      }
    }

    if (menu.children && menu.children.length > 0) {
      route.children = []
      menu.children
      .sort((a, b) => {
        // console.log( a.sortIndex , b.sortIndex)
        if (a.sortIndex > b.sortIndex) return 1
        if (a.sortIndex < b.sortIndex) return -1
        return 0
      })
      .forEach(tt => {
        route.children.push({
          path: encodeURI(tt.resourceUrl),
          name: tt.resourceName,
          index: tt.id,
          component: roureMap[tt.resourceUrl]?.comment,
          hidden: roureMap[tt.resourceUrl]?.hidden,
          meta: {
            title: tt.resourceName, icon: 'eye-open', affix: false
          }
        })
      })

    }
    return route
  })
}

export function loadResource() {
  return getRouters({ queryPage: false, appCode: 'aps' }).then(res => {
    let dataList = res.data.dataList
    // dataList = removeDuplicatesByFieldWithFilter(dataList, 'resourceId')

    dataList = removeDuplicatesByFieldWithFilter(dataList, 'resourceId')
    // dataList.forEach(t=>{
    //   // console.info('old',t.id,t.parentId)
    // })
    let parentList = dataList.filter(t => t.parentId === '0')
    // var tree = handleTree(dataList, 'id','resourceId','children')
    list2Tree(parentList, dataList)
    return convertMenusToRoutes(parentList)
  })
}

function list2Tree(resList, allLst) {
  resList.forEach(t => {
    let tl= allLst.filter(tt => tt.parentId === t.resourceId);
    // console.info(t.id,tl)
    t.children =tl
  })
}

function removeDuplicatesByFieldWithFilter(arr, field) {
  return arr.filter((item, index, self) => {
    return self.findIndex(t => t[field] === item[field]) === index
  })
}
