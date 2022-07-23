// 组件注册为app应用实例插件

// 插件=>扩展vue原有的功能：全局组件，自定义指令，挂载原型方法，注意：vue3.0没有全局过滤器
// vue2.0插件写法要素：导出一个对象，有install函数，默认传入了Vue构造函数，Vue基础之上扩展
// vue3.0插件写法要素：导出一个对象，有install函数，默认传入了app应用实例，app基础之上扩展

// import XtxSkeleton from './xtx-skeleton.vue'
// import XtsCarousel from './xtx-carousel.vue'
// import XtxMore from './xtx-more.vue'
// import XtxBread from './xtx-bread.vue'
// import XtxBreadItem from './xtx-bread-item.vue'

// 使用自动注册
// 函数 context(指定目录，是否加载子目录，需要的文件)
// 函数 importFn：
// 1.可根据路径来导入组件
// 2.其属性 keys{ Function } 可获取依据 context函数配置项的所有文件路径
// console.log(importFn.keys());

// 默认图片
import defaultImg from '@/assets/images/200.png'
const importFn = require.context('./', false, /\.vue$/)

// 图片懒加载
// 原理：将请求服务器返回的图片地址传给自定义指令，当进入可视区时，将自定义指令中存储的图片地址赋值给绑定指令的元素的 src，从而展示图片
const defineDirective = (app) => {
  // 1.图片懒加载指令 v-lazy
  app.directive('lazy', {
    // vue2.0 监听使用指令的 DOM 是否创建完成  inserted
    // vue3.0 监听使用指令的 DOM 是否创建完成 mounted
    mounted (el, binding) {
      // 2.创建一个观察对象
      // IntersectionObserver(callbackFn，options)
      const observer = new IntersectionObserver(
        ([{ isIntersecting }]) => {
          // 监视内部逻辑
          if (isIntersecting) {
            // 进入可视区 isIntersecting = true
            // 停止观察
            observer.unobserve(el)
            // 若数据请求失败或其他原因，展示默认图片
            el.onerror = () => {
              el.src = defaultImg
            }
            // 把自定义指令存储的值赋值给绑定元素的 src
            el.src = binding.value
          }
        },
        // 配置项
        {
          threshold: 0
        }
      )
      // 3.监视绑定的DOM元素
      observer.observe(el)
    }
  })
}

export default {
  install (app) {
    // 在app上进行扩展，app提供 component directive 函数(自定义指令)
    // 如果要挂载原型 app.config.globalProperties 方式
    // app.component(XtxSkeleton.name, XtxSkeleton)
    // app.component(XtsCarousel.name, XtsCarousel)
    // app.component(XtxMore.name, XtxMore)
    // app.component(XtxBread.name, XtxBread)
    // app.component(XtxBreadItem.name, XtxBreadItem)

    // 引入组件的同时进行注册
    importFn.keys().forEach(item => {
      // 引入组件：每个组件都是默认暴露 default
      const component = importFn(item).default
      // 注册
      app.component(component.name, component)
    })


    defineDirective(app)
  }
}
// 导出后，在main.js使用
