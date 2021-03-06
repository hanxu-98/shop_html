import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: () => import(/* webpackChunkName: "login" */ '../components/page/Login.vue'),
      meta: { title: '登录' }
    },
    {
      path: '/show',
      component: () => import(/* webpackChunkName: "home" */ '../components/common/Home.vue'),
      meta: {title: '自述文件'},
      children: [
              {
                path: '/dashboard',
                component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/Dashboard.vue'),
                meta: {title: '系统首页'}
              },
              {
                path: '/band',
                component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/Band.vue'),
                meta: {title: '品牌管理'}
              },{
                path: '/Product',
                component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/Product.vue'),
                meta: {title: '商品添加'}
              },{
                path: '/ProductShow',
                component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/ProductShow.vue'),
                meta: {title: '商品展示'}
              },
              {
                  path: '/test',
                  component: () => import(/* webpackChunkName: "icon" */ '../components/Test.vue'),
                  meta: { title: '测试' }
              },
              {
                  path: '/Type',
                  component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/Type.vue'),
                  meta: {title: '分类管理'}
              },
              {
                path: '/Menu',
                component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/Menu.vue'),
                meta: {title: '权限管理'}
              },
              {
                path: '/Role',
                component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/Role.vue'),
                meta: {title: '角色管理'}
              },
              {
                path: '/User',
                component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/User.vue'),
                meta: {title: '角色管理'}
              },
              {
                  path: '/Attr',
                  component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/Attr.vue'),
                  meta: {title: '分类管理'}
              }

      ]
    }
  ]
})
