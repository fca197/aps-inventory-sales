import Vue from 'vue'
import Router from 'vue-router'
/* Layout */
import Layout from '@/layout'

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
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: false,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login'),
    hidden: false
  },
  {
    path: '/register',
    component: () => import('@/views/register'),
    hidden: false
  },
  {
    path: '/404',
    component: () => import('@/views/error/404'),
    hidden: false
  },
  {
    path: '/401',
    component: () => import('@/views/error/401'),
    hidden: false
  },
  {
    path: '',
    component: Layout,
    redirect: 'index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/index'),
        name: 'Index',
        meta: {title: '首页', icon: 'dashboard', affix: false}
      }
    ]
  },
  {
    path: '/aps/base-data/',
    component: Layout,
    redirect: 'index',
    meta: {title: 'Aps系统', icon: 'android-system', affix: false},
    children: [
      {
        path: '/aps/upload/index',
        name: "商品管理",
        component: () => import('@/views/system/aps/goods/index'),
        meta: {title: '商品管理', icon: 'order-1', affix: false}
      },  {
        path: '/aps/sale/index',
        name: "销售配置管理",
        component: () => import('@/views/system/aps/saleConfig/index'),
        meta: {title: '销售配置管理', icon: 'group', affix: false}
      }, {
        path: '/aps/project/index',
        name: "工程配置管理",
        component: () => import('@/views/system/aps/projectConfig/index'),
        meta: {title: '工程配置管理', icon: 'group', affix: false}
      }, {
        path: '/aps/goods/sale/index',
        name: "商品销售特征绑定",
        component: () => import('@/views/system/aps/goodsSaleConfig/index'),
        meta: {title: '商品销售特征绑定', icon: 'setting', affix: false}
      }, {
        path: '/aps/goods/forecast/index',
        name: "预测管理",
        component: () => import('@/views/system/aps/forecast/index'),
        meta: {title: '预测管理', icon: 'setting', affix: false}
      },
    ]
  },
  {
    path: '/base/index',
    component: Layout,
    redirect: 'index',
    meta: {title: '账户管理', icon: 'user', affix: false},
    children: [
      {
        path: '/login/account/index',
        component: () => import('@/views/loginAccount/index'),
        name: '账户管理',
        meta: {title: '账户管理', icon: 'peoples', affix: false}
      }, {
        path: '/supplier/index',
        name: "供应管理",
        component: () => import('@/views/system/supplier/index'),
        meta: {title: '供应管理', icon: 'pastebin', affix: false}
      }
    ]
  },
  {
    path: '/tenant/brand',
    component: Layout,
    redirect: 'index',
    meta: {title: '租户文件', icon: 'peoples', affix: false},
    children: [
      {
        path: '/views/tenant/index',
        component: () => import('@/views/system/tenant/index'),
        name: '租户管理',
        meta: {title: '租户管理', icon: '', affix: false}
      }, {
        path: '/views/factory/index',
        component: () => import('@/views/system/factory/index'),
        name: '工厂',
        meta: {title: '工厂管理', icon: '', affix: false}
      },
      {
        path: '/views/brand/index',
        component: () => import('@/views/system/brand/index'),
        name: '品牌管理',
        meta: {title: '品牌管理', icon: '', affix: false}
      }
    ]
  },
  {
    path: '/store',
    hidden: true,
    component: Layout,
    redirect: 'index',
    meta: {title: '门店管理', icon: 'shop', affix: false},
    children: [
      {
        path: '/store/manage/index',
        component: () => import('@/views/system/store/index'),
        name: '门店管理',
        meta: {title: '门店管理', icon: '', affix: false}
      },

    ]
  },
  {
    path: '/food/index',
    component: Layout,
    hidden: true,
    redirect: 'index',
    meta: {title: '菜品管理', icon: 'skill', affix: false},
    children: [
      {
        path: 'index',
        component: () => import('@/views/system/food/index'),
        name: '',
        meta: {title: '菜品管理', icon: 'redis', affix: false}
      }, {
        path: '1index',
        component: () => import('@/views/system/food/index'),
        meta: {title: '售卖趋势', icon: 'redis', affix: false}
      }
    ]
  },
  {
    path: '/map/',
    component: Layout,
    redirect: 'index',
    meta: {title: '地图', icon: 'international', affix: false},
    children: [
      {
        path: '/map/store/index',
        name: "高德门店地图",
        component: () => import('@/views/system/storeGaode/index'),
        meta: {title: '高德门店地图', icon: 'international', affix: false}
      }, {
        path: '/map/store/fence',
        name: "高德电子围栏",
        component: () => import('@/views/system/storeGaode/fence'),
        meta: {title: '高德电子围栏', icon: 'lock', affix: false}
      },
    ]
  }, {
    path: '/baseConfig/',
    component: Layout,
    redirect: 'index',
    meta: {title: '基础配置', icon: 'international', affix: false},
    children: [
      {
        path: '/prop/spec/index',
        name: "日历管理",
        component: () => import('@/views/system/calendar/index'),
        meta: {title: '日历管理', icon: 'calendar', affix: false}
      },
    ]
  }, {
    path: '/property/',
    component: Layout,
    redirect: 'index',
    meta: {title: '资产管理', icon: 'tools', affix: false},
    children: [
      {
        path: '/prop/storey/index',
        name: "楼层管理",
        component: () => import('@/views/system/storey/index'),
        meta: {title: '楼层管理', icon: 'storey', affix: false}
      }, {
        path: '/prop/room/index',
        name: "房间管理",
        component: () => import('@/views/system/room/index'),
        meta: {title: '房间管理', icon: 'room', affix: false}
      }, {
        path: '/prop/property/index',
        name: "资产管理",
        component: () => import('@/views/system/property/index'),
        meta: {title: '资产管理', icon: 'construction', affix: false}
      }, {

        path: '/prop/property/propertyScanQr',
        name: "扫码盘点",
        component: () => import('@/views/system/property/porpertyScanQr.vue'),
        meta: {title: '扫码盘点', icon: 'scan-qr-code', affix: false}
      }, {

        path: '/prop/property/propertyScanQrTest',
        name: "扫码盘点(测试)",
        component: () => import('@/views/system/property/porpertyScanQrTest.vue'),
        meta: {title: '扫码盘点(测试)', icon: 'scan-qr-code', affix: false}
      }, {

        path: '/prop/property/checkList',
        component: () => import('@/views/system/checkList'),
        name: "盘点管理",
        meta: {title: '盘点管理', icon: 'check-list', affix: false}
      },
    ]
  }, {
    path: '/base-data/',
    component: Layout,
    redirect: 'index',
    meta: {title: '基础信息', icon: 'international', affix: false},
    children: [
      {
        path: '/file/upload/index',
        name: "文件管理",
        component: () => import('@/views/system/fileUpload/index'),
        meta: {title: '文件管理', icon: 'calendar', affix: false}
      },
    ]
  }, {
    path: '/jxc/',
    component: Layout,
    redirect: 'index',
    meta: {title: '进存销', icon: 'international', affix: false},
    children: [
      {
        path: '/jcx/goods/index',
        name: "商品管理",
        component: () => import('@/views/system/jcx/goods/index'),
        meta: {title: '商品管理', icon: 'order-1', affix: false}
      },
      {
        path: '/order/index',
        name: "订单管理",
        component: () => import('@/views/system/jcx/order/index'),
        meta: {title: '订单管理', icon: 'order-1', affix: false}
      }, {
        path: '/goods/waring/index',
        name: "预警管理",
        component: () => import('@/views/system/jcx/orderWaring/index'),
        meta: {title: '预警管理', icon: 'warning', affix: false}
      }, {
        path: '/buy/plan/index',
        name: "购买计划",
        component: () => import('@/views/system/jcx/buyPlan/index'),
        meta: {title: '购买计划', icon: 'buy-car', affix: false}
      }, {
        path: '/buy/order/index',
        name: "采购订单",
        component: () => import('@/views/system/jcx/buyOrder/index'),
        meta: {title: '采购订单', icon: 'order-2', affix: false}
      },
    ]
  }
]

// 动态路由，基于用户权限动态去加载
export const dynamicRoutes = []

// 防止连续点击多次路由报错
let routerPush = Router.prototype.push;
let routerReplace = Router.prototype.replace;
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
  scrollBehavior: () => ({y: 0}),
  routes: constantRoutes
})
