import { createRouter, createWebHistory } from 'vue-router'

import Login from '../views/Login.vue'
import SystemIndex from '../views/Index.vue'
import HomeView from '../views/Home.vue'
import AssignmentMark from '../views/AssignmentMark.vue'
import UserManager from '../views/StudentManager.vue'
import BrandManager from '../views/Brand.vue'
import AssignmentManager from '../views/AssignmentManager.vue'
import Video from '../views/Video.vue'
import TRTC from '../views/Rtc.vue'

// 路由规则
const routes = [
  //重定向模块
  {
    path: '/',
    redirect: '/login'
  },
  //登录模块
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  //系统模块
  {
    path: '/index', //地址
    name: 'index', //名称
    meta: {
      title: '系统'
    },
    component: SystemIndex, //切换路由地址时展示的组件
    children:
      [
        {
          path: '/home', //地址
          name: 'home', //名称
          meta: {
            title: '个人首页'
          },
          component: HomeView
        },
        {
          path: '/brand',
          name: 'brand',
          meta: {
            title: '商品管理'
          },
          component: BrandManager
        },
        {
          path: '/user',
          name: 'user',
          meta: {
            title: '用户管理'
          },
          component: UserManager
        },
        {
          path: '/assignment',
          name: '/assignment',
          meta: {
            title: '实验管理'
          },
          component: AssignmentManager
        },
        {
          path: '/mark',
          name: 'mark',
          meta: {
            title: '教师评分'
          },
          component: AssignmentMark
        },
        {
          path: '/video',
          name: 'video',
          meta: {
            title: '视频'
          },
          component: TRTC
        }
      ]
  }, 
]

// 创建路由对象
const router = createRouter({
  history: createWebHistory(),
  routes
})

// 暴露路由对象
export default router
