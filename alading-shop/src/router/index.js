import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'

/** note: submenu only apppear when children.length>=1
*   detail see  https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
**/

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    roles: ['admin','editor']     will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if true ,the page will no be cached(default is false)
  }
**/

export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  // { path: '/register', component: () => import('@/views/login/register'), hidden: true },
  { path: '/authredirect', component: () => import('@/views/login/authredirect'), hidden: true },
  { path: '/404', component: () => import('@/views/errorPage/404'), hidden: true },
  { path: '/401', component: () => import('@/views/errorPage/401'), hidden: true }
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  // 店铺申请
  {
    path: '/shopApply',
    component: Layout,
    redirect: '/shopApply/applyIndex',
    name: 'shopApply',
    meta: { title: '店铺申请', icon: 'shoppingCard', roles: '0' },
    alwaysShow: true,
    children: [
      {
        path: 'applyIndex',
        component: () => import('@/views/shopApply/applyIndex'),
        name: 'applyIndex',
        meta: { title: '店铺类型' }
      },
      {
        path: 'exclusiveShop',
        component: () => import('@/views/shopApply/exclusiveShop'),
        name: 'exclusiveShop',
        meta: { title: '店铺申请资料', noCache: true },
        hidden: true
      },
      {
        path: 'auditing',
        component: () => import('@/views/shopApply/auditing'),
        name: 'auditing',
        meta: { title: '审核中', noCache: true },
        hidden: true
      },
      {
        path: 'auditFail',
        component: () => import('@/views/shopApply/auditFail'),
        name: 'auditFail',
        meta: { title: '审核失败', noCache: true },
        hidden: true
      },
      {
        path: 'auditSuccess',
        component: () => import('@/views/shopApply/auditSuccess'),
        name: 'auditSuccess',
        meta: { title: '审核成功', noCache: true },
        hidden: true
      }
    ]
  },

  // 店铺管理
  {
    path: '/',
    component: Layout,
    redirect: '/index',
    name: '店铺管理',
    meta: { title: '店铺管理', icon: 'component' },
    alwaysShow: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/index/index'),
        name: '店铺首页',
        meta: { title: '店铺首页', noCache: true }
      },
      {
        path: 'settings',
        component: () => import('@/views/settings/setting'),
        name: '店铺设置',
        meta: { title: '店铺设置', noCache: true, roles: '1' }
      },
      {
        path: 'information',
        component: () => import('@/views/informations/information'),
        name: '店铺信息',
        meta: { title: '店铺信息', onCache: true }   // , roles: '8'
      },
      {
        path: 'informationEdit',
        component: () => import('@/views/informations/informationEdit'),
        name:"店铺编辑",
        meta: { title: '店铺信息', onCache: true},
        hidden: true
      }
    ]
  },

  // 店铺装修
  {
    path: '/design',
    component: Layout,
    redirect: '/design/index',
    name: 'design',
    meta: { title: '店铺装修', icon: 'dashboard', roles: '8' },
    alwaysShow: true,
    children: [
      /* {
        path: 'designIndex',
        component: () => import('@/views/design/designIndex/index'),
        name: 'designIndex',
        meta: { title: '店铺首页装修', noCache: true }
      },
      {
        path: 'template',
        component: () => import('@/views/design/designIndex/template'),
        name: 'designTemplate',
        meta: { title: '装修模板', noCache: true },
        hidden: true
      },
      {
        path: 'preview',
        component: () => import('@/views/design/designIndex/preview'),
        name: 'previewTemplate',
        meta: { title: '预览', noCache: true },
        hidden: true
      }, */
      {
        path: 'shopWindow',
        component: () => import('@/views/design/shopWindow/index'),
        name: 'shopWindow',
        meta: { title: '店铺橱窗管理', noCache: true }
      }
    ]
  },

  // 商品管理
  {
    path: '/product',
    component: Layout,
    redirect: '/product/product',
    name: '商品管理',
    meta: { title: '商品管理', icon: 'list', noCache: true, roles: '3' },
    children: [
      {
        path: 'product',
        // component: () => import('@/views/product/index'),
        component: () => import('@/views/product/edit'),
        name: '发布商品',
        meta: { title: '发布商品', noCache: true }
      },
      {
        path: 'edit',
        component: () => import('@/views/product/edit'),
        name: '编辑商品',
        meta: { title: '编辑商品', noCache: true },
        hidden: true
      },
      {
        path: 'view',
        component: () => import('@/views/product/view'),
        name: '预览商品',
        meta: { title: '预览商品', noCache: true },
        hidden: true
      },
      {
        path: 'salePro',
        component: () => import('@/views/product/salePro'),
        name: '出售中的商品',
        meta: { title: '出售中的商品', noCache: true }
      },
      {
        path: 'storePro',
        component: () => import('@/views/product/storePro'),
        name: '仓库中的商品',
        meta: { title: '仓库中的商品', noCache: true }
      }
      // {
      //   path: 'goodsSelect',
      //   component: () => import('@/views/product/goodsSelect'),
      //   name: 'goodsSelect',
      //   meta: { title: '选择商品', noCache: true },
      //   hidden: true
      // }
    ]
  },

  // 交易管理
  {
    path: '/deal',
    component: Layout,
    name: 'deal',
    redirect: '/deal/order',
    meta: { title: '交易管理', icon: 'nested', roles: '4' },
    children: [
      {
        path: 'order',
        component: () => import('@/views/deal/order/index'),
        name: 'order',
        meta: { title: '订单管理', noCache: true }
      },
      {
        path: 'afterService',
        component: () => import('@/views/deal/afterService'),
        name: 'afterService',
        meta: { title: '售后管理', noCache: true },
      },
      {
        path: 'orderDetail/:id',
        component: () => import('@/views/deal/order/orderDetail.vue'),
        name: 'orderDetail',
        meta: { title: '订单详情', noCache: true },
        hidden: true
      },
      {
        path: 'afterServiceDetail',
        component: () => import('@/views/deal/afterService/afterServiceDetail.vue'),
        name: 'afterServiceDetail',
        meta: { title: '售后详情', noCache: true },
        hidden: true
      }
    ]
  },

  // 结算管理
  {
    path: '/settleManage',
    component: Layout,
    redirect: '/settleManage/index',
    name: 'settleManage',
    meta: { title: '结算管理', icon: 'edit', roles: '5' },
    alwaysShow: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/settleManage/index'),
        name: 'settleOrder',
        meta: { title: '结算订单', noCache: true }
      },
      {
        path: 'settleInfo/:id(\\d+)',
        component: () => import('@/views/settleManage/settleInfo'),
        name: 'settleInfo',
        meta: { title: '结算详情', noCache: true },
        hidden: true
      }
    ]
  },

  // 营销中心
  {
    path: '/marketing',
    component: Layout,
    redirect: '/marketing/shopMarketing/discountCoupon',
    name: 'marketing',
    meta: { title: '营销中心', icon: 'example', roles: '6' },
    children: [
      // 活动报名模块======================
      {
        path: 'joinActivity',
        component: () => import('@/views/marketing/joinActivity/index'),
        redirect: '/marketing/joinActivity/joinable',
        name: 'joinActivity',
        meta: { title: '活动报名' },
        children: [
          // 可报名的活动
          {
            path: 'joinable',
            component: () => import('@/views/marketing/joinActivity/joinable/index'),
            name: 'joinable',
            meta: { title: '可报名的活动', noCache: true }
          },
          {
            path: 'joinableActivityDetail',
            component: () => import('@/views/marketing/joinActivity/joinable/activityDetail'),
            name: 'joinableActivityDetail',
            meta: { title: '报名详情', noCache: true },
            hidden: true
          },
          {
            path: 'joinableEditActivityGoods',
            component: () => import('@/views/marketing/joinActivity/joinable/editActivityGoods'),
            name: 'joinableEditActivityGoods',
            meta: { title: '编辑报名信息', noCache: true },
            hidden: true
          },
          // 已参与的活动
          {
            path: 'joined',
            component: () => import('@/views/marketing/joinActivity/joined/index'),
            name: 'joined',
            meta: { title: '已参与的活动', noCache: true }
          },
          {
            path: 'joinedActivityDetail',
            component: () => import('@/views/marketing/joinActivity/joined/activityDetail'),
            name: 'joinedActivityDetail',
            meta: { title: '活动详情', noCache: true },
            hidden: true
          }
        ]
      },
      // 营销工具模块======================
      {
        path: 'shopMarketing',
        component: () => import('@/views/marketing/shopMarketing/index'),
        redirect: '/marketing/shopMarketing/discountCoupon',
        name: 'shopMarketing',
        meta: { title: '店铺营销工具' },
        children: [
          // 优惠券
          {
            path: 'discountCoupon',
            component: () => import('@/views/marketing/shopMarketing/discountCoupon/index'),
            name: 'discountCoupon',
            meta: { title: '优惠券', noCache: true }
          },
          {
            path: 'addCoupon',
            component: () => import('@/views/marketing/shopMarketing/discountCoupon/addCoupon'),
            name: 'addCoupon',
            meta: { title: '新增优惠券', noCache: true },
            hidden: true
          },
          {
            path: 'editCoupon',
            component: () => import('@/views/marketing/shopMarketing/discountCoupon/editCoupon'),
            name: 'editCoupon',
            meta: { title: '编辑优惠券', noCache: true },
            hidden: true
          },
          {
            path: 'detailCoupon',
            component: () => import('@/views/marketing/shopMarketing/discountCoupon/detailCoupon'),
            name: 'detailCoupon',
            meta: { title: '优惠券详情', noCache: true },
            hidden: true
          },
          {
            path: 'sendCoupon',
            component: () => import('@/views/marketing/shopMarketing/discountCoupon/sendCoupon'),
            name: 'sendCoupon',
            meta: { title: '发放优惠券', noCache: true },
            hidden: true
          },
          // 店铺促销
          {
            path: 'salesIndex',
            component: () => import('@/views/marketing/shopMarketing/salesPromotion/salesIndex'),
            name: 'salesIndex',
            meta: { title: '店铺促销', noCache: true }
          },
          {
            path: 'editActivity/:id(\\d+)',
            component: () => import('@/views/marketing/shopMarketing/salesPromotion/editActivity'),
            name: 'editActivity',
            meta: { title: '编辑活动', noCache: true },
            hidden: true
          },
          {
            path: 'addActivity',
            component: () => import('@/views/marketing/shopMarketing/salesPromotion/addActivity'),
            name: 'addActivity',
            meta: { title: '新增活动', noCache: true },
            hidden: true
          },
          {
            path: 'setPrice',
            component: () => import('@/views/marketing/shopMarketing/salesPromotion/setPrice'),
            name: 'setPrice',
            meta: { title: '设置活动价格', noCache: true },
            hidden: true
          },
          {
            path: 'manageGood',
            component: () => import('@/views/marketing/shopMarketing/salesPromotion/manageGood'),
            name: 'manageGood',
            meta: { title: '管理活动商品', noCache: true },
            hidden: true
          },
          // 满减活动
          {
            path: 'fullIndex',
            component: () => import('@/views/marketing/shopMarketing/fullReduction/index'),
            name: 'fullIndex',
            meta: { title: '满减活动', noCache: true }
          },
          {
            path: 'addFullActivity',
            component: () => import('@/views/marketing/shopMarketing/fullReduction/addActivity'),
            name: 'addFullActivity',
            meta: { title: '增加满减活动', noCache: true },
            hidden: true
          },
          {
            path: 'editFullActivity/:id(\\d+)',
            component: () => import('@/views/marketing/shopMarketing/fullReduction/editActivity'),
            name: 'editFullActivity',
            meta: { title: '编辑满减活动', noCache: true },
            hidden: true
          },
          {
            path: 'setGood',
            component: () => import('@/views/marketing/shopMarketing/fullReduction/setGood'),
            name: 'setGood',
            meta: { title: '选择商品', noCache: true },
            hidden: true
          }
        ]
      }
    ]
  },

  // 规则中心
  {
    path: '/rule',
    component: Layout,
    redirect: '/ruleCenter/ruleList',
    name: 'ruleCenter',
    meta: { title: "规则中心", icon: 'nested', roles: '7'},
    alwaysShow: true,
    children: [
       {
        path: 'ruleList',
        component: () => import('@/views/ruleCenter/ruleList'),
        name: 'ruleList',
        meta: { title: '平台规则', noCache: true}
       },
       {
         path: 'ruleDetails/:id',
         component: () => import('@/views/ruleCenter/ruleDetails'),
         name: 'ruleDetails',
         meta: { title: '规则详情', noCache: true },
         hidden: true
       },
       {
         path: 'merchantAgreementList',
         component: () => import('@/views/ruleCenter/merchantAgreementList'),
         name: 'merchantAgreementList',
         meta: { title: '商家协议', noCache: true }
       },
       {
         path: 'agreementDetails/:id',
         component: () => import('@/views/ruleCenter/agreementDetails'),
         name: 'agreementDetails',
         meta: { title: '协议详情', noCache: true },
         hidden: true
       }
    ]
  },

  // 数据中心
  // {
  //   path: '/datacenter',
  //   component: Layout,
  //   redirect: '/datacenter',
  //   name: 'marketing',
  //   meta: { title: '数据中心', icon: 'example', roles: '7' },
  //   alwaysShow: true,
  //   children: [{
  //     path: 'board',
  //     component: () => import('@/views/datacenter/board'),
  //     name: '数据看板',
  //     meta: { title: '数据看板', icon: 'dashboard', noCache: true }
  //   }]
  // },

  { path: '*', redirect: '/404', hidden: true }

]
