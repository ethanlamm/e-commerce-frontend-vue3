import { createRouter, createWebHashHistory } from 'vue-router'
import store from '@/store'

const routes = [
  {
    path: '/',
    component: () => import('@/views/Layout'),
    children: [
      {
        path: '/',
        component: () => import('@/views/home')
      },
      {
        path: '/category/:id',
        component: () => import('@/views/category')
      },
      {
        path: '/category/sub/:id',
        component: () => import('@/views/category/subCategory')
      },
      {
        path: '/product/:id',
        component: () => import('@/views/goods')
      },
      {
        path: '/cart',
        component: () => import('@/views/cart')
      },
      {
        path: '/member/checkout',
        component: () => import('@/views/member/checkout')
      },
      {
        path: '/member/pay',
        component: () => import('@/views/member/pay')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login')
  },
  {
    // 该地址与在index.html中的data - redirecturi应保持一致
    path: '/login/callback',
    component: () => import('@/views/login/callback')
  }

]

const router = createRouter({
  // 使用hash模式：QQ登录后重跳转的url是使用hash模式的
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
  // 每次切换路由滚动到页面顶部
  // vue2.0 x，y
  // vue3.0 left，top
  scrollBehavior () {
    return { left: 0, top: 0 }
  }
})

// 前置路由守卫
router.beforeEach((to, from, next) => {
  // 路径以 /member 开头的都需要先登录(token)
  const { profile } = store.state.user
  if (!profile.token && to.path.startsWith('/member')) {
    return next('/login?redirectUrl=' + encodeURIComponent(to.fullPath))
  }
  next()
})

export default router
