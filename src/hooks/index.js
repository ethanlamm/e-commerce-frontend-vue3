// 提供复用逻辑的函数(钩子)
// https://vueuse.org/core/useIntersectionObserver/#useintersectionobserver
// 数据懒加载：使用 @vueuse/core 提供的 useIntersectionObserver，监视 DOM 元素是否进入可视区；
// 当进入可视区时，停止 stop 监视(防止多次加载数据)，然后发请求获得数据

import { useIntersectionObserver } from '@vueuse/core'
import { ref } from 'vue'
/**
 *  数据懒加载函数
 * @param {Element} target 监视的DOM元素
 * @param {Function} apiFn 请求api
 * @returns {Array}
 */
export const useLazyData = (target, apiFn) => {
  // 解析：target--监视DOM对象；apiFn--请求api；
  // stop--停止监听(函数)；isIntersecting--是否进入可视区(Boolean)
  const res = ref([])
  const { stop } = useIntersectionObserver(
    target,
    ([{ isIntersecting }], observerElement) => {
      if (isIntersecting) {
        // 1.停止监听
        stop()
        // 2.发请求
        apiFn().then(data => {
          res.value = data.result
        })
      }
    },
    // 配置选项
    {
      threshold: 0
    }
  )
  // 返回请求到的数据
  return res
}
