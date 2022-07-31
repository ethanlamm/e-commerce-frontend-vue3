import { createRouter, createWebHistory } from 'vue-router'


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
  history: createWebHistory(process.env.BASE_URL),
  routes,
  // 每次切换路由滚动到页面顶部
  // vue2.0 x，y
  // vue3.0 left，top
  scrollBehavior () {
    return { left: 0, top: 0 }
  }
})

export default router
