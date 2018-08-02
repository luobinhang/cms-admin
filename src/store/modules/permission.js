import { constantRouterMap } from '@/router'
import { handleData } from '@/utils/routerHandle'
import { getRoleResource } from '@/api/login'
import Layout from '@/views/layout/Layout'

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        getRoleResource({
          roleUuid: data,
          systemType: 2,
        }).then(response => {
          let asyncRouterMap = [...handleData(response.data)]
          commit('SET_ROUTERS', asyncRouterMap)
          resolve()
        })
        // let asyncRouterMap = [
        //   {
        //     path: '/PC',
        //     component: Layout,
        //     redirect: '/PC/Consultation/ConsultationList',
        //     name: 'PC',
        //     meta: {
        //       title: 'PC官网',
        //       icon: 'pc'
        //     },
        //     children: [
        //       {
        //         path: '/PC/Consultation',
        //         name: 'Consultation',
        //         meta: { title: '咨询管理', icon: ' ' },
        //         component: _import('PC/Consultation/index'),
        //         children: [
        //           {
        //             path: 'ConsultationList',
        //             name: 'ConsultationList',
        //             component:  _import('PC/Consultation/ConsultationList/index'),
        //             meta: { title: '资讯列表' },
        //           },
        //           {
        //             path: 'ConsultationCreat',
        //             component: _import('PC/Consultation/ConsultationCreat/index'),
        //             name: 'ConsultationCreat',
        //             meta: { title: '资讯编辑' },
        //             hidden: true
        //           },
        //           {
        //             path: 'recycleBin',
        //             name: 'recycleBin',
        //             component:  _import('PC/Consultation/recycleBin/index'),
        //             meta: { title: '回收站' }
        //           },
        //           {
        //             path: 'tagManage',
        //             name: 'tagManage',
        //             component:  _import('PC/Consultation/tagManage/index'),
        //             meta: { title: '标签管理' }
        //           },
        //
        //         ]
        //       },
        //       {
        //         path: '/PC/SystemMaintenance',
        //         name: 'SystemMaintenance',
        //         meta: { title: '系统维护', icon: 'system' },
        //         component: _import('PC/Consultation/index'),
        //         children: [
        //           {
        //             path: 'friendshipLink',
        //             name: 'friendshipLink',
        //             component:  _import('PC/SystemMaintenance/friendshipLink/index'),
        //             meta: { title: '友情链接' }
        //           },
        //           {
        //             path: 'footerManage',
        //             name: 'footerManage',
        //             component:  _import('PC/SystemMaintenance/footerManage/index'),
        //             meta: { title: '底部管理' }
        //           },
        //           {
        //             path: 'webMap',
        //             name: 'webMap',
        //             component:  _import('PC/SystemMaintenance/webMap/index'),
        //             meta: { title: '网站地图' }
        //           },
        //         ]
        //       },
        //     ]
        //   },
        //   {
        //     path: '/Mobile',
        //     component: Layout,
        //     redirect: '/Mobile/BannerManage',
        //     name: 'Mobile',
        //     alwaysShow: true,
        //     meta: {
        //       title: '移动端官网',
        //       icon: 'mobile'
        //     },
        //     children: [
        //       {
        //         path: 'BannerManage',
        //         name: 'BannerManage',
        //         meta: { title: 'Banner管理', icon: 'banner' },
        //         component:  _import('Mobile/BannerManage/index'),
        //       },
        //     ]
        //   },
        //   {
        //     path: '/Authority',
        //     name: 'Authority',
        //     component: Layout,
        //     redirect: '/Authority/RouterManage',
        //     meta: { title: '权限管理', icon: 'authority' },
        //     children: [
        //       {
        //         path: 'RouterManage',
        //         name: 'RouterManage',
        //         component:  _import('Authority/RouterManage/index'),
        //         meta: { title: '路由管理', icon: 'tree'  }
        //       },
        //       {
        //         path: 'UserManage',
        //         name: 'UserManage',
        //         component:  _import('Authority/UserManage/index'),
        //         meta: { title: '角色管理', icon: 'userManage' }
        //       },
        //     ]
        //   },
        // ];
        // asyncRouterMap.push({ path: '*', redirect: '/404', hidden: true })
        // commit('SET_ROUTERS', asyncRouterMap)
        // resolve()
      })
    }
  }
}

export default permission
